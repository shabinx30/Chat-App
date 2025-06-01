import { useEffect, useState } from "react";
import AddContact from "../components/AddContact";
import Contacts from "../components/contacts/Contacts";
import type React from "react";
import { subscribeToPush } from "../utils/push";

const Home = ({ aside }: { aside: React.ReactNode }) => {
    const [isPop, setPop] = useState<boolean>(false);
    const [change, setChange] = useState("");

    const {VITE_PUBLIC_VAPID_KEY, VITE_BASE_URL} = import.meta.env

    useEffect(() => {
        const handleSubscribe = async () => {
            const subscription = await subscribeToPush(VITE_PUBLIC_VAPID_KEY);
            if (subscription) {
                const user = JSON.parse(localStorage.getItem('jwt') || '')
                await fetch(`${VITE_BASE_URL}/notify/subscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.userId,
                        subscription
                    }),
                });
            }
        };
        handleSubscribe()
    },[]);

    return (
        <div className="relative flex">
            {isPop && <AddContact setPop={setPop} setChange={setChange} />}
            <Contacts change={change} setPop={setPop} />
            {aside}
        </div>
    );
};

export default Home;
