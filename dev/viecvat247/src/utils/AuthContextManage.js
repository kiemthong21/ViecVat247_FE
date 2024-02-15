import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContextManage = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage?.getItem("manage-token");
        const auth = JSON.parse(localStorage?.getItem("manage-auth"));

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

        setIsInitialized(true);
    }, []);

    const login = (userData) => {
        localStorage.setItem("manage-token", userData.data.token);
        localStorage.setItem("manage-auth", JSON.stringify(userData.data));
        setUser(JSON.parse(localStorage?.getItem("manage-auth")));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("manage-token");
        localStorage.removeItem("manage-auth");
        navigate("/manage/login");
    };

    const checkExpires = () => {
        const token = localStorage?.getItem("manage-token");
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                logout();
            }
        } catch (error) {
            logout();
        }
    };

    return <AuthContextManage.Provider value={{ user, login, logout, checkExpires, isInitialized }}>{children}</AuthContextManage.Provider>;
};

export const useAuthManage = () => useContext(AuthContextManage);
