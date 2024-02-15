import React, { Fragment, useState } from "react";
import images from "~/assets/images";
import request from "~/utils/request";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { utils } from "~/utils/utils";

function AccountRegistration({ selectedRole }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        roleId: selectedRole,
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        setLoading(true);
        if (!formData.agreeToTerms) {
            message.warning("Bạn chưa đồng ý với điều khoản!");
            setLoading(false);
            return;
        }
        if (!utils.validatePassword(formData.password) || !utils.validatePassword(formData.confirmPassword)) {
            message.warning("Mật khẩu cần chứa ít nhất một chữ in hoa, một chữ thường, một số, một ký tự đặc biệt và có ít nhất 8 ký tự.");
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            message.warning("Mật khẩu xác nhận không chính xác!");
            setLoading(false);
            return;
        }

        try {
            request
                .post("Authen/Register", formData)
                .then((response) => {
                    if (response.data.message === "email_has_been_registered") {
                        message.error("Email này đã tồn tại trên hệ thống!");
                    }
                    if (response.data.message === "register_successful") {
                        message.success("Đăng ký thành công vui lòng kiểm tra email của bạn");
                        navigate("/login");
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    // message.error(error);
                    setLoading(false);
                });
        } catch (error) {
            // message.error(error);
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

        console.log(formData);
    };

    return (
        <Fragment>
            <div className="container">
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <Link to="/" className="">
                        <img src={images.logo.default} alt="Logo" />
                    </Link>
                </div>
                <div className="box-login-outline">
                    <form className="w-100 box-login" onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-center flex-column align-items-center">
                            <span className="fs-2 fw-normal mb-3">Đăng ký tài khoản Viecvat247</span>
                        </div>
                        {/* <a className="c-btn-google btn btn-block w-100 fw-bold " target="_blank" href="google.com" role="button">
                            <span>
                                <img className="rounded-circle me-2" src={images.google.default} alt="" />
                            </span>
                            Đăng ký với Google{" "}
                        </a>
                        <div className="c-divider">
                            <span>HOẶC</span>
                        </div> */}
                        <div className="form-outline mb-4">
                            <input type="text" className="form-control form-control-lg c-input" placeholder="Tên đầy đủ" name="fullname" value={formData.fullname} onChange={handleChange} required />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="email" className="form-control form-control-lg c-input" placeholder="Địa chỉ email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="password" className="form-control form-control-lg c-input" placeholder="Mật khẩu" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-outline mb-4">
                            <input
                                type="password"
                                className="form-control form-control-lg c-input"
                                placeholder="Nhập lại mật khẩu"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input id="agreeToTerms" className="form-check-input" name="agreeToTerms" type="checkbox" value={formData.agreeToTerms} onChange={handleChange} />

                                <label className="form-check-label" htmlFor="agreeToTerms">
                                    {" "}
                                    Vâng, tôi hiểu và đồng ý với{" "}
                                    <Link className="text-decoration-none" to="">
                                        Điều khoản dịch vụ
                                    </Link>{" "}
                                    và
                                    <Link className="text-decoration-none" to="">
                                        {" "}
                                        Chính sách quyền riêng tư
                                    </Link>{" "}
                                    của <span className="fw-bold">Viecvat247</span>.
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="c-btn-submit btn btn-primary btn-lg btn-block w-100 d-flex justify-content-center align-items-center" disabled={loading}>
                            {loading ? <Spin /> : "Đăng ký"}
                        </button>

                        <div className="d-flex justify-content-center py-4">
                            <span className="me-2">Đã có tài khoản?</span>
                            <Link to="/login" className="text-decoration-none justify-content-start">
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default AccountRegistration;
