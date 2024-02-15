import { FacebookOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import images from "~/assets/images";

const Footer = () => (
    <footer className="main-footer">
        <div className="container">
            <div className="footer-content">
                <div className="row pt-5">
                    <div className="col-md-3">
                        <div className="footer-about pt-3">
                            <p className="mb-4">
                                <a className="brand-footer" href="/">
                                    <img src={images.logo_header_transparent.default} alt="" />
                                </a>
                            </p>
                            <div className="socials mb-4">
                                <Link to={""} target="_blank" className="text-white">
                                    <FacebookOutlined style={{ fontSize: "40px", color: "#white" }} />
                                </Link>
                                <Link to={""} target="_blank" className="text-white">
                                    <LinkedinOutlined style={{ fontSize: "40px", color: "#white" }} />
                                </Link>
                                <Link to={""} target="_blank" className="text-white">
                                    <TwitterOutlined style={{ fontSize: "40px", color: "#white" }} />
                                </Link>
                            </div>
                            <div className="contact mb-4">
                                <p className="mb-2">
                                    Điện thoại:{" "}
                                    <a className="text-white text-underline-none" href="tel:+84886969888">
                                        +84886969888
                                    </a>
                                </p>
                                <p className="mb-2">
                                    Email:{" "}
                                    <a className="text-white text-underline-none" href="mailto:viecvat247@gmail.com">
                                        viecvat247@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="menu-footer pt-3">
                                    <h3 className="font-size-18 mb-9">Về Viecvat247</h3>
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Giới thiệu
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Góc báo chí
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Blog
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="menu-footer pt-3">
                                    <h3 className="font-size-18 mb-9">Nhà tuyển dụng</h3>
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Đăng tuyển
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Cách thức hoạt động
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm ứng viên
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm ứng viên theo kỹ năng
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm ứng viên theo lĩnh vực
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm ứng viên theo địa điểm
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="menu-footer pt-3">
                                    <h3 className="font-size-18 mb-9">Ứng viên</h3>
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Đăng ký
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Cách thức hoạt động
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm việc trực tuyến
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/" target="_self" className="nav-link pl-0 pr-0 pb-1 pt-1 text-white font-size-16">
                                                Tìm việc trực tiếp
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="policy mt-3 mb-3 border-top border-bottom border-top-color-white border-bottom-color-white">
                    <div className="row">
                        <div className="col-lg-9">
                            <ul className="nav flex-lg-row flex-column"></ul>
                        </div>
                        <div className="col-lg-3 justify-content-lg-end d-lg-flex align-items-lg-center">
                            <div className="dropdown d-inline-block"></div>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright text-center mt-3 pt-3 pb-3">
                    <span className="text font-size-16">Copyright © {new Date().getFullYear()} Viecvat247 Co., Ltd. All Rights Reserved.</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
