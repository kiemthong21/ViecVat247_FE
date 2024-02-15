import { useContext } from "react";
import InputBox from "./InputBox";
import Messages from "./Messages";
import { ChatContext } from "../../context/ChatContext";

function ChatRoom() {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chatInfo">
        <img
          src={data?.user?.photoURL}
          alt=""
          style={{
            borderRadius: "50%",
            marginRight: "1%",
          }}
        />
        <span>{data?.user?.displayName}</span>
        <div className="chatIcons"></div>
      </div>
      <Messages />
      <InputBox />
    </div>
  );
}

export default ChatRoom;
