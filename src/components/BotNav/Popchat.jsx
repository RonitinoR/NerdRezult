import { useEffect, useState, useRef } from "react";
import supabase from "../../supabaseClient";
import './Popchat.css'

function Popchat() {
    const [session, setSession] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [usersOnline, setUsersOnline] = useState([]);
    const [roomName, setRoomName] = useState("room_one");
  
    const chatContainerRef = useRef(null);
    const scroll = useRef();
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
  
      return () => subscription.unsubscribe();
    }, []);
  
    const signIn = async () => {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    };
  
    const signOut = async () => {
      await supabase.auth.signOut();
    };
  
    useEffect(() => {
      if (!session?.user) {
        setUsersOnline([]);
        return;
      }
      const room = supabase.channel(roomName, {
        config: {
          presence: {
            key: session?.user?.id,
          },
        },
      });
  
      room.on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.payload]);
      });
  
      room.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await room.track({
            id: session?.user?.id,
          });
        }
      });
  
      room.on("presence", { event: "sync" }, () => {
        const state = room.presenceState();
        setUsersOnline(Object.keys(state));
      });
  
      return () => {
        room.unsubscribe();
      };
    }, [session, roomName]); // Re-run when roomName or session changes
  
    // send message
    const sendMessage = async (e) => {
      e.preventDefault();
  
      supabase.channel(roomName).send({
        type: "broadcast",
        event: "message",
        payload: {
          message: newMessage,
          user_name: session?.user?.user_metadata?.email,
          avatar: session?.user?.user_metadata?.avatar_url,
          timestamp: new Date().toISOString(),
        },
      });
      setNewMessage("");
    };
  
    const formatTime = (isoString) => {
      return new Date(isoString).toLocaleTimeString("en-us", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };
  
    useEffect(() => {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [100]);
    }, [messages]);
    // const handleRoomChange = (e) => {
    //     setRoomName(e.target.value);
    //   };// Room change
  
    if (!session) {
      return (
        <div className="container center">
          <button onClick={signIn}>Sign in with Google to chat</button>
        </div>
      );
    } else {
      return (
        <div className="container chat-wrapper">
          <div className="chat-box">
            <div className="chat-header">
              <div>
                <p>Signed in as {session?.user?.user_metadata?.email}</p>
                <p className="online-users">{usersOnline.length} users online</p>
              </div>
              {/* <select // Room change 
              value={roomName} onChange={handleRoomChange}
              className="p-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="room_one">Room 1</option>
              <option value="room_two">Room 2</option>
              <option value="room_three">Room 3</option>
            </select> */}
              <button onClick={signOut} className="sign-out">Sign out</button>
            </div>
            <div className="flex justify-center mt-4">

          </div>
            <div ref={chatContainerRef} className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg?.user_name === session?.user?.email ? "sent" : "received"}`}>
                  {msg?.user_name !== session?.user?.email && <img src={msg?.avatar} alt="avatar" className="avatar" />}
                  <div className="message-content">
                    <div className="message-text">{msg.message}</div>
                    <div className="timestamp">{formatTime(msg?.timestamp)}</div>
                  </div>
                  {msg?.user_name === session?.user?.email && <img src={msg?.avatar} alt="avatar" className="avatar" />}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} type="text" placeholder="Type a message..." />
              <button>Send</button>
              <span ref={scroll}></span>
            </form>
          </div>
        </div>
      );
    }
  }

export default Popchat;