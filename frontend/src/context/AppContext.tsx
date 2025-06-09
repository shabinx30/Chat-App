import { createContext, type ReactNode, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { login } from "../redux/store";

interface AppContextType {
    socket: Socket;
    preview: string;
    setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    let userData;
    if (localStorage.getItem("jwt")) {
        userData = JSON.parse(localStorage.getItem("jwt") || "");
        dispatch(login({ token: null, user: userData }));
    }
    const socket = io(import.meta.env.VITE_BASE_URL, {
        query: {
            userId: userData?.userId,
        },
    });

    const [preview, setPreview] = useState('')

    return (
        <AppContext.Provider value={{ socket, preview, setPreview }}>{children}</AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export default AppProvider;
