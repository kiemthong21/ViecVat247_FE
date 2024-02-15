import { Fragment, useEffect, useState } from "react";
import request from "~/utils/request";
import images from "~/assets/images";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { useAuth } from "~/utils/AuthContext";
import LoadingIcon from "~/components/Loading";

const Login = () => {
    const navigate = useNavigate();
    const [checkLoading, setCheckLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const { loginManage } = useAuth();
    useEffect(() => {
        const auth = localStorage?.getItem("manage-auth");
        if (auth) {
            navigate("/manage/dashboard");
        } else {
            setCheckLoading(false);
        }
    }, []);
    const saveLogin = (response) => {
        loginManage(response);
        navigate("/manage/dashboard");
    };
    useEffect(() => {
        document.title = "Bảng đăng nhập - Viecvat247";
    }, []);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!formData.email || !formData.password) {
            message.warning("Email/Mật khẩu là bắt buộc!", [1.5]);
            setLoading(false);
            return;
        }
        try {
            request
                .post("Authen/Staff/Login", formData)
                .then((response) => {
                    if (response.data.message === "email_password_wrong") {
                        message.error("Tài khoản hoặc mật khẩu không chính xác!", [1.5]);
                        setLoading(false);
                    }
                    if (response.data.message === "account_has_ban") {
                        message.error("Tài khoản này đã bị cấm!", [1.5]);
                        setLoading(false);
                    }
                    if (response.data.token) {
                        saveLogin(response);
                        message.success("Đăng nhập thành công");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống đã quá tải!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Hệ thống đã quá tải!");
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    return (
        <Fragment>
            {checkLoading ? (
                <LoadingIcon />
            ) : (
                <div className="container">
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <Link to="/" className="">
                            <img src={images.logo.default} alt="Logo" />
                        </Link>
                    </div>
                    <div className="box-login-outline">
                        <form className="w-100 box-login" onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-center flex-column align-items-center">
                                <span className="fs-3 fw-normal">Đăng nhập vào quản lý Viecvat247</span>
                            </div>
                            <div className="c-divider mb-5"></div>
                            <div className="form-outline mb-4">
                                <input type="email" className="form-control form-control-lg c-input" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    className="form-control form-control-lg c-input"
                                    placeholder="Mật khẩu"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" name="rememberMe" type="checkbox" value={formData.rememberMe} onChange={handleChange} />
                                    <span className="form-check-label"> Nhớ đăng nhập </span>
                                </div>
                            </div>

                            <button type="submit" className="c-btn-submit btn btn-primary btn-lg btn-block w-100 d-flex justify-content-center align-items-center" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spin className="me-2" />
                                        Đăng nhập
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Login;
