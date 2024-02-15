import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userManage, setUserManage] = useState(null);
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage?.getItem("token");
        const auth = JSON.parse(localStorage?.getItem("auth"));

        if (token && auth) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                }
                setUser(auth);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const tokenManage = localStorage?.getItem("manage-token");
        const authManage = JSON.parse(localStorage?.getItem("manage-auth"));

        if (tokenManage && authManage) {
            try {
                const decodedToken = jwtDecode(tokenManage);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logoutManage();
                }
                setUserManage(authManage);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        setIsInitialized(true);
    }, []);

    const login = (userData) => {
        localStorage.setItem("token", userData.data.token);
        localStorage.setItem("auth", JSON.stringify(userData.data));
        setUser(JSON.parse(localStorage?.getItem("auth")));
    };

    const loginManage = (userData) => {
        localStorage.setItem("manage-token", userData.data.token);
        localStorage.setItem("manage-auth", JSON.stringify(userData.data));
        setUserManage(JSON.parse(localStorage?.getItem("manage-auth")));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        navigate("/login");
    };

    const logoutManage = () => {
        setUserManage(null);
        localStorage.removeItem("manage-token");
        localStorage.removeItem("manage-auth");
        navigate("/manage/login");
    };

    const checkExpires = () => {
        const token = localStorage?.getItem("token");
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                logout();
            }
        } catch (error) {
            logout();
        }
    };

    const checkExpiresManage = () => {
        const token = localStorage?.getItem("manage-token");
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                logoutManage();
            }
        } catch (error) {
            logoutManage();
        }
    };

    return <AuthContext.Provider value={{ user, login, logout, checkExpires, userManage, loginManage, logoutManage, checkExpiresManage, isInitialized }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
