import ThemeToggle from "./ThemeToggle";
import { RiOpenaiLine } from "react-icons/ri";

const SidebarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      <RiOpenaiLine className="w-10 h-10 text-primary" />
      <h2 className="text-xl font-extrabold text-primary mr-auto">FrenzyAI</h2>
      <ThemeToggle />
    </div>
  );
};
export default SidebarHeader;
