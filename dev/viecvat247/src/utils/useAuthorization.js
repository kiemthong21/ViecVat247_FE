import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const useAuthorization = (requiredRoles, redirect) => {
    const { user, isInitialized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized) {
            if (user && user.roleid && requiredRoles) {
                const hasRequiredRole = requiredRoles.includes(user.roleid);
                console.log(hasRequiredRole);

                if (!hasRequiredRole) {
                    navigate(redirect);
                }
            }
        }
    }, [isInitialized]);
};

export default useAuthorization;
