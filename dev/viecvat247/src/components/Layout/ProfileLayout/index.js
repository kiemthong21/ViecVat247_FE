import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuBottom from "~/components/MenuBottom";

const ProfileLayout = ({ children }) => {
    const location = useLocation();
    const isLinkActive = (pathname) => {
        return location.pathname === pathname ? "active-link" : "text-dark";
    };

    return (
        <Fragment>
            <Header />
            <div className="layout">
                <div className="main-content">
                    <div className="container">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center pt-5 pb-5">
                            <div className="col-xl-3 col-md-3 mb-5">
                                <div className="nav-profile-settings">
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <span className="fs-6 fw-bold mb-3 d-block text-dark ">Tài khoản</span>
                                            <ul className="nav flex-column pl-3">
                                                <li className="nav-item mb-3">
                                                    <Link to="/user/profile" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/profile")}`}>
                                                        Thông tin tài khoản
                                                    </Link>
                                                </li>

                                                <li className="nav-item mb-3">
                                                    <Link to="/user/changepassword" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/changepassword")}`}>
                                                        Đổi mật khẩu
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <span className="fs-6 fw-bold mb-3 d-block text-dark">Quản lý giao dịch</span>
                                            <ul className="nav flex-column pl-3">
                                                <li className="nav-item mb-3">
                                                    <Link to="/user/deposit" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/deposit")}`}>
                                                        Nạp tiền
                                                    </Link>
                                                </li>
                                                <li className="nav-item mb-3">
                                                    <Link to="/user/withdraw" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/withdraw")}`}>
                                                        Rút tiền
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <span className="fs-6 fw-bold mb-3 d-block text-dark">Lịch sử giao dịch</span>
                                            <ul className="nav flex-column pl-3">
                                                <li className="nav-item mb-3">
                                                    <Link to="/user/transaction-history" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/transaction-history")}`}>
                                                        Biến động số dư
                                                    </Link>
                                                </li>
                                                <li className="nav-item mb-3">
                                                    <Link to="/user/deposit-history" className={`ms-3 sidebar-profile-link ${isLinkActive("/user/deposit-history")}`}>
                                                        Lịch sử nạp tiền
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-9 col-md-9 mb-5 justify-content-center">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <MenuBottom />
        </Fragment>
    );
};

export default ProfileLayout;
