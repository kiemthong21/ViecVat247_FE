import React, { createContext, useContext, useState } from "react";

const ToastConfigContext = createContext();

export function ToastConfigProvider({ children }) {
    const [toastConfig, setToastConfig] = useState({
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    return <ToastConfigContext.Provider value={{ toastConfig, setToastConfig }}>{children}</ToastConfigContext.Provider>;
}

export function useToastConfig() {
    return useContext(ToastConfigContext);
}
