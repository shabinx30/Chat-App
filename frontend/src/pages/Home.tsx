import Contacts from "../components/contacts/Contacts";
import Chat from "../components/chat/Chat";

const Home = () => {
    return (
        <div className="flex w-[100vw] h-[100vh]">
            <Contacts />
            <Chat />
        </div>
    )
};

export default Home;
