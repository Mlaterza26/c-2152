import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, LayoutDashboard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { teams } from "@/lib/workflows";
import FutureLogo from "@/components/FutureLogo";

export default function AppHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-future-blue text-white/90 p-0 border-deep-blue">
            <div className="p-6">
              <h1 className="text-xl font-bold text-white tracking-tight">FUTURE PLC</h1>
              <p className="text-sm text-white/50 mt-1">Order Management</p>
            </div>
            <nav className="px-3 space-y-4">
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
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <FutureLogo className="h-5 text-white/40" />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-future-red" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="h-8 w-8 rounded-full bg-future-blue flex items-center justify-center text-white text-sm font-bold">
            JS
          </div>
          <span className="hidden sm:inline text-sm font-medium">Jane Smith</span>
        </div>
      </div>
    </header>
  );
}
