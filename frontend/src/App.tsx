import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Chat from "./components/chat/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


function App() {

    return (
        <Routes>
            <Route path="/" element={<Home aside={<Welcome />} />} />
            <Route path="/chat/:email" element={<Home aside={<Chat />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
