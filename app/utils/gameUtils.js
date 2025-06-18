// app/utils/gameUtils.js

// Tech terms for the game
const techTerms = [
  // Programming Concepts
  { en: "Microservices", difficulty: "medium" },
  { en: "GraphQL", difficulty: "medium" },
  { en: "Middleware", difficulty: "easy" },
  { en: "API Gateway", difficulty: "medium" },
  { en: "Serverless", difficulty: "medium" },
  { en: "Container", difficulty: "easy" },
  { en: "Kubernetes", difficulty: "hard" },
  { en: "Docker", difficulty: "easy" },
  { en: "CI/CD", difficulty: "medium" },
  { en: "DevOps", difficulty: "easy" },
  
  // Database Terms
  { en: "NoSQL", difficulty: "easy" },
  { en: "ACID", difficulty: "medium" },
  { en: "Sharding", difficulty: "hard" },
  { en: "Index", difficulty: "easy" },
  { en: "Normalization", difficulty: "medium" },
  { en: "Replication", difficulty: "medium" },
  { en: "MongoDB", difficulty: "easy" },
  { en: "PostgreSQL", difficulty: "easy" },
  { en: "Redis", difficulty: "easy" },
  { en: "CAP Theorem", difficulty: "hard" },
  
  // Web Technologies
  { en: "REST API", difficulty: "easy" },
  { en: "WebSocket", difficulty: "medium" },
  { en: "JWT", difficulty: "medium" },
  { en: "OAuth", difficulty: "medium" },
  { en: "CORS", difficulty: "medium" },
  { en: "CDN", difficulty: "easy" },
  { en: "Load Balancer", difficulty: "medium" },
  { en: "Reverse Proxy", difficulty: "medium" },
  { en: "SSL/TLS", difficulty: "medium" },
  { en: "HTTP/2", difficulty: "medium" },
  
  // Frontend Terms
  { en: "React", difficulty: "easy" },
  { en: "Vue.js", difficulty: "easy" },
  { en: "Angular", difficulty: "easy" },
  { en: "Virtual DOM", difficulty: "medium" },
  { en: "Component", difficulty: "easy" },
  { en: "State Management", difficulty: "medium" },
  { en: "Redux", difficulty: "medium" },
  { en: "Webpack", difficulty: "medium" },
  { en: "Babel", difficulty: "medium" },
  { en: "TypeScript", difficulty: "medium" },
  
  // Backend Terms
  { en: "Node.js", difficulty: "easy" },
  { en: "Express", difficulty: "easy" },
  { en: "Framework", difficulty: "easy" },
  { en: "MVC", difficulty: "medium" },
  { en: "ORM", difficulty: "medium" },
  { en: "Migration", difficulty: "medium" },
  { en: "Caching", difficulty: "easy" },
  { en: "Queue", difficulty: "easy" },
  { en: "Async/Await", difficulty: "medium" },
  { en: "Promise", difficulty: "medium" },
  
  // Cloud & Infrastructure
  { en: "AWS", difficulty: "easy" },
  { en: "Azure", difficulty: "easy" },
  { en: "Google Cloud", difficulty: "easy" },
  { en: "Lambda", difficulty: "medium" },
  { en: "S3", difficulty: "easy" },
  { en: "EC2", difficulty: "easy" },
  { en: "Auto Scaling", difficulty: "medium" },
  { en: "VPC", difficulty: "hard" },
  { en: "IAM", difficulty: "medium" },
  { en: "CloudFormation", difficulty: "hard" },
  
  // Security
  { en: "Encryption", difficulty: "easy" },
  { en: "Hashing", difficulty: "medium" },
  { en: "SQL Injection", difficulty: "medium" },
  { en: "XSS", difficulty: "medium" },
  { en: "CSRF", difficulty: "hard" },
  { en: "Two-Factor Auth", difficulty: "easy" },
  { en: "Firewall", difficulty: "easy" },
  { en: "VPN", difficulty: "easy" },
  { en: "Penetration Testing", difficulty: "medium" },
  { en: "Zero Trust", difficulty: "hard" },
  
  // Data & AI
  { en: "Machine Learning", difficulty: "easy" },
  { en: "Neural Network", difficulty: "medium" },
  { en: "Big Data", difficulty: "easy" },
  { en: "Data Lake", difficulty: "medium" },
  { en: "ETL", difficulty: "medium" },
  { en: "Apache Spark", difficulty: "hard" },
  { en: "Hadoop", difficulty: "medium" },
  { en: "TensorFlow", difficulty: "medium" },
  { en: "API", difficulty: "easy" },
  { en: "JSON", difficulty: "easy" },
  
  // Software Engineering
  { en: "Agile", difficulty: "easy" },
  { en: "Scrum", difficulty: "easy" },
  { en: "Sprint", difficulty: "easy" },
  { en: "Kanban", difficulty: "easy" },
  { en: "Code Review", difficulty: "easy" },
  { en: "Refactoring", difficulty: "medium" },
  { en: "Technical Debt", difficulty: "medium" },
  { en: "Unit Testing", difficulty: "easy" },
  { en: "Integration Testing", difficulty: "medium" },
  { en: "TDD", difficulty: "medium" },
  
  // Advanced Concepts
  { en: "Blockchain", difficulty: "medium" },
  { en: "Smart Contract", difficulty: "hard" },
  { en: "Quantum Computing", difficulty: "hard" },
  { en: "Edge Computing", difficulty: "medium" },
  { en: "IoT", difficulty: "easy" },
  { en: "Distributed System", difficulty: "hard" },
  { en: "Event Sourcing", difficulty: "hard" },
  { en: "CQRS", difficulty: "hard" },
  { en: "Saga Pattern", difficulty: "hard" },
  { en: "Circuit Breaker", difficulty: "hard" }
];

