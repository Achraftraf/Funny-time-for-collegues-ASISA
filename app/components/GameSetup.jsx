// app/components/GameSetup.jsx
"use client";
import { useState } from "react";
import { Lightbulb, Play, Sparkles } from "lucide-react";

const GameSetup = ({ 
  players, 
  teams, 
  team1Name, 
  setTeam1Name, 
  team2Name, 
  setTeam2Name, 
  myTeam, 
  isHost, 
  isLoading, 
  onJoinTeam, 
  onStartGame, 
  onStartWithCustomTerm 
}) => {
  const [customTerm, setCustomTerm] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleStartWithCustomTerm = () => {
    if (customTerm.trim()) {
      onStartWithCustomTerm(customTerm.trim());
      setCustomTerm("");
      setShowCustomInput(false);
    }
  };

  const canStartGame = teams.team1?.length > 0 && teams.team2?.length > 0;

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎯 Game Setup</h2>
      
      {/* Players List */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Players in Room ({players.length})</h3>
        <div className="grid md:grid-cols-3 gap-2">
          {players.map((player, idx) => (
            <span key={player.id || idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {player.name} {player.isHost && <span className="text-yellow-500">👑</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Team Assignment */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border-2 border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-blue-800">
              {team1Name || 'Team Alpha'}
            </h3>
            {isHost && (
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Team Name"
                className="text-sm p-1 border rounded max-w-24"
                maxLength={15}
              />
            )}
          </div>
          <div className="space-y-2 min-h-[80px]">
            {teams.team1?.map((player, idx) => (
              <div key={player.id || idx} className="bg-blue-50 px-2 py-1 rounded text-sm flex items-center justify-between">
                <span>{player.name}</span>
                {player.isHost && <span className="text-yellow-500 text-xs">👑</span>}
              </div>
            ))}
            {teams.team1?.length === 0 && (
              <div className="text-gray-400 text-sm italic text-center py-4">
                No players yet
              </div>
            )}
          </div>
          {myTeam !== 1 && (
            <button
              onClick={() => onJoinTeam(1)}
              className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition duration-200 transform hover:scale-105"
            >
              Join {team1Name || 'Team Alpha'}
            </button>
          )}
          {myTeam === 1 && (
            <div className="w-full mt-2 bg-blue-100 text-blue-800 px-4 py-2 rounded font-medium text-center">
              You're on this team! ✓
            </div>
          )}
        </div>

        <div className="border-2 border-purple-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-purple-800">
              {team2Name || 'Team Beta'}
            </h3>
            {isHost && (
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="Team Name"
                className="text-sm p-1 border rounded max-w-24"
                maxLength={15}
              />
            )}
          </div>
          <div className="space-y-2 min-h-[80px]">
            {teams.team2?.map((player, idx) => (
              <div key={player.id || idx} className="bg-purple-50 px-2 py-1 rounded text-sm flex items-center justify-between">
                <span>{player.name}</span>
                {player.isHost && <span className="text-yellow-500 text-xs">👑</span>}
              </div>
            ))}
            {teams.team2?.length === 0 && (
              <div className="text-gray-400 text-sm italic text-center py-4">
                No players yet
              </div>
            )}
          </div>
          {myTeam !== 2 && (
            <button
              onClick={() => onJoinTeam(2)}
              className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-medium transition duration-200 transform hover:scale-105"
            >
              Join {team2Name || 'Team Beta'}
            </button>
          )}
          {myTeam === 2 && (
            <div className="w-full mt-2 bg-purple-100 text-purple-800 px-4 py-2 rounded font-medium text-center">
              You're on this team! ✓
            </div>
          )}
        </div>
      </div>

      {/* Game Requirements */}
      {!canStartGame && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-800">
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">Setup Required</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Each team needs at least 1 player to start the game.
          </p>
        </div>
      )}

      {/* Start Game (Host Only) */}
      {isHost && (
        <div className="space-y-4">
          <button
            onClick={onStartGame}
            disabled={!canStartGame || isLoading}
            className={`w-full px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
              canStartGame && !isLoading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Game with Random Term
              </>
            )}
          </button>

          {/* Custom Term Option */}
          <div className="text-center">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-sm text-gray-600 hover:text-gray-800 underline flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Or start with custom term
            </button>
          </div>

          {showCustomInput && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <input
                type="text"
                value={customTerm}
                onChange={(e) => setCustomTerm(e.target.value)}
                placeholder="Enter your custom term (e.g., 'Microservices', 'GraphQL')"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
                onKeyPress={(e) => e.key === 'Enter' && handleStartWithCustomTerm()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleStartWithCustomTerm}
                  disabled={!customTerm.trim() || !canStartGame || isLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    customTerm.trim() && canStartGame && !isLoading
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Start with "{customTerm}"
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTerm("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Non-host message */}
      {!isHost && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            Waiting for the host to start the game...
          </p>
        </div>
      )}
    </div>
  );
};

export default GameSetup;