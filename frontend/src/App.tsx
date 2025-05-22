import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Chat from "./components/chat/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useDispatch } from "react-redux";
import { login } from "./redux/store";
import Protector from "./components/Protector";

function App() {
    

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
