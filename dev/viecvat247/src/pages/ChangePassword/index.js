import React, { Fragment, useEffect, useState } from "react";
import request from "~/utils/request";
import { Button, Card, Col, Input, Row, Spin, message, Form } from "antd";
import { utils } from "~/utils/utils";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import useAuthorization from "~/utils/useAuthorization";
import LoadingIcon from "~/components/Loading";
import Swal from "sweetalert2";

function Changepassword() {
    useEffect(() => {
        document.title = "Đổi mật khẩu - Viecvat247";
    }, []);
    // ------------------------------------------------------
    const { user, isInitialized, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");
    // ----------------------------------------------------------------

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const handleSubmit = (formChangePassword) => {
        setLoading(true);

        if (formChangePassword.oldPassword.trim() === "" || formChangePassword.newPassword.trim() === "" || formChangePassword.confirmPassword.trim() === "") {
            message.error("Vui lòng điền đầy đủ thông tin.");
            setLoading(false);
            return;
        } else if (!utils.validatePassword(formChangePassword.newPassword.trim()) || !utils.validatePassword(formChangePassword.confirmPassword.trim())) {
            message.warning("Mật khẩu cần chứa ít nhất một chữ in hoa, một chữ thường, một số, một ký tự đặc biệt và có ít nhất 8 ký tự.");
            setLoading(false);
            return;
        } else if (formChangePassword.newPassword.trim() !== formChangePassword.confirmPassword.trim()) {
            message.error("Xác nhận mật khẩu và mật khẩu mới phải giống nhau");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }
        request
            .post("Customer/ChangePassword", formChangePassword, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.message) {
                    if (response.data.message === "wrong_password") {
                        // message.error("Mật khẩu cũ không đúng");
                        Swal.fire({
                            icon: "error",
                            title: "Thay đổi mật khẩu không thành công",
                            text: `Mật khẩu cũ không chính xác`,
                            showConfirmButton: true,
                            confirmButtonText: "Đóng",
                            confirmButtonColor: "#02aa8a",
                        });
                        setLoading(false);
                    }
                }
                if (response.data.message === "update_successful") {
                    // message.success("Thay đổi mật khẩu thành công");
                    Swal.fire({
                        icon: "success",
                        title: "Thay đổi mật khẩu thành công",
                        text: `Tài khoản của bạn đã được thay đổi mật khẩu, vui lòng đăng nhập lại để tiếp tục giao dịch`,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Về trang chủ",
                        cancelButtonText: "Đăng nhập lại",
                        confirmButtonColor: "#02aa8a",
                        cancelButtonColor: "#dc3545",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/";
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            logout();
                        }
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                message.error(error);
                setLoading(false);
            });
    };

    return (
        <div>
            <Fragment>
                {!isInitialized ? (
                    <LoadingIcon />
                ) : (
                    <>
                        <Row gutter={12}>
                            <Col span={24}>
                                <div className="fs-5 fw-bold mb-3">Đổi mật khẩu</div>
                                <Card className="m-0">
                                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                                        <Form.Item label="Mật khẩu cũ" name="oldPassword" hasFeedback rules={[{ required: true, message: "Bạn chưa nhập mật khẩu" }]}>
                                            <Input.Password size="large" placeholder="Vui lòng nhập mật khẩu cũ" />
                                        </Form.Item>
                                        <Form.Item label="Mật khẩu mới" name="newPassword" hasFeedback rules={[{ required: true, message: "Bạn chưa nhập mật khẩu mới" }]}>
                                            <Input.Password size="large" placeholder="Vui lòng nhập mật khẩu mới" />
                                        </Form.Item>
                                        <Form.Item label="Xác nhận" name="confirmPassword" hasFeedback rules={[{ required: true, message: "Bạn chưa nhập mật khẩu xác nhận" }]}>
                                            <Input.Password size="large" placeholder="Vui lòng xác nhận mật khẩu mới" />
                                        </Form.Item>
                                        <Form.Item className="d-flex justify-content-end mb-0">
                                            <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit" size="large" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Spin className="me-2" />
                                                        Đổi mật khẩu
                                                    </>
                                                ) : (
                                                    "Đổi mật khẩu"
                                                )}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Fragment>
        </div>
    );
}

export default Changepassword;
