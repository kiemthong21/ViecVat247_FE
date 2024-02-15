import { Button, Card, Col, Collapse, Divider, Form, Input, InputNumber, Row, Spin, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "~/assets/images";
import LoadingIcon from "~/components/Loading";
import { useAuth } from "~/utils/AuthContext";
import request from "~/utils/request";
import useAuthorization from "~/utils/useAuthorization";
import { createPaymentUrl } from "~/utils/vnpay";
import Swal from "sweetalert2";

const Deposit = () => {
    useEffect(() => {
        document.title = "Nạp tiền - Viecvat247";
        const fbRoot = document.getElementById("fb-root");
        if (fbRoot) {
            fbRoot.style.display = "none";
        }
    }, []);

    // ------------------------------------------------------

    const { user, isInitialized } = useAuth();
    const token = localStorage?.getItem("token");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");

    const onSubmitPayment = (values) => {
        console.log("Success:", values);
        setLoading(true);
        const url = createPaymentUrl(values.amount, "https://viecvat247.com/user/deposit/");
        console.log(url);
        window.location.href = url;
    };

    const { Panel } = Collapse;
    const [form] = Form.useForm();

    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const infoObject = {};

        for (let pair of params.entries()) {
            infoObject[pair[0]] = pair[1];
        }
        if (infoObject) {
            if (infoObject.vnp_TransactionStatus === "00") {
                try {
                    request
                        .post(
                            "Staff/Deposit",
                            {
                                epoint: parseInt(infoObject.vnp_Amount) / 100,
                                orderInfo: infoObject.vnp_OrderInfo,
                                bankCode: infoObject.vnp_BankCode,
                                bankTranNo: infoObject.vnp_BankTranNo,
                                cardType: infoObject.vnp_CardType,
                                transactionNo: infoObject.vnp_TransactionNo,
                                transactionStatus: infoObject.vnp_TransactionStatus,
                                txnRef: infoObject.vnp_TxnRef,
                                secureHash: infoObject.vnp_SecureHash,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .then((response) => {
                            if (response.data.message === "payment_fail") {
                                Swal.fire({
                                    icon: "error",
                                    title: "GIAO DỊCH THẤT BẠI",
                                    text: `Số tiền thanh toán: ${(parseInt(infoObject.vnp_Amount) / 100).toLocaleString()} VNĐ`,
                                    showConfirmButton: true,
                                });
                                // alert("Thanh toán thất bại!");
                            }
                            if (response.data.message === "deposite_successful") {
                                Swal.fire({
                                    icon: "success",
                                    title: "GIAO DỊCH THÀNH CÔNG",
                                    text: `Số tiền thanh toán: ${(parseInt(infoObject.vnp_Amount) / 100).toLocaleString()} VNĐ`,
                                    showConfirmButton: true,
                                });
                                // alert("Thanh toán thành công!");
                            }

                            navigate("/user/deposit");
                            setLoading(false);
                            // Update data user
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
                        })
                        .catch((error) => {
                            setLoading(false);
                        });
                } catch (error) {
                    setLoading(false);
                }
            }
        }

        console.log(infoObject);
    }, [location.search]);

    // -------------------------------------
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
                            <div className="fs-5 fw-bold mb-3">Nạp tiền</div>
                            <Card
                                title="Chọn phương thức thanh toán:"
                                className="border border-1"
                                bodyStyle={{ padding: "unset" }}
                                style={{ borderBottomLeftRadius: "unset", borderBottomRightRadius: "unset" }}
                            >
                                <Collapse size="medium" style={{ borderRadius: "unset", border: "unset" }}>
                                    <Panel
                                        style={{ borderRadius: "unset" }}
                                        header={<div className="fw-bold">Thanh toán qua VNPAY</div>}
                                        extra={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img src={images.vnpay_logo.default} alt="VNPAY Logo" style={{ maxWidth: "100px", marginRight: "8px" }} />
                                            </div>
                                        }
                                        key="VNPAY"
                                    >
                                        <Form form={form} onFinish={onSubmitPayment} layout="vertical">
                                            <Form.Item
                                                label="Số tiền (VNĐ):"
                                                name="amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Nhập số tiền",
                                                    },
                                                    { type: "integer", min: 10000, max: 10000000, message: "Số tiền phải từ 10.000đ đến 10.000.000đ" },
                                                ]}
                                            >
                                                <InputNumber
                                                    type="number"
                                                    size="large"
                                                    style={{ width: "200px" }}
                                                    onChange={(value) => handleNumberChange("amount", value, form)}
                                                    placeholder="Vui lòng nhập số tiền"
                                                />
                                            </Form.Item>

                                            <Divider />
                                            <Form.Item>
                                                <Button className="w-100" type="primary" htmlType="submit" size="large" style={{ backgroundColor: "#01b195" }} disabled={loading}>
                                                    {loading ? <Spin /> : "Thanh toán"}
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    {/* <Panel
                                        style={{ borderRadius: "unset" }}
                                        header={<div className="fw-bold">Thanh toán qua ngân hàng</div>}
                                        extra={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img src={images.bank_logo.default} alt="Bank logo" style={{ maxWidth: "100px", marginRight: "8px" }} />
                                            </div>
                                        }
                                        key="BANK"
                                    >
                                        <div className="fs-6">Đang cập nhật</div>
                                    </Panel> */}
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Fragment>
    );
};

export default Deposit;
