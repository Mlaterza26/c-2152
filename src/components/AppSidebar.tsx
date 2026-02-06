import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { teams } from "@/lib/workflows";
import FutureLogo from "@/components/FutureLogo";

export default function AppSidebar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <aside className="hidden md:flex w-64 flex-col bg-future-blue text-white/90 border-r border-deep-blue">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">FUTURE PLC</h1>
        <p className="text-sm text-white/50 mt-1">Order Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            isHome
              ? "bg-deep-blue text-white"
              : "text-white/60 hover:text-white hover:bg-deep-blue/50"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          Home
        </Link>

        <div>
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
            Teams
          </p>
          <div className="space-y-1">
            {teams.map((team) => {
              const teamPath = `/team/${team.id}`;
              const isActive = location.pathname.startsWith(teamPath);

              if (!team.enabled) {
                return (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/20 cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4" />
                    {team.name}
                  </div>
                );
              }

              return (
                <Link
                  key={team.id}
                  to={teamPath}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-future-red text-white"
                      : "text-white/60 hover:text-white hover:bg-deep-blue/50"
                  )}
                >
                  <span className="h-5 w-5 flex items-center justify-center rounded bg-white/10 text-[10px] font-bold">
                    {team.name.charAt(0)}
                  </span>
                  {team.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-deep-blue flex justify-center">
        <FutureLogo className="h-6 text-white/40" />
      </div>
    </aside>
  );
}
