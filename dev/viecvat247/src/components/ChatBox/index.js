import ChatRoom from "./components/Chat";
import Sidebar from "./components/SideBar";
import "./chats.scss";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

function ChatBox() {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <div className="home">
          <div className="container">
            <Sidebar />
            <ChatRoom />
          </div>
        </div>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}

export default ChatBox;
