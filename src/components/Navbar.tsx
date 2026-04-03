import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, FileText, Search, LayoutDashboard, LogIn, LogOut, UserPlus, Map, Star, HistoryIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home", icon: Shield, show: true },
    { to: "/submit", label: "Submit Complaint", icon: FileText, show: !!user },
    { to: "/track", label: "Track Status", icon: Search, show: true },
    { to: "/history", label: "History", icon: HistoryIcon, show: !!user },
    { to: "/heatmap", label: "Heatmap", icon: Map, show: true },
    { to: "/admin", label: "Admin Login", icon: LogIn, show: true },
    { to: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard, show: isAdmin },
    { to: "/feedback", label: "Feedback", icon: Star, show: true },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-primary">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary-foreground">
          <Shield className="h-6 w-6 text-accent" />
          CivicAI
        </Link>
        <div className="flex items-center gap-1">
          {navItems.filter(i => i.show).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">Sign Out</span>
            </Button>
          ) : (
            <>
              <Link to="/login" className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/login" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}`}>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link to="/register" className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === "/register" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}`}>
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}