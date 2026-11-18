import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { isSignedIn } from "../services/api";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isSignedIn()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;