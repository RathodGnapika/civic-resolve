import { Link, useLocation } from "react-router-dom";
import { Shield, FileText, Search, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Shield },
  { to: "/submit", label: "Submit Complaint", icon: FileText },
  { to: "/track", label: "Track Status", icon: Search },
  { to: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-primary">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary-foreground">
          <Shield className="h-6 w-6 text-accent" />
          CivicAI
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
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
        </div>
      </div>
    </nav>
  );
}
