import { Navigate, Outlet } from "react-router-dom";
import { useTypedSelector } from "../redux/store";

function Protector({ area }: { area: "in" | "out" }) {
    const isAuthenticated = useTypedSelector((state) => state?.auth?.user)

    if (area === "in" && !isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (area === "out" && isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default Protector;
