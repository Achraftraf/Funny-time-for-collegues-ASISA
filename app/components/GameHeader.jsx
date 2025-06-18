// app/components/GameHeader.jsx
import { Clock, Users } from "lucide-react";
import { formatTime } from "../utils/gameUtils";

const GameHeader = ({ 
  roomCode, 
  isHost, 
  timeLeft, 
  gameState, 
  scores, 
  team1Name, 
  team2Name, 
  teams 
}) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        🧠 Explain It Like I'm 5
      </h1>
      <p className="text-gray-600">Multiplayer Dev Edition - Serverless Version!</p>
      
      {roomCode && (
        <div className="mt-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
            Room Code: {roomCode}
          </span>
          {isHost && <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">HOST</span>}
        </div>
      )}
      
      {/* Timer */}
      {timeLeft > 0 && (gameState === "team1-explain" || gameState === "team2-explain") && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <Clock className={`${timeLeft <= 30 ? 'text-red-500' : 'text-orange-500'}`} size={16} />
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            timeLeft <= 30 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}
      
      {/* Scoreboard */}
      {gameState !== "lobby" && (
        <div className="flex justify-center gap-8 mt-4">
          <div className="bg-white rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2">
              <Users className="text-blue-500" size={16} />
              <span className="font-semibold">{team1Name}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                {scores?.team1 || 0}
              </span>
              <span className="text-xs text-gray-500">({teams?.team1?.length || 0} players)</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2">
              <Users className="text-purple-500" size={16} />
              <span className="font-semibold">{team2Name}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-bold">
                {scores?.team2 || 0}
              </span>
              <span className="text-xs text-gray-500">({teams?.team2?.length || 0} players)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHeader;