import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./components/chat/Chat";
import Protector from "./components/Protector";
import Welcome from "./components/Welcome";

const Login = lazy(() => import("./pages/Login"))
const SignUp = lazy(() => import("./pages/SignUp"))

function App() {
    return (
        <Routes>
            {/* Protected "in" routes */}
            <Route element={<Protector type="in" />}>
                <Route path="/" element={<Home aside={<Welcome />} />} />
                <Route path="/chat/:chatId" element={<Home aside={<Chat />} />} />
            </Route>

            {/* Protected "out" routes */}
            <Route element={<Protector type="out" />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Route>
        </Routes>
    );
}

export default App;
