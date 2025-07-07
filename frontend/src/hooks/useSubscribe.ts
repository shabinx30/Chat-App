import { useEffect } from "react";
import { subscribeToPush } from "../utils/push";

const useSubscribe = () => {
    const { VITE_PUBLIC_VAPID_KEY, VITE_BASE_URL } = import.meta.env;

    useEffect(() => {
        const handleSubscribe = async () => {
            const subscription = await subscribeToPush(VITE_PUBLIC_VAPID_KEY);
            if (subscription) {
                const user = JSON.parse(localStorage.getItem("jwt") || "{}");

                await fetch(`${VITE_BASE_URL}/notify/subscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.userId,
                        subscription,
                    }),
                });
            }
        };

        // check if it's already registered
        // navigator.serviceWorker
        //     .getRegistrations()
        //     .then(function (registrations) {
        //         if (!registrations.length) {
        //             handleSubscribe();
        //         }
        //     });

        // commented for render

        handleSubscribe()
    }, []);
};

export default useSubscribe;
