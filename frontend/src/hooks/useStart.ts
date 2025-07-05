import axios from "axios";
import { useEffect } from "react";

const useStart = () => {
    // temperorly for avoiding cold start from render
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_BASE_URL;
        axios
            .get(`${apiUrl}/api/auth/start`)
            .then((res) => {
                console.log("connected to the server", res);
            })
            .catch((err) => {
                console.log("couldn't connect to the server", err);
            });
    }, []);
};

export default useStart;
