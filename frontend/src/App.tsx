import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Chat from "./components/chat/Chat";
import Protector from "./components/Protector";
import { lazy, useEffect } from "react";
import axios from "axios";
const Login = lazy(() => import("./pages/Login"))
const SignUp = lazy(() => import("./pages/SignUp"))

function App() {

    // temperorly for avoiding cold start from render
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_BASE_URL
        axios.get(`${apiUrl}/api/auth/start`)
        .then((res) => {
            console.log(res, 'connected to the server');
        })
        .catch((err) => {
            console.log(err)
        })
    })

    return (
        <Routes>
            <Route path="/" element={<Protector type='in'><Home aside={<Welcome />} /></Protector>} />
            <Route path="/chat/:chatId" element={<Protector type="in"><Home aside={<Chat />} /></Protector>} />
            <Route path="/login" element={<Protector type="out"><Login /></Protector>} />
            <Route path="/signup" element={<Protector type="out"><SignUp /></Protector>} />
        </Routes>
    );
}

export default App;
