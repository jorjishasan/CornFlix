import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RouteGuard = ({ children, requireAuth }) => {
  const user = useSelector((store) => store.user);
  
  // For routes that require authentication (like /browse)
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }
  
  // For routes that should not be accessed when authenticated (like login page)
  if (!requireAuth && user) {
    return <Navigate to="/browse" replace />;
  }

  return children;
};

export default RouteGuard; 