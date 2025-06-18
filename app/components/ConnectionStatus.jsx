// app/components/ConnectionStatus.jsx
import { Wifi, WifiOff } from "lucide-react";

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        {isConnected ? 'Connected' : 'Reconnecting...'}
      </div>
    </div>
  );
};

export default ConnectionStatus;