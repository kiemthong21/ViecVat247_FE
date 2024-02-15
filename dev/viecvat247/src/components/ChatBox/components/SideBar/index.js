import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "~/firebase/config";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import Search from "./Search";

const currentUser = {
  displayName: "Ngoc Bao",
  photoURL:
    "https://lh3.googleusercontent.com/ogw/AKPQZvwtvSAuz74ZES-3yoJjEpOYKKZ6lS8aooN9H1Q-aw=s32-c-mo",
};

function Sidebar() {
  const [select, setSelect] = useState(0);
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("id");
        if (!!id) {
          const findUser = Object.entries(doc.data()).find((chat) => chat[0] === id);
          !!findUser &&
            handleSelect(
              findUser[1]
                ?.userInfo, findUser[0]
            );
        }
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
    console.log("chat", chats);
  }, [currentUser.uid]);

  
  const handleSelect = (u, id) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelect(id);
  };

  return (
    <>
      <div className="sidebar">
        {/* navbar */}
        <div className="navbar">
          <span className="logo">Viecvat247.com</span>
          <div className="user">
            <img src={currentUser?.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
          </div>
        </div>
        {/* end navbar */}
        <Search />

        {/* all chats */}
        <div className="chats">
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <div
                style={{background:chat[0]==select?"#0B6D5B":"#02AA8A"}}
                className="userChat"
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo, chat[0])}
              >
                <img src={chat[1].userInfo?.photoURL} alt="" />
                <div className="userChatInfo">
                  <span>{chat[1].userInfo?.displayName}</span>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </div>
            ))}
        </div>
        {/* end all chats */}
      </div>
    </>
  );
}

export default Sidebar;
