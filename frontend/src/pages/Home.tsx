import { useState } from "react";
import AddContact from "../components/AddContact";
import Contacts from "../components/contacts/Contacts";
import type React from "react";

const Home = ({ aside }: { aside: React.ReactNode }) => {
    const [isPop, setPop] = useState<boolean>(true);

    return (
        <div className="relative flex w-[100vw] h-[100vh]">
            {isPop && <AddContact setPop={setPop} />}
            <Contacts setPop={setPop} />
            {aside}
        </div>
    );
};

export default Home;
