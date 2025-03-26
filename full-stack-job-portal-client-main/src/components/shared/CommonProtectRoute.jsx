import { useUserContext } from "../../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

const CommonProtectRoute = ({ children }) => {
    const { user, userLoading } = useUserContext();
    const location = useLocation();

    if (userLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default CommonProtectRoute;