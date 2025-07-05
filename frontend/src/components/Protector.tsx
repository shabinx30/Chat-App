import { Navigate, Outlet } from "react-router-dom";
import { useTypedSelector } from "../redux/store";

function Protector({ type }: { type: "in" | "out" }) {
    const state = useTypedSelector((state) => state)
    const isAuthenticated = state.auth?.user

    if (type === "in" && !isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (type === "out" && isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default Protector;
