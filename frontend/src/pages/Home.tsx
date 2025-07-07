import { useState, lazy, useEffect } from "react";
import Contacts from "../components/contacts/Contacts";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import useSubscribe from "../hooks/useSubscribe";
import { useSearchParams } from "react-router-dom";

const AddContact = lazy(() => import("../components/contacts/AddContact"));
const Settings = lazy(() => import("../components/settings/Settings"));

const Home = React.memo(({ aside }: { aside: React.ReactNode }) => {
    const [isPop, setPop] = useState<boolean>(false);
    const [isSett, setSett] = useState<boolean>(false);
    const [change, setChange] = useState("");
    const { setPreview } = useAppContext();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const settings = searchParams.get("settings");
        if (settings) {
            setSett(true);
        }
    }, []);

    useSubscribe();

    return (
        <div
            onClick={() => {
                setPreview("");
            }}
            className="relative flex overflow-hidden"
        >
            <AnimatePresence>
                {isSett && <Settings setSett={setSett} />}
                {isPop && <AddContact setPop={setPop} setChange={setChange} />}
            </AnimatePresence>

            <Contacts change={change} setPop={setPop} setSett={setSett} />
            {aside}
        </div>
    );
});

export default Home;
