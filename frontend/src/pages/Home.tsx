import Contacts from "../components/contacts/Contacts";
import type React from "react";

const Home = ({ aside }: { aside: React.ReactNode }) => {
    return (
        <div className="flex w-[100vw] h-[100vh]">
            <Contacts />
            {aside}
        </div>
    );
};

export default Home;
