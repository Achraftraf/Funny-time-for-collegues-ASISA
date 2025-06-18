// app/components/GamePlay.jsx
"use client";
import { useState, useEffect } from "react";
import { Clock, Send, Users, Trophy, Lightbulb, ArrowRight } from "lucide-react";

const GamePlay = ({
  room,
  myTeam,
  playerId,
  isHost,
  onSubmitExplanation,
  onRequestJudging,
  onAwardPoints,
  onNextRound,
  onResetGame
}) => {
  const [explanation, setExplanation] = useState("");
  const [timeLeft, setTimeLeft] = useState(room.timeLeft || 180);

  // Timer effect
  useEffect(() => {
    if (room.gameState === 'team1-explain' || room.gameState === 'team2-explain') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [room.gameState, room.timerStart]);

  // Update timeLeft when room updates
  useEffect(() => {
    if (room.timeLeft !== undefined) {
      setTimeLeft(room.timeLeft);
    }
  }, [room.timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTeamName = () => {
    return room.currentTeam === 1 ? room.teamNames.team1 : room.teamNames.team2;
  };

  const isMyTeamTurn = () => {
    return myTeam === room.currentTeam;
  };

  const handleSubmitExplanation = () => {
    if (explanation.trim()) {
      onSubmitExplanation(myTeam, explanation.trim());
      setExplanation("");
    }
  };

  // Render based on game state
  if (room.gameState === 'team1-explain' || room.gameState === 'team2-explain') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-blue-500'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {getCurrentTeamName()}'s Turn to Explain
          </h2>
        </div>

        {/* Current Term */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Explain this term:</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            {room.currentTerm?.en || room.currentTerm}
          </h3>
        </div>

        {/* Team Status */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 ${
            room.currentTeam === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h4 className="font-bold text-blue-800 mb-2">{room.teamNames.team1}</h4>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{room.teams.team1?.length || 0} players</span>
            </div>
            {room.explanations.team1 && (
              <div className="mt-2 text-sm text-green-600">✓ Explanation submitted</div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            room.currentTeam === 2 ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h4 className="font-bold text-purple-800 mb-2">{room.teamNames.team2}</h4>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{room.teams.team2?.length || 0} players</span>
            </div>
            {room.explanations.team2 && (
              <div className="mt-2 text-sm text-green-600">✓ Explanation submitted</div>
            )}
          </div>
        </div>

        {/* Explanation Input */}
        {isMyTeamTurn() ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold mb-3">Your team's explanation:</h4>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain this term in your own words... Be creative!"
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {explanation.length}/500 characters
              </span>
              <button
                onClick={handleSubmitExplanation}
                disabled={!explanation.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  explanation.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Submit Explanation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">
              Waiting for {getCurrentTeamName()} to submit their explanation...
            </p>
          </div>
        )}

        {/* Host Controls */}
        {isHost && room.explanations.team2 && (
          <div className="mt-6 text-center">
            <button
              onClick={onRequestJudging}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-2 mx-auto"
            >
              <Trophy className="w-5 h-5" />
              Request AI Judge Review
            </button>
          </div>
        )}
      </div>
    );
  }

  if (room.gameState === 'judging') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">AI Judge is Reviewing...</h2>
        <p className="text-gray-600">The AI judge is analyzing both explanations...</p>
      </div>
    );
  }

  if (room.gameState === 'results') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">🏆 Round Results</h2>
        
        {/* Term */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <h3 className="text-xl font-bold">{room.currentTerm?.en || room.currentTerm}</h3>
        </div>

        {/* Explanations */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">{room.teamNames.team1}</h4>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
              {room.explanations.team1}
            </p>
          </div>
          
          <div className="border border-purple-200 rounded-lg p-4">
            <h4 className="font-bold text-purple-800 mb-2">{room.teamNames.team2}</h4>
            <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded">
              {room.explanations.team2}
            </p>
          </div>
        </div>

        {/* AI Judge Response */}
        {room.judgeResponse && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">🤖 AI Judge Says:</h4>
            <p className="text-gray-700">{room.judgeResponse}</p>
          </div>
        )}

        {/* Current Scores */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-blue-800">{room.teamNames.team1}</h4>
            <div className="text-2xl font-bold text-blue-600">{room.scores.team1}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-purple-800">{room.teamNames.team2}</h4>
            <div className="text-2xl font-bold text-purple-600">{room.scores.team2}</div>
          </div>
        </div>

        {/* Host Controls */}
        {isHost && (
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onAwardPoints('team1')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                +1 Point to {room.teamNames.team1}
              </button>
              <button
                onClick={() => onAwardPoints('team2')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                +1 Point to {room.teamNames.team2}
              </button>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onNextRound()}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Next Round
              </button>
              <button
                onClick={onResetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                Reset Game
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default GamePlay;