import { createContext, type ReactNode, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useTypedSelector } from "../redux/store";

interface AppContextType {
    socket: Socket;
    preview: string;
    setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
    let userData;
    const state = useTypedSelector((state) => state);
    if (state) {
        userData = state.auth.user;
    }
    const socket = io(import.meta.env.VITE_BASE_URL, {
        reconnectionAttempts: 5, // limit retries
        reconnectionDelay: 2000, // wait 2s before retry
        reconnectionDelayMax: 10000, // max wait 10s
        query: {
            userId: userData?.userId,
        },
        transports: ['websocket'],
    });

    const [preview, setPreview] = useState("");

    return (
        <AppContext.Provider value={{ socket, preview, setPreview }}>
            {children}
        </AppContext.Provider>
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
