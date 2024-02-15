import { Col, Row, Table, Tag } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "~/components/Loading";
import { useAuth } from "~/utils/AuthContext";
import request from "~/utils/request";
import useAuthorization from "~/utils/useAuthorization";

const TransactionHistory = () => {
    const { user, isInitialized } = useAuth();
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
    const [loading, setLoading] = useState(false);
    const [dataApi, setDataApi] = useState([]);
    const columns = [
        {
            title: "Mã giao dịch",
            dataIndex: "transactionId",
            key: "transactionId",
        },
        {
            title: "Ngày giao dịch",
            dataIndex: "paymentdate",
            key: "paymentdate",
        },
        {
            title: "Số tiền",
            dataIndex: "epoint",
            key: "epoint",
            render: (_, record) => {
                if (record.transactionType === 1 || record.transactionType === 4) {
                    return (
                        <Tag bordered={false} color="green">
                            +{record.epoint.toLocaleString()}
                        </Tag>
                    );
                }
                if (record.transactionType === 2 || record.transactionType === 3) {
                    return (
                        <Tag bordered={false} color="red">
                            -{record.epoint.toLocaleString()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: "Mô tả",
            dataIndex: "detail",
            key: "detail",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => (text === 1 ? <Tag color="#87d068">Thành công</Tag> : <Tag color="#f50">Thất bại</Tag>),
        },
        {
            title: "Số dư trước giao dịch",
            dataIndex: "oldBalance",
            key: "oldBalance",
            render: (text) => (text ? text.toLocaleString() : text),
        },
        {
            title: "Số dư sau giao dịch",
            dataIndex: "newBalance",
            key: "newBalance",
            render: (text) => (text ? text.toLocaleString() : text),
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage?.getItem("token");
            const response = await request.get("Staff/ListAllTransactionsByCustomer", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    orderBy: "PaymentDate desc",
                },
            });
            setDataApi(response.data.transactions);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
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
                            <div className="fs-5 fw-bold mb-3">Lịch sử nạp tiền</div>
                            <Table columns={columns} dataSource={dataApi} />
                        </Col>
                    </Row>
                </>
            )}
        </Fragment>
    );
};

export default TransactionHistory;
