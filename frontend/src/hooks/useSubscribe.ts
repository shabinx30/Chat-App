import { useEffect } from "react";
import { subscribeToPush } from "../utils/push";

const useSubscribe = () => {

    const { VITE_PUBLIC_VAPID_KEY, VITE_BASE_URL } = import.meta.env;

    useEffect(() => {
        const handleSubscribe = async () => {
            const registration = await navigator.serviceWorker.ready;

            // Check if user is already subscribed
            const existingSubscription =
                await registration.pushManager.getSubscription();

            if (!existingSubscription) {
                const subscription = await subscribeToPush(
                    VITE_PUBLIC_VAPID_KEY
                );
                if (subscription) {
                    const user = JSON.parse(
                        localStorage.getItem("jwt") || "{}"
                    );

                    await fetch(`${VITE_BASE_URL}/notify/subscribe`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: user.userId,
                            subscription,
                        }),
                    });
                }
            }
        };

        handleSubscribe();
    }, []);
};

export default useSubscribe;
