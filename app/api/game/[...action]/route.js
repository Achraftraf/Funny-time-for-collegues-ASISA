// app/api/game/[...action]/route.js - With Vercel KV Storage
import { kv } from '@vercel/kv';

// Helper functions
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Storage functions
async function getRoom(roomCode) {
  try {
    const room = await kv.get(`room:${roomCode}`);
    return room;
  } catch (error) {
    console.error('Error getting room:', error);
    return null;
  }
}

async function setRoom(roomCode, room) {
  try {
    // Set room data with 24 hour expiration
    await kv.setex(`room:${roomCode}`, 86400, room);
    return true;
  } catch (error) {
    console.error('Error setting room:', error);
    return false;
  }
}

async function deleteRoom(roomCode) {
  try {
    await kv.del(`room:${roomCode}`);
    return true;
  } catch (error) {
    console.error('Error deleting room:', error);
    return false;
  }
}

async function getAIJudgeFeedback(gameData) {
  try {
    // You can replace this with any free AI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Optional
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `You're a hilarious judge in a dev team game. Two teams explained "${gameData.term.en}":
Team ${gameData.team1Name}: "${gameData.team1Explanation}"
Team ${gameData.team2Name}: "${gameData.team2Explanation}"
Give funny, short feedback and decide the winner!`
        }],
        max_tokens: 200
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "The AI judge is having coffee! ☕ Both teams did great - you decide the winner!";
  }
}

// Main handler function
export async function GET(request, { params }) {
  return handler(request, { params });
}

export async function POST(request, { params }) {
  return handler(request, { params });
}

