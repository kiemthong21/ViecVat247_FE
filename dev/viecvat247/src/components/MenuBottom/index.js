import { Drawer } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import images from "~/assets/images";

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

const MenuBottom = () => {
    // Check user
    const user = JSON.parse(localStorage?.getItem("auth") != null ? localStorage?.getItem("auth") : null);

    const location = useLocation();

    const isLinkActive = (pathname) => {
        return location.pathname === pathname ? "is-active" : "";
    };

    const [open, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    return (
        <div id="menu-bottom-tabs" className="tabs">
            <div className="list-menu-bottom">
                <div className="menu-bottom-item">
                    <Link to="/" className="menu-bottom-link">
                        <span className={`${isLinkActive("/")}`}>
                            <img src={images.home.default} alt="Home" />
                        </span>
                        <span className="menu-bottom_text">Trang chủ</span>
                    </Link>
                </div>
                <div className="menu-bottom-item">
                    <Link onClick={showDrawer} className="menu-bottom-link">
                        <span className={open ? "is-active" : ""}>
                            <img src={images.menu.default} alt="Menu" />
                        </span>
                        <span className="menu-bottom_text">Menu</span>
                    </Link>
                    <Drawer title={"Menu"} placement="right" size={"large"} onClose={onClose} open={open}>
                        <div>
                            <HeaderLinks user={user} />
                        </div>
                    </Drawer>
                </div>
                <div className="menu-bottom-item">
                    <Link to="/user/deposit" className="menu-bottom-link">
                        <span className={`${isLinkActive("/user/deposit")}`}>
                            <img src={images.charge.default} alt="Nạp Tiền" />
                        </span>
                        <span className="menu-bottom_text">Nạp tiền</span>
                    </Link>
                </div>
                <div className="menu-bottom-item">
                    <Link to="/user/profile" className="menu-bottom-link">
                        <span className={`${isLinkActive("/user/profile")}`}>
                            <img src={images.profile.default} alt="Tài khoản" />
                        </span>
                        <span className="menu-bottom_text">Tài khoản</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MenuBottom;
