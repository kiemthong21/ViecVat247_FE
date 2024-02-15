import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import images from "~/assets/images";
import Notification from "~/components/Notification";
import AddIcon from "@mui/icons-material/Add";
import BoxAccount from "~/components/BoxAccount";
import * as signalR from "@microsoft/signalr";
import request from "~/utils/request";
function HeaderLinks({ user }) {
    const location = useLocation();
    const isLinkActive = (pathname) => {
        return location.pathname === pathname ? "active-link" : "text-dark";
    };

    if (user === null) {
        // Trường hợp người dùng chưa đăng nhập
        return (
            <>
                <Link to="/create-recruitment" className={`menu-link ${isLinkActive("/create-recruitment")}`}>
                    Đăng tuyển dụng
                </Link>
                <Link to="/jobs" className={`menu-link ${isLinkActive("/jobs")}`}>
                    Tìm việc
                </Link>
            </>
        );
    } else {
        // Trường hợp người dùng đã đăng nhập, kiểm tra RoleID
        switch (user.roleid) {
            case 1:
                // Links cho RoleID = 1, Job Assigner
                return (
                    <>
                        <Link to="/create-recruitment" className={`menu-link ${isLinkActive("/create-recruitment")}`}>
                            Đăng tuyển dụng
                        </Link>
                        <Link to="/manage-jobs" className={`menu-link ${isLinkActive("/manage-jobs")}`}>
                            Quản lý công việc
                        </Link>
                    </>
                );
            case 2:
                // Links cho RoleID = 2, Job Seeker
                return (
                    <>
                        <Link to="/my-jobs-apply" className={`menu-link ${isLinkActive("/my-jobs-apply")}`}>
                            Việc đang thực hiện
                        </Link>
                        <Link to="/jobs" className={`menu-link ${isLinkActive("/jobs")}`}>
                            Tìm việc
                        </Link>
                    </>
                );
            default:
                return <></>;
        }
    }
}

function Header() {
    // Check user
    const user = JSON.parse(localStorage?.getItem("auth") != null ? localStorage?.getItem("auth") : null);

    // Xử lý hiển thị box account và box notify
    const [showBoxAccount, setShowBoxAccount] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [numUnreadNotifications, setNumUnreadNotifications] = useState(0);
    let box_notifyRef = useRef();
    let box_accountRef = useRef();
    const navigate = useNavigate();
    const handleOpenChat = () => {
        navigate("/login-with-chat");
    };

    useEffect(() => {
        let handler = (e) => {
            if (user !== null) {
                if (!box_notifyRef.current.contains(e.target)) {
                    setShowNotifications(false);
                }
                if (!box_accountRef.current.contains(e.target)) {
                    setShowBoxAccount(false);
                }
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const fetchNotifications = async () => {
        try {
            const token = localStorage?.getItem("token");
            if (!token) {
                navigate("/login");
            }
            const response = await request.get("Customer/GetNotification/10", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(response.data.list);
            setNumUnreadNotifications(response.data.list.filter((notification) => notification.status === 0).length);
            console.log(response.data.list.filter((notification) => notification.status === 0).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        const jwtToken = localStorage?.getItem("token");
        if (jwtToken) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://api.viecvat247.com/notificationHub", {
                    transport: signalR.HttpTransportType.WebSockets,
                    accessTokenFactory: () => `${jwtToken}`,
                })
                .build();

            const startConnection = async () => {
                try {
                    await connection.start();
                    console.log("Connected to SignalR Hub");
                    fetchNotifications();
                } catch (err) {
                    console.error(err);
                }
            };

            startConnection();

            connection.on("UpdateNotification", (message) => {
                console.log(message);
                fetchNotifications();
            });

            connection.onclose((error) => {
                console.log("Connection closed with error:", error);
            });
        }
    }, []);

    return (
        <header className="sticky-top">
            <nav className="heading">
                <div className="container header-container">
                    <div className="d-flex align-items-center">
                        <div className="box-logo">
                            <Link to="/">
                                <img src={images.logo_header.default} alt="Viecvat247" />
                            </Link>
                        </div>
                        <div className="d-none d-lg-flex h-100">
                            <div className="menu-item">
                                <HeaderLinks user={user} />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex">
                        {user === null ? (
                            <>
                                <Link to="/login" className="d-none d-lg-flex justify-content-center align-items-center btn btn-outline-primary btn-topup-header me-2 ">
                                    Đăng nhập
                                </Link>
                                <Link to="/signup" className="d-none d-lg-flex justify-content-center align-items-center btn btn-primary btn-topup-header me-2 ">
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <>
                                <button className=" btn btn-primary btn-topup-header me-2 d-none">
                                    <AddIcon />
                                </button>
                                <div className="box-message d-flex">
                                    <div className="box-icon" onClick={handleOpenChat} style={{ marginRight: "5px" }}>
                                        <i className="fab fa-facebook-messenger" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontSize: "25px" }}></i>
                                    </div>
                                </div>
                                <div className="box-notify d-flex" ref={box_notifyRef}>
                                    <div className="box-icon" onClick={() => setShowNotifications(!showNotifications)}>
                                        <img src={images.ring.default} alt="" />
                                        {numUnreadNotifications > 0 && <p className="num-notification">{numUnreadNotifications}</p>}
                                    </div>
                                    {showNotifications && <Notification notifications={notifications} onClose={() => setShowNotifications(false)} />}
                                </div>
                                <div className="box-account d-none d-md-block ms-2" ref={box_accountRef}>
                                    <div className="box-icon" onClick={() => setShowBoxAccount(!showBoxAccount)}>
                                        <img src={images.profile_account.default} alt="" />
                                    </div>
                                    {showBoxAccount && <BoxAccount user={user} onClose={() => setShowBoxAccount(false)} />}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
