import Feedback from "./pages/Feedback";
import ChatBot from "./components/ChatBot";
import Heatmap from "./pages/Heatmap";
import './App.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/hooks/useAuth";

import Navbar from "@/components/Navbar";

import Index from "./pages/Index";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


// 🔥 FIXED ADMIN ROUTE
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, user } = useAuth();

  // ⏳ WAIT until auth is ready (prevents redirect bug)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Verifying admin access...
      </div>
    );
  }

  // ❌ Not logged in → go login
  if (!user) return <Navigate to="/login" replace />;

  // ❌ Logged in but not admin → go home
  if (user && isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
}


// 🔥 ROUTES
const AppRoutes = () => (
  <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/submit" element={<SubmitComplaint />} />
      <Route path="/track" element={<TrackComplaint />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/heatmap" element={<Heatmap />} />
      <Route path="/admin" element={<AdminLogin />} />

      {/* 🔐 PROTECTED ADMIN ROUTE */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      <Route path="/feedback" element={<Feedback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

    {/* 🤖 Chatbot on all pages */}
    <ChatBot />
  </>
);


// 🔥 MAIN APP
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;