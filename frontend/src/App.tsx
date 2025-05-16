import { useEffect, useState, type FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Contacts from "./components/contacts/Contacts";
import Chat from "./components/chat/Chat";

// Define type for messages
type Message = string;

// Define socket type
let socket: Socket;

function App() {
    const [message, setMessage] = useState<string>("");
    const [chat, setChat] = useState<Message[]>([]);

    // useEffect(() => {
    //   socket = io('http://localhost:5004');

    //   socket.on('chat message', (msg: Message) => {
    //     setChat((prev) => [...prev, msg]);
    //   });

    //   return () => {
    //     socket.off('chat message');
    //     socket.disconnect();
    //   };
    // }, []);

    // const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();
    //   if (message.trim()) {
    //     socket.emit('chat message', message);
    //     setMessage('');
    //   }
    // };

    return (
        // <div style={{ padding: 20 }}>
        //   <h2>Socket.IO Chat</h2>
        //   <ul>
        //     {chat.map((msg, index) => (
        //       <li key={index}>{msg}</li>
        //     ))}
        //   </ul>
        //   {/* <form onSubmit={sendMessage}> */}
        //   <form >
        //     <input
        //       value={message}
        //       onChange={e => setMessage(e.target.value)}
        //       placeholder="Type a message..."
        //     />
        //     <button type="submit">Send</button>
        //   </form>
        // </div>
        <>
            <div className="flex w-[100vw] h-[100vh]">
                <Contacts />
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
