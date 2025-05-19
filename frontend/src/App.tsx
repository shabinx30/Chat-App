// import { useEffect, useState, type FormEvent } from "react";
// import { io, Socket } from "socket.io-client";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Chat from "./components/chat/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// Define type for messages
// type Message = string;

// Define socket type
// let socket: Socket;

function App() {
    // const [message, setMessage] = useState<string>("");
    // const [chat, setChat] = useState<Message[]>([]);

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
        <Routes>
            <Route path="/" element={<Home aside={<Welcome />} />} />
            <Route path="/chat/:email" element={<Home aside={<Chat />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
