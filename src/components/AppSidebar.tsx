import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { teams } from "@/lib/workflows";

export default function AppSidebar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Future PLC</h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Order Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            isHome
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          Home
        </Link>

        <div>
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/30 cursor-not-allowed"
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
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50"
                  )}
                >
                  <span className="h-5 w-5 flex items-center justify-center rounded bg-sidebar-foreground/10 text-[10px] font-bold">
                    {team.name.charAt(0)}
                  </span>
                  {team.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
