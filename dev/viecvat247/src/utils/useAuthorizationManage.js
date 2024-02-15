import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const useAuthorizationManage = (screen) => {
    const { userManage, isInitialized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized) {
            if (userManage && userManage.roleid && screen) {
                if (userManage.roleid === 1) {
                    if (!userManage.typeManager.some((item) => item.typeManagerName === screen)) {
                        navigate("/manage/dashboard");
                    } else {
                        console.log(screen);
                    }
                }
            }
        }
    }, [isInitialized]);
};

export default useAuthorizationManage;
