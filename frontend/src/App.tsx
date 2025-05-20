import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Chat from "./components/chat/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useDispatch } from "react-redux";
import { login } from "./redux/store";

function App() {
    const dispatch = useDispatch();

    if (localStorage.getItem("jwt")) {
        let userData = JSON.parse(localStorage.getItem("jwt") || '')
        dispatch(login({ token: null, user: userData }));
    }

    return (
        <Routes>
            <Route path="/" element={<Home aside={<Welcome />} />} />
            <Route path="/chat/:chatId" element={<Home aside={<Chat />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
