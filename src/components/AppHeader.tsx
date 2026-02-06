import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, LayoutDashboard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { teams } from "@/lib/workflows";

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
          <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground p-0">
            <div className="p-6">
              <h1 className="text-xl font-bold text-white">Future PLC</h1>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Order Management</p>
            </div>
            <nav className="px-3 space-y-4">
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
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            JS
          </div>
          <span className="hidden sm:inline text-sm font-medium">Jane Smith</span>
        </div>
      </div>
    </header>
  );
}
