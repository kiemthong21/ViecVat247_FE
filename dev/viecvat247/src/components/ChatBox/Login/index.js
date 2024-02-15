import React, { useEffect } from "react";
import { Row, Col, Button, Typography, message } from "antd";
import firebase, { auth } from "~/firebase/config";
import { addDocument, generateKeywords } from "~/firebase/services";
import { useState } from "react";
import ChatBox from "~/components/ChatBox";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "~/firebase/config";

const { Title } = Typography;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const token = localStorage.getItem("token");

export default function LoginWithChat() {
  const [isLogin, setIsLogin] = useState(false);
  const handleLogin = async (provider) => {
    try {
      var semail;
      await fetch("https://api.viecvat247.com/api/Customer/UserProfile", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong tiêu đề Authorization
        },
      })
        .then((response) => {
          if (response.status === 401) {
            // Xử lý trường hợp token hết hạn hoặc không hợp lệ
            console.error(
              "Token hết hạn hoặc không hợp lệ, hãy xử lý trường hợp này."
            );
          } else {
            return response.json();
          }
        })
        .then((data) => {
          semail = data.cemail;
        })
        .catch((error) => console.error("Lỗi khi gọi API:", error));
      let user;
      await auth
        .signInWithPopup(googleProvider)
        .then(function (result) {
          // Check if the signed-in user's email matches the allowed email
          if (result.user.email === semail) {
            // User is allowed to sign in
            user = result.user;
            message.success("Đăng nhập thành công!");
          } else {
            // Sign out the user if the email doesn't match
            message.warning("Đăng nhập thất bại, email không trùng khớp!");
            auth.signOut();

          }
        })
        .catch(function (error) {
          // Handle errors
          console.error("Sign-in error:", error);
        });

      let [checkUserExist, setCheckUserExist] = await Promise.all([
        getDoc(doc(db, "users", user?.uid)),
        getDoc(doc(db, "userChats", user?.uid)),
      ]);
      if (!checkUserExist.exists()) {
        await setDoc(doc(db, "users", user?.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      if (!setCheckUserExist.exists()) {
        await setDoc(doc(db, "userChats", user?.uid), {});
      }
      setIsLogin(true);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleLogin(googleProvider);  
  }, []);
  // useEffect(() => {
  //   localStorage.getItem("users") && setIsLogin(true);
  // }, []);
  const ContentHTML = isLogin ? (
    <ChatBox />
  ) : (
    <div>
      <Row justify="center" style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: "center" }} level={3}>
            Đăng nhập cùng google để nhắn tin
          </Title>
          <Button
            style={{ width: "100%", masrginBottom: 5 }}
            onClick={() => handleLogin(googleProvider)}
          >
            Đăng nhập bằng Google
          </Button>
        </Col>
      </Row>
    </div>
  );

  return <>{ContentHTML}</>;
}
