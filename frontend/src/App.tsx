import { useEffect, useState, type FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';

// Define type for messages
type Message = string;

// Define socket type
let socket: Socket;

function App() {
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<Message[]>([]);

  useEffect(() => {
    socket = io('http://localhost:5004'); // Connect only once

    // Listen for incoming messages
    socket.on('chat message', (msg: Message) => {
      setChat((prev) => [...prev, msg]);
    });

    // Cleanup
    return () => {
      socket.off('chat message');
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Socket.IO Chat</h2>
      <ul>
        {chat.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
