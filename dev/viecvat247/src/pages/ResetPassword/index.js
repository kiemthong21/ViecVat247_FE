import { Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import request from "~/utils/request";

const NewPassword = () => {
    const [userInfo, setUserInfo] = useState({
        id: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const idParams = searchParams.get("mail");
        const codeParam = searchParams.get("code");

        if (!codeParam || !idParams) {
            message.error("Không tìm thấy thông tin cần thiết.");
        } else {
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                code: codeParam,
                id: idParams,
            }));
        }
    }, [searchParams.get("mail"), searchParams.get("code")]);

    const handleUserInfoChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        if (userInfo.newPassword === "" || userInfo.confirmPassword === "") {
            message.error("Vui lòng điền đầy đủ thông tin");
            setLoading(false);
            return;
        } else if (userInfo.newPassword !== userInfo.confirmPassword) {
            message.error("ConfirmPassword và newPassword phải giống nhau");
            setLoading(false);
            return;
        }
        request
            .post(`Customer/ForgotPassword/${userInfo.id}/${userInfo.code}`, { newPassword: userInfo.newPassword, confirmPassword: userInfo.confirmPassword })
            .then((response) => {
                if (response.data.message === "update_successful.") {
                    message.success("Đổi mật khẩu thành công");
                    setLoading(false);
                    navigate("/login");
                }
                else if (response.data.message === "error") {
                    message.error("Đổi mật khẩu không thành công.");
                    setLoading(false);
                } 
                else {
                    message.error("Đổi mật khẩu không thành công.");
                    setLoading(false);
                }
            })
            .catch((error) => {
                message.error("Đổi mật khẩu không thành công");
                setLoading(false);
            });
    };

    return (
        <div>
            <section className="vh-100">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-11">
                            <div className="card text-black">
                                <div className="card-body p-md-5">
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đổi mật khẩu</p>
                                            <input type="text" name="email" hidden="hidden" />
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label">Mật khẩu mới</label>
                                                    <input
                                                        type="password"
                                                        id="form3Example1c"
                                                        className="form-control"
                                                        required
                                                        value={userInfo.newPassword}
                                                        onChange={handleUserInfoChange}
                                                        name="newPassword"
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label">Xác nhận mật khẩu</label>
                                                    <input
                                                        type="password"
                                                        id="form3Example3c"
                                                        className="form-control"
                                                        required
                                                        value={userInfo.confirmPassword}
                                                        onChange={handleUserInfoChange}
                                                        name="confirmPassword"
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-block mb-4 mb-lg-4 text-center">
                                                <button className="btn btn-primary btn-block px-5 w-100" type="submit" onClick={handleSubmit} disabled={loading}>
                                                {loading ? (
                                                     <>   <Spin className="me-2" />
                                                     Xác nhận</>
                                                 
                                                    ) :( "Xác nhận") }
                                                </button>
                                            </div>

                                            <div className="text-center pt-2">
                                            <button className="btn btn-secondary">
                                                    <Link style={{textDecoration: "none", color:"white"}} to="/login">Quay về trang đăng Nhập</Link>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewPassword;
