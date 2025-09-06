import { Link } from "react-router-dom";

export default function GreenCTAButton({ type = "donate" }) {
  const isDonate = type === "donate";

  return (
    <Link
      to={isDonate ? "/donate" : "/contact"}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-emerald-400 relative overflow-hidden group"
    >
      <span className="material-symbols-outlined">
        {isDonate ? "volunteer_activism" : "mail"}
      </span>
      {isDonate ? "Donate Now" : "Contact Us"}

      {/* Shining effect */}
      <span className="absolute top-0 left-[-75%] w-24 h-full bg-white/20 transform rotate-12 translate-x-0 group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none"></span>
    </Link>
  );
}
