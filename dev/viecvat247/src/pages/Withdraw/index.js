import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from "antd";
import LoadingIcon from "~/components/Loading";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";
import request from "~/utils/request";
import Swal from "sweetalert2";

const Withdraw = () => {
    useEffect(() => {
        document.title = "Rút tiền - Viecvat247";
    }, []);
    // ------------------------------------------------------
    const { user, isInitialized } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [banks, setBanks] = useState([]);
    const navigate = useNavigate();
    const { Option } = Select;
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");
    // ----------------------------------------------------------------

    useEffect(() => {
        if (firstLoad) {
            const token = localStorage.getItem("token");
            request
                .get("Customer/UserProfile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setData(res.data);
                })
                .catch(() => {
                    setLoading(false);
                });
            setFirstLoad(false);
        }
    }, [firstLoad]);
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const handleConfirm = (withdrawalInfo) => {
        modal.confirm({
            title: "Hãy kiểm tra thông tin của bạn lại một lần nữa",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        <strong>Số tiền:</strong> {withdrawalInfo.epoint.toLocaleString()} VNĐ
                    </p>
                    <p>
                        <strong>Tên ngân hàng thụ hưởng:</strong> {withdrawalInfo.bankCode}
                    </p>
                    <p>
                        <strong>Tên người thụ hưởng:</strong> {withdrawalInfo.bankAccountName}
                    </p>
                    <p>
                        <strong>Số tài khoản thụ hưởng:</strong> {withdrawalInfo.bankAccountNumber}
                    </p>
                </div>
            ),
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem("token");
                    request
                        .post("Staff/Withdraw", withdrawalInfo, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        })
                        .then((response) => {
                            if (response.data.message === "withDraw_successful") {
                                setLoading(false);
                                Swal.fire({
                                    icon: "success",
                                    title: "GIAO DỊCH THÀNH CÔNG",
                                    text: `Số tiền thanh toán: ${parseInt(withdrawalInfo.epoint).toLocaleString()} VNĐ`,
                                    showConfirmButton: true,
                                });
                                getUserProfile(token)
                                    .then((userData) => {
                                        const auth = JSON.parse(localStorage?.getItem("auth"));
                                        auth.avatar = userData.avatar;
                                        auth.fullname = userData.fullName;
                                        auth.money = userData.epoint;
                                        localStorage.setItem("auth", JSON.stringify(auth));
                                    })
                                    .catch((error) => {
                                        console.error("Error:", error);
                                    });
                                setFirstLoad(true);
                            }
                            if (response.data.message === "user_not_exist") {
                                setLoading(false);
                                Swal.fire({
                                    icon: "error",
                                    title: "GIAO DỊCH THẤT BẠI",
                                    text: `Email hoặc mật khẩu không chính xác`,
                                    showConfirmButton: true,
                                });
                            }
                            if (response.data.message === "insufficient_balance") {
                                setLoading(false);
                                Swal.fire({
                                    icon: "error",
                                    title: "GIAO DỊCH THẤT BẠI",
                                    text: `Số dư không khả dụng`,
                                    showConfirmButton: true,
                                });
                            }
                        });
                } catch (error) {
                    setLoading(false);
                }
            },
        });
    };

    async function getUserProfile(token) {
        try {
            const response = await request.get("Customer/UserProfile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const responseBanks = await request.get(`https://api.vietqr.io/v2/banks`);
                setBanks(responseBanks.data.data);
                console.log(responseBanks.data.data);
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };
        fetchBanks();
    }, []);
    const handleNumberChange = (fieldName, value, form) => {
        if (value < 0) {
            const updatedValue = Math.abs(value);
            const updatedField = {};
            updatedField[fieldName] = updatedValue;
            form.setFieldsValue(updatedField);
        }
    };

    return (
        <Fragment>
            {!isInitialized ? (
                <LoadingIcon />
            ) : (
                <>
                    <Row gutter={12}>
                        <Col span={24}>
                            <div className="fs-5 fw-bold mb-3">Rút tiền</div>
                            <div className="mt-2 mb-2 fs-6">
                                <span className="fw-bold">Số dư của bạn: </span>
                                <span className="fs-5 fw-bold" style={{ color: "red" }}>
                                    {data && data.epoint
                                        ? Number(data.epoint).toLocaleString("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                          })
                                        : "0"}
                                </span>
                            </div>
                            <Card className="m-0">
                                <Form form={form} onFinish={handleConfirm} layout="vertical">
                                    {/* <Form.Item label="Tên ngân hàng thụ hưởng" name="bankCode" hasFeedback rules={[{ required: true, message: "Tên ngân hàng thụ hưởng là bắt buộc" }]}>
                                        <Input />
                                    </Form.Item> */}
                                    <Form.Item
                                        name="bankCode"
                                        label="Tên ngân hàng thụ hưởng"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: "Ngân hàng thụ hưởng là bắt buộc",
                                            },
                                        ]}
                                    >
                                        <Select
                                            size="large"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            placeholder="Chưa chọn ngân hàng hàng thụ hưởng"
                                        >
                                            {banks.map((item) => (
                                                <Option key={item.id} value={item.code}>
                                                    {item.name + ` (${item.shortName})`}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Tên người thụ hưởng" name="bankAccountName" hasFeedback rules={[{ required: true, message: "Tên người thụ hưởng là bắt buộc" }]}>
                                        <Input size="large" placeholder="Vui lòng nhập tên người thụ hưởng" />
                                    </Form.Item>
                                    <Form.Item label="Số tài khoản thụ hưởng" name="bankAccountNumber" hasFeedback rules={[{ required: true, message: "Số tài khoản thụ hưởng là bắt buộc" }]}>
                                        <Input size="large" placeholder="Vui lòng nhập số tài khoản thụ hưởng" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Số tiền"
                                        name="epoint"
                                        rules={[
                                            { required: true, message: "Số tiền là bắt buộc" },
                                            { type: "integer", min: 10000, max: 1000000, message: "Số tiền rút tối thiểu là 10.000đ và hạn mức tối đa 1 lần rút là 1.000.000đ" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("epoint", value, form)} placeholder="Vui lòng nhập số tiền" />
                                    </Form.Item>
                                    <Form.Item label="Email" name="email" hasFeedback rules={[{ required: true, message: "Email là bắt buộc" }]}>
                                        <Input size="large" type="email" placeholder="Vui lòng nhập email" />
                                    </Form.Item>
                                    <Form.Item label="Mật khẩu" name="password" hasFeedback rules={[{ required: true, message: "Mật khẩu là bắt buộc" }]}>
                                        <Input.Password size="large" placeholder="Vui lòng nhập mật khẩu" />
                                    </Form.Item>
                                    <Form.Item className="d-flex justify-content-end mb-0">
                                        <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                        {contextHolder}
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Fragment>
    );
};

export default Withdraw;
