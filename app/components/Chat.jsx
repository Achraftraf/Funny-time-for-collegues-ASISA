"use client";
import { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill, RiRefreshLine, RiTrophyLine } from "react-icons/ri";
import { HiOutlineUsers, HiOutlineLightBulb } from "react-icons/hi";

const ExplainItLike5Game = () => {
  const [gameState, setGameState] = useState("setup"); // setup, team1-explain, team2-explain, judging, results
  const [currentTerm, setCurrentTerm] = useState("");
  const [team1Name, setTeam1Name] = useState("Team Alpha");
  const [team2Name, setTeam2Name] = useState("Team Beta");
  const [team1Explanation, setTeam1Explanation] = useState("");
  const [team2Explanation, setTeam2Explanation] = useState("");
  const [judgeResponse, setJudgeResponse] = useState("");
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [customTerm, setCustomTerm] = useState("");
  const messagesEndRef = useRef(null);

  const techTerms = [
    { en: "API", ar: "واجهة برمجة التطبيقات", es: "Interfaz de Programación" },
    { en: "Database", ar: "قاعدة البيانات", es: "Base de Datos" },
    { en: "Cloud Computing", ar: "الحوسبة السحابية", es: "Computación en la Nube" },
    { en: "Machine Learning", ar: "التعلم الآلي", es: "Aprendizaje Automático" },
    { en: "Blockchain", ar: "سلسلة الكتل", es: "Cadena de Bloques" },
    { en: "Recursion", ar: "الاستدعاء المتكرر", es: "Recursión" },
    { en: "404 Error", ar: "خطأ 404", es: "Error 404" },
    { en: "Git", ar: "نظام التحكم بالإصدارات", es: "Control de Versiones" },
    { en: "Docker", ar: "حاويات التطبيقات", es: "Contenedores" },
    { en: "Kubernetes", ar: "إدارة الحاويات", es: "Orquestación de Contenedores" }
  ];

  const startNewRound = () => {
    const randomTerm = techTerms[Math.floor(Math.random() * techTerms.length)];
    setCurrentTerm(randomTerm);
    setTeam1Explanation("");
    setTeam2Explanation("");
    setJudgeResponse("");
    setCurrentTeam(1);
    setGameState("team1-explain");
  };

  const startWithCustomTerm = () => {
    if (customTerm.trim()) {
      setCurrentTerm({ en: customTerm, ar: customTerm, es: customTerm });
      setTeam1Explanation("");
      setTeam2Explanation("");
      setJudgeResponse("");
      setCurrentTeam(1);
      setGameState("team1-explain");
      setCustomTerm("");
    }
  };

  const submitExplanation = async () => {
    if (currentTeam === 1 && team1Explanation.trim()) {
      setCurrentTeam(2);
      setGameState("team2-explain");
    } else if (currentTeam === 2 && team2Explanation.trim()) {
      setGameState("judging");
      await getJudgeFeedback();
    }
  };

  const getJudgeFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/coding/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You're a hilarious judge in a dev team game called "Explain It Like I'm 5". Two teams explained the tech term "${currentTerm.en}" to a 5-year-old:

Team ${team1Name}: "${team1Explanation}"
Team ${team2Name}: "${team2Explanation}"

Give funny, short, PG-rated feedback on each explanation. Be witty and entertaining! Also decide which team wins this round and why.`,
          chatHistory: []
        }),
      });
      
      const data = await response.json();
      setJudgeResponse(data.message);
      setGameState("results");
    } catch (error) {
      console.error("Error getting judge feedback:", error);
      setJudgeResponse("The judge is taking a coffee break! ☕ Try again in a moment.");
      setGameState("results");
    }
    setIsLoading(false);
  };

  const awardPoints = (team) => {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
  };

  const resetGame = () => {
    setGameState("setup");
    setScores({ team1: 0, team2: 0 });
    setCurrentTerm("");
    setTeam1Explanation("");
    setTeam2Explanation("");
    setJudgeResponse("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [gameState, judgeResponse]);

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🧠 Explain It Like I'm 5
        </h1>
        <p className="text-gray-600">Dev Edition - Make tech concepts simple & fun!</p>
        
        {/* Scoreboard */}
        <div className="flex justify-center gap-8 mt-4">
          <div className="bg-white rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2">
              <HiOutlineUsers className="text-blue-500" />
              <span className="font-semibold">{team1Name}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                {scores.team1}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2">
              <HiOutlineUsers className="text-purple-500" />
              <span className="font-semibold">{team2Name}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-bold">
                {scores.team2}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto">
        {gameState === "setup" && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-6">🚀 Ready to Play?</h2>
            
            {/* Team Names Setup */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Team 1 Name</label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Team 2 Name</label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Start Options */}
            <div className="space-y-4">
              <button
                onClick={startNewRound}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <HiOutlineLightBulb />
                Start with Random Tech Term
              </button>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter your own tech term..."
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={startWithCustomTerm}
                  disabled={!customTerm.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                >
                  Go!
                </button>
              </div>
            </div>
          </div>
        )}

        {(gameState === "team1-explain" || gameState === "team2-explain") && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">
                📚 Current Term: <span className="text-blue-600">{currentTerm.en}</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div>🇸🇦 Arabic: <span className="font-semibold">{currentTerm.ar}</span></div>
                <div>🇪🇸 Spanish: <span className="font-semibold">{currentTerm.es}</span></div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <h3 className="font-bold text-lg mb-2">
                  {currentTeam === 1 ? `${team1Name}'s Turn!` : `${team2Name}'s Turn!`}
                </h3>
                <p className="text-gray-700">
                  Explain "{currentTerm.en}" like you're talking to a 5-year-old. 
                  Make it simple, fun, and creative! 🎨
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder={`How would you explain "${currentTerm.en}" to a 5-year-old? Be creative!`}
                value={currentTeam === 1 ? team1Explanation : team2Explanation}
                onChange={(e) => 
                  currentTeam === 1 
                    ? setTeam1Explanation(e.target.value)
                    : setTeam2Explanation(e.target.value)
                }
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
              
              <button
                onClick={submitExplanation}
                disabled={currentTeam === 1 ? !team1Explanation.trim() : !team2Explanation.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <RiSendPlaneFill />
                {currentTeam === 1 ? "Submit & Let Team 2 Play" : "Submit for AI Judge!"}
              </button>
            </div>
          </div>
        )}

        {gameState === "judging" && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">🤖 AI Judge is Thinking...</h2>
            <p className="text-gray-600">Preparing some witty feedback for both teams!</p>
          </div>
        )}

        {gameState === "results" && (
          <div className="space-y-6">
            {/* Explanations Display */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-blue-800 flex items-center gap-2">
                  <HiOutlineUsers />
                  {team1Name}'s Explanation
                </h3>
                <p className="text-gray-700 italic">"{team1Explanation}"</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-purple-800 flex items-center gap-2">
                  <HiOutlineUsers />
                  {team2Name}'s Explanation
                </h3>
                <p className="text-gray-700 italic">"{team2Explanation}"</p>
              </div>
            </div>

            {/* Judge Feedback */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg border-l-4 border-yellow-400">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                🤖 AI Judge Says:
              </h3>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {judgeResponse}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => awardPoints('team1')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center gap-2"
              >
                <RiTrophyLine />
                Point to {team1Name}
              </button>
              
              <button
                onClick={() => awardPoints('team2')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center gap-2"
              >
                <RiTrophyLine />
                Point to {team2Name}
              </button>
              
              <button
                onClick={startNewRound}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center gap-2"
              >
                <RiRefreshLine />
                Next Round
              </button>
              
              <button
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ExplainItLike5Game;