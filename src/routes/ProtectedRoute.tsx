import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { type MyDispatch, type RootState } from "../Redux/Store";
import { useEffect } from "react";
import { setAuthFromToken } from "../Redux/Slicers/LoginSlicer";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => 
{
  const isAuthenticated = useSelector((state:RootState) => state.Login.isAuthenticated)
  const isLoading = useSelector((state: RootState) => state.Login.AuthLoading)
  const role = localStorage.getItem("Role");
  const dispatch = useDispatch<MyDispatch>();
  
  useEffect(() => 
  {
    dispatch(setAuthFromToken()) 
  }, [dispatch])

  if (isLoading) return <div>Loading.....</div>

  if (!isAuthenticated) 
  {
    if (location.pathname === "/login") 
    {
      return <Outlet />;
    }

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};