async function handler(req, { params }) {
  const { action } = params;
  const method = req.method;
  
  try {
    // Parse request body for POST requests
    let body = {};
    if (method === 'POST') {
      body = await req.json();
    }

    // Handle the action array - get the first element as the main action
    const mainAction = action[0];

    switch (mainAction) {
      case 'create-room':
        if (method === 'POST') {
          const { playerName, playerId } = body;
          const roomCode = generateRoomCode();
          
          const room = {
            code: roomCode,
            host: playerId,
            players: [{ id: playerId, name: playerName, isHost: true }],
            teams: { team1: [], team2: [] },
            gameState: 'setup',
            currentTerm: null,
            currentTeam: 1,
            explanations: { team1: '', team2: '' },
            scores: { team1: 0, team2: 0 },
            teamNames: { team1: 'Team Alpha', team2: 'Team Beta' },
            lastUpdate: Date.now()
          };
          
          const saved = await setRoom(roomCode, room);
          if (!saved) {
            return Response.json({ error: 'Failed to create room' }, { status: 500 });
          }
          
          return Response.json({ success: true, roomCode, room });
        }
        break;

      case 'join-room':
        if (method === 'POST') {
          const { roomCode, playerName, playerId } = body;
          const room = await getRoom(roomCode);
          
          if (!room) {
            return Response.json({ error: 'Room not found' }, { status: 404 });
          }
          
          // Check if player already exists
          const existingPlayer = room.players.find(p => p.name === playerName);
          if (existingPlayer) {
            return Response.json({ error: 'Player name already taken' }, { status: 400 });
          }
          
          room.players.push({ id: playerId, name: playerName, isHost: false });
          room.lastUpdate = Date.now();
          
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'join-team':
        if (method === 'POST') {
          const { roomCode, playerId, teamNumber } = body;
          const room = await getRoom(roomCode);
          
          if (!room) {
            return Response.json({ error: 'Room not found' }, { status: 404 });
          }
          
          const player = room.players.find(p => p.id === playerId);
          if (!player) {
            return Response.json({ error: 'Player not found' }, { status: 404 });
          }
          
          // Remove from other team
          room.teams.team1 = room.teams.team1.filter(p => p.id !== playerId);
          room.teams.team2 = room.teams.team2.filter(p => p.id !== playerId);
          
          // Add to selected team
          if (teamNumber === 1) {
            room.teams.team1.push(player);
          } else {
            room.teams.team2.push(player);
          }
          
          room.lastUpdate = Date.now();
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'start-game':
        if (method === 'POST') {
          const { roomCode, playerId, term, team1Name, team2Name } = body;
          const room = await getRoom(roomCode);
          
          if (!room || room.host !== playerId) {
            return Response.json({ error: 'Not authorized' }, { status: 403 });
          }
          
          room.currentTerm = term;
          room.gameState = 'team1-explain';
          room.currentTeam = 1;
          room.teamNames.team1 = team1Name || 'Team Alpha';
          room.teamNames.team2 = team2Name || 'Team Beta';
          room.explanations = { team1: '', team2: '' };
          room.timeLeft = 180; // 3 minutes
          room.timerStart = Date.now();
          room.lastUpdate = Date.now();
          
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'submit-explanation':
        if (method === 'POST') {
          const { roomCode, playerId, team, explanation } = body;
          const room = await getRoom(roomCode);
          
          if (!room) {
            return Response.json({ error: 'Room not found' }, { status: 404 });
          }
          
          // Verify player is on the team
          const isOnTeam = room.teams[`team${team}`].some(p => p.id === playerId);
          if (!isOnTeam) {
            return Response.json({ error: 'Not on this team' }, { status: 403 });
          }
          
          room.explanations[`team${team}`] = explanation;
          
          // Move to next phase
          if (team === 1) {
            room.gameState = 'team2-explain';
            room.currentTeam = 2;
            room.timerStart = Date.now();
          }
          
          room.lastUpdate = Date.now();
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'request-judging':
        if (method === 'POST') {
          const { roomCode, playerId } = body;
          const room = await getRoom(roomCode);
          
          if (!room || room.host !== playerId) {
            return Response.json({ error: 'Not authorized' }, { status: 403 });
          }
          
          room.gameState = 'judging';
          room.lastUpdate = Date.now();
          await setRoom(roomCode, room);
          
          // Get AI feedback
          const judgeResponse = await getAIJudgeFeedback({
            term: room.currentTerm,
            team1Name: room.teamNames.team1,
            team2Name: room.teamNames.team2,
            team1Explanation: room.explanations.team1,
            team2Explanation: room.explanations.team2
          });
          
          room.judgeResponse = judgeResponse;
          room.gameState = 'results';
          room.lastUpdate = Date.now();
          await setRoom(roomCode, room);
          
          return Response.json({ success: true, room, judgeResponse });
        }
        break;

      case 'award-points':
        if (method === 'POST') {
          const { roomCode, playerId, team } = body;
          const room = await getRoom(roomCode);
          
          if (!room || room.host !== playerId) {
            return Response.json({ error: 'Not authorized' }, { status: 403 });
          }
          
          room.scores[team]++;
          room.lastUpdate = Date.now();
          await setRoom(roomCode, room);
          
          return Response.json({ success: true, room });
        }
        break;

      case 'next-round':
        if (method === 'POST') {
          const { roomCode, playerId, term } = body;
          const room = await getRoom(roomCode);
          
          if (!room || room.host !== playerId) {
            return Response.json({ error: 'Not authorized' }, { status: 403 });
          }
          
          room.currentTerm = term;
          room.gameState = 'team1-explain';
          room.currentTeam = 1;
          room.explanations = { team1: '', team2: '' };
          room.timeLeft = 180;
          room.timerStart = Date.now();
          room.lastUpdate = Date.now();
          
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'reset-game':
        if (method === 'POST') {
          const { roomCode, playerId } = body;
          const room = await getRoom(roomCode);
          
          if (!room || room.host !== playerId) {
            return Response.json({ error: 'Not authorized' }, { status: 403 });
          }
          
          room.gameState = 'setup';
          room.currentTerm = null;
          room.currentTeam = 1;
          room.explanations = { team1: '', team2: '' };
          room.scores = { team1: 0, team2: 0 };
          room.teams = { team1: [], team2: [] };
          room.lastUpdate = Date.now();
          
          await setRoom(roomCode, room);
          return Response.json({ success: true, room });
        }
        break;

      case 'get-room':
        if (method === 'GET') {
          const roomCode = action[1];
          const room = await getRoom(roomCode);
          
          if (!room) {
            return Response.json({ error: 'Room not found' }, { status: 404 });
          }
          
          // Calculate time left if timer is running
          if (room.timerStart && (room.gameState === 'team1-explain' || room.gameState === 'team2-explain')) {
            const elapsed = Math.floor((Date.now() - room.timerStart) / 1000);
            room.timeLeft = Math.max(0, 180 - elapsed);
          }
          
          return Response.json({ room });
        }
        break;

      case 'leave-room':
        if (method === 'POST') {
          const { roomCode, playerId } = body;
          const room = await getRoom(roomCode);
          
          if (!room) {
            return Response.json({ error: 'Room not found' }, { status: 404 });
          }
          
          // Remove player
          room.players = room.players.filter(p => p.id !== playerId);
          room.teams.team1 = room.teams.team1.filter(p => p.id !== playerId);
          room.teams.team2 = room.teams.team2.filter(p => p.id !== playerId);
          
          // Reassign host if needed
          if (room.host === playerId && room.players.length > 0) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
          }
          
          // Delete room if empty
          if (room.players.length === 0) {
            await deleteRoom(roomCode);
          } else {
            room.lastUpdate = Date.now();
            await setRoom(roomCode, room);
          }
          
          return Response.json({ success: true });
        }
        break;

      default:
        return Response.json({ error: 'Action not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }

  // If no case matched, return 404
  return Response.json({ error: 'Action not found' }, { status: 404 });
}