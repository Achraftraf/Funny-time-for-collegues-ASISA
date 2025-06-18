// app/components/LobbyScreen.jsx
"use client";
import { useState } from "react";

const LobbyScreen = ({ 
  playerName, 
  setPlayerName, 
  roomCode, 
  setRoomCode, 
  onCreateRoom, 
  onJoinRoom, 
  isLoading, 
  isConnected 
}) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-6">🚀 Join the Game!</h2>
      
      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !roomCode.trim() && onCreateRoom()}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={20}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCreateRoom}
            disabled={!playerName.trim() || isLoading || !isConnected}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105"
          >
            {isLoading ? "Creating..." : "Create Room"}
          </button>
          
          <button
            onClick={onJoinRoom}
            disabled={!playerName.trim() || !roomCode.trim() || isLoading || !isConnected}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105"
          >
            {isLoading ? "Joining..." : "Join Room"}
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Room code (to join existing room)"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && playerName.trim() && roomCode.trim() && onJoinRoom()}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={8}
        />
      </div>
    </div>
  );
};

export default LobbyScreen;