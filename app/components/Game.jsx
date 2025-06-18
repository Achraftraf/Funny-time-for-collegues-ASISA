// app/components/Game.jsx
"use client";
import { useState, useEffect } from "react";
import GameSetup from "./GameSetup";
import GamePlay from "./GamePlay";
import { generateRandomTerm } from "../utils/gameUtils";

const Game = () => {
  const [playerId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [gamePhase, setGamePhase] = useState("join"); // join, lobby, playing
  const [team1Name, setTeam1Name] = useState("Team Alpha");
  const [team2Name, setTeam2Name] = useState("Team Beta");

  // Polling for room updates
  useEffect(() => {
    if (room?.code) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/game/get-room/${room.code}`);
          if (response.ok) {
            const data = await response.json();
            setRoom(data.room);
          }
        } catch (error) {
          console.error("Failed to update room:", error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [room?.code]);

  // API helper function
  const apiCall = async (endpoint, data = {}) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/game/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Room management
  const createRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      const result = await apiCall("create-room", {
        playerName: playerName.trim(),
        playerId
      });

      setRoom(result.room);
      setRoomCode(result.roomCode);
      setGamePhase("lobby");
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError("Please enter your name and room code");
      return;
    }

    try {
      const result = await apiCall("join-room", {
        roomCode: roomCode.trim().toUpperCase(),
        playerName: playerName.trim(),
        playerId
      });

      setRoom(result.room);
      setRoomCode(roomCode.trim().toUpperCase());
      setGamePhase("lobby");
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  const leaveRoom = async () => {
    if (room?.code) {
      try {
        await apiCall("leave-room", {
          roomCode: room.code,
          playerId
        });
      } catch (error) {
        console.error("Failed to leave room:", error);
      }
    }
    
    setRoom(null);
    setRoomCode("");
    setGamePhase("join");
    setError("");
  };

  // Game actions
  const joinTeam = async (teamNumber) => {
    try {
      const result = await apiCall("join-team", {
        roomCode: room.code,
        playerId,
        teamNumber
      });
      setRoom(result.room);
    } catch (error) {
      console.error("Failed to join team:", error);
    }
  };

  const startGame = async () => {
    try {
      const term = generateRandomTerm();
      const result = await apiCall("start-game", {
        roomCode: room.code,
        playerId,
        term,
        team1Name,
        team2Name
      });
      setRoom(result.room);
      setGamePhase("playing");
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const startWithCustomTerm = async (customTerm) => {
    try {
      const result = await apiCall("start-game", {
        roomCode: room.code,
        playerId,
        term: customTerm,
        team1Name,
        team2Name
      });
      setRoom(result.room);
      setGamePhase("playing");
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const submitExplanation = async (team, explanation) => {
    try {
      const result = await apiCall("submit-explanation", {
        roomCode: room.code,
        playerId,
        team,
        explanation
      });
      setRoom(result.room);
    } catch (error) {
      console.error("Failed to submit explanation:", error);
    }
  };

  const requestJudging = async () => {
    try {
      const result = await apiCall("request-judging", {
        roomCode: room.code,
        playerId
      });
      setRoom(result.room);
    } catch (error) {
      console.error("Failed to request judging:", error);
    }
  };

  const awardPoints = async (team) => {
    try {
      const result = await apiCall("award-points", {
        roomCode: room.code,
        playerId,
        team
      });
      setRoom(result.room);
    } catch (error) {
      console.error("Failed to award points:", error);
    }
  };

  const nextRound = async () => {
    try {
      const term = generateRandomTerm();
      const result = await apiCall("next-round", {
        roomCode: room.code,
        playerId,
        term
      });
      setRoom(result.room);
    } catch (error) {
      console.error("Failed to start next round:", error);
    }
  };

  const resetGame = async () => {
    try {
      const result = await apiCall("reset-game", {
        roomCode: room.code,
        playerId
      });
      setRoom(result.room);
      setGamePhase("lobby");
    } catch (error) {
      console.error("Failed to reset game:", error);
    }
  };

  // Helper functions
  const isHost = room?.host === playerId;
  const myTeam = room?.teams?.team1?.find(p => p.id === playerId) ? 1 : 
                 room?.teams?.team2?.find(p => p.id === playerId) ? 2 : null;

  // Update game phase based on room state
  useEffect(() => {
    if (room) {
      if (room.gameState === 'setup') {
        setGamePhase("lobby");
      } else {
        setGamePhase("playing");
      }
    }
  }, [room?.gameState]);

  // Join/Create Room Phase
  if (gamePhase === "join") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8">🎯 Dev Explain Game</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={createRoom}
                  disabled={isLoading || !playerName.trim()}
                  className={`p-3 rounded-lg font-medium transition duration-200 ${
                    !isLoading && playerName.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Room'}
                </button>

                <button
                  onClick={() => setGamePhase("joinRoom")}
                  disabled={!playerName.trim()}
                  className={`p-3 rounded-lg font-medium transition duration-200 ${
                    playerName.trim()
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Join Room
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>🎮 Explain tech terms to your team!</p>
              <p>🤖 AI judge decides the winner!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Join Room with Code Phase
  if (gamePhase === "joinRoom") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Join Room</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Code (e.g., ABC123)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={joinRoom}
                  disabled={isLoading || !roomCode.trim()}
                  className={`p-3 rounded-lg font-medium transition duration-200 ${
                    !isLoading && roomCode.trim()
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Joining...' : 'Join Room'}
                </button>

                <button
                  onClick={() => {
                    setGamePhase("join");
                    setRoomCode("");
                    setError("");
                  }}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Lobby Phase
  if (gamePhase === "lobby" && room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          {/* Room Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Room: {room.code}</h1>
                <p className="text-gray-600">Share this code with your friends!</p>
              </div>
              <button
                onClick={leaveRoom}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Game Setup */}
          <GameSetup
            players={room.players}
            teams={room.teams}
            team1Name={team1Name}
            setTeam1Name={setTeam1Name}
            team2Name={team2Name}
            setTeam2Name={setTeam2Name}
            myTeam={myTeam}
            isHost={isHost}
            isLoading={isLoading}
            onJoinTeam={joinTeam}
            onStartGame={startGame}
            onStartWithCustomTerm={startWithCustomTerm}
          />
        </div>
      </div>
    );
  }

  // Game Playing Phase
  if (gamePhase === "playing" && room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          {/* Room Header */}
          <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">Room: {room.code}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.teamNames.team1}: {room.scores.team1}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {room.teamNames.team2}: {room.scores.team2}
                  </span>
                </div>
              </div>
              <button
                onClick={leaveRoom}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Game Play */}
          <GamePlay
            room={room}
            myTeam={myTeam}
            playerId={playerId}
            isHost={isHost}
            onSubmitExplanation={submitExplanation}
            onRequestJudging={requestJudging}
            onAwardPoints={awardPoints}
            onNextRound={nextRound}
            onResetGame={resetGame}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Game;