import React, { useState } from "react";
import request from "~/utils/request";
import { Spin, message } from "antd";
import { Link } from "react-router-dom";
const SendMail = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = () => {
        setLoading(true)
        if (!email) {
            message.error("Email là bắt buộc!");
            setLoading(false)
            return;
        }

        request
            .post("Customer/ForgotPassword?email=" + email)
            .then((response) => {
                if (response.data.message === "not_found") {
                    message.error("Không tìm thấy email");
                    setLoading(false)
                }
                if (response.data.message === "check_mail") {
                    message.success("Gửi mail thành công, vui lòng kiểm tra email của bạn");
                    setLoading(false)
                }
            })
            .catch((error) => {
                message.error(error);
                setLoading(false)
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
                                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                                                Bạn quên mật khẩu?
                                            </p>
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nhập email của bạn"
                                                    aria-describedby="button-addon2"
                                                    required=""
                                                    name="email"
                                                    value={email}
                                                    onChange={(event) => setEmail(event.target.value)}
                                                />
                                                <button
                                                    className="btn btn-success"
                                                    type="submit"
                                                    onClick={handleLogin}
                                                    style={{
                                                        width:"150px",
                                                        height:"38px",
                                                        marginLeft:"5px"
                                                    }}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                     <>   <Spin className="me-2" />
                                                     Gửi email</>
                                                 
                                                    ) :( "Gửi email") }
                                                </button>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-2  text-danger"></div>
                                            <div className="text-center pt-2">
                                                <button className="btn btn-secondary">
                                                    <Link style={{textDecoration: "none", color:"white"}} to="/login">Quay về trang đăng Nhập</Link>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img
                                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                                className="img-fluid"
                                                alt=""
                                            />
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

export default SendMail;