// Generate a random tech term
export function generateRandomTerm() {
  const randomIndex = Math.floor(Math.random() * techTerms.length);
  return techTerms[randomIndex];
}

// Generate a term by difficulty
export function generateTermByDifficulty(difficulty = "medium") {
  const filteredTerms = techTerms.filter(term => term.difficulty === difficulty);
  if (filteredTerms.length === 0) {
    return generateRandomTerm();
  }
  const randomIndex = Math.floor(Math.random() * filteredTerms.length);
  return filteredTerms[randomIndex];
}

// Get all terms by difficulty
export function getTermsByDifficulty(difficulty) {
  return techTerms.filter(term => term.difficulty === difficulty);
}

// Get random terms for a quiz
export function getRandomTerms(count = 5) {
  const shuffled = [...techTerms].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Validate room code format
export function isValidRoomCode(code) {
  return /^[A-Z0-9]{6}$/.test(code);
}

// Generate a unique player ID
export function generatePlayerId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Format time in MM:SS format
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate game score
export function calculateScore(explanationLength, timeLeft, bonusPoints = 0) {
  const baseScore = 10;
  const lengthBonus = Math.min(explanationLength / 20, 5); // Up to 5 bonus points for length
  const timeBonus = Math.min(timeLeft / 30, 5); // Up to 5 bonus points for speed
  
  return Math.round(baseScore + lengthBonus + timeBonus + bonusPoints);
}

// Game state helpers
export const GAME_STATES = {
  SETUP: 'setup',
  TEAM1_EXPLAIN: 'team1-explain',
  TEAM2_EXPLAIN: 'team2-explain',
  JUDGING: 'judging',
  RESULTS: 'results'
};

export function getNextGameState(currentState) {
  switch (currentState) {
    case GAME_STATES.SETUP:
      return GAME_STATES.TEAM1_EXPLAIN;
    case GAME_STATES.TEAM1_EXPLAIN:
      return GAME_STATES.TEAM2_EXPLAIN;
    case GAME_STATES.TEAM2_EXPLAIN:
      return GAME_STATES.JUDGING;
    case GAME_STATES.JUDGING:
      return GAME_STATES.RESULTS;
    case GAME_STATES.RESULTS:
      return GAME_STATES.TEAM1_EXPLAIN;
    default:
      return GAME_STATES.SETUP;
  }
}

// Team validation
export function validateTeams(teams) {
  const team1Count = teams.team1?.length || 0;
  const team2Count = teams.team2?.length || 0;
  
  return {
    valid: team1Count > 0 && team2Count > 0,
    team1Count,
    team2Count,
    message: team1Count === 0 || team2Count === 0 
      ? "Both teams need at least 1 player to start the game"
      : "Teams are ready!"
  };
}

// Room cleanup - remove old rooms
export function shouldCleanupRoom(room, maxAge = 3600000) { // 1 hour default
  return Date.now() - room.lastUpdate > maxAge;
}

// Explanation validation
export function validateExplanation(explanation) {
  const trimmed = explanation.trim();
  return {
    valid: trimmed.length >= 10 && trimmed.length <= 500,
    length: trimmed.length,
    message: trimmed.length < 10 
      ? "Explanation must be at least 10 characters long"
      : trimmed.length > 500 
      ? "Explanation must be less than 500 characters"
      : "Valid explanation"
  };
}

// Get difficulty color
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get random funny judge responses for fallback
export const FALLBACK_JUDGE_RESPONSES = [
  "Both teams did great! The real winner is the friends we made along the way... but seriously, you decide! 🏆",
  "I'm too caffeinated to judge right now ☕ Both explanations were solid!",
  "Plot twist: Everyone's a winner! 🎉 (But you still need to pick someone for points)",
  "My AI brain is having a moment... Both teams explained it well! 🤖",
  "I'm impressed by both teams! Time for human judgment! 👨‍⚖️",
  "Error 404: Clear winner not found. Both teams rocked it! 🚀",
  "I'm diplomatically saying both teams did amazing! 🤝",
  "My circuits are overloaded with how good both explanations were! ⚡"
];

export function getRandomFallbackResponse() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_JUDGE_RESPONSES.length);
  return FALLBACK_JUDGE_RESPONSES[randomIndex];
}