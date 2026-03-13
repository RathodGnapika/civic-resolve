import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: any) {

  const isAdmin = localStorage.getItem("isAdmin");

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
}