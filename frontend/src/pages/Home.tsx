import Contacts from "../components/contacts/Contacts";
import Chat from "../components/chat/Chat";
import Welcome from "../components/Welcome";

const Home = () => {
    return (
        <div className="flex w-[100vw] h-[100vh]">
            <Contacts />
            <Welcome />
            {/* <Chat /> */}
        </div>
    )
};

export default Home;
