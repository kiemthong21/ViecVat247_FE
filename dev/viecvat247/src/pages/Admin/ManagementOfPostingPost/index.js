import React, { useEffect, useState } from "react";
import { Button, Drawer, Pagination, Space, Table, DatePicker, Tabs, Select, message } from "antd";
import request from "~/utils/request";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuthorizationManage from "~/utils/useAuthorizationManage";
import { ExportOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const App = () => {
    useEffect(() => {
        document.title = "Bảng nạp tiền - Viecvat247";
    }, []);
    const { userManage, isInitialized } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!userManage) {
                navigate("/manage/login");
            }
        }
    }, [isInitialized]);
    useAuthorizationManage("Manager Money Create Jobs ");
    const [data, setData] = useState([]);
    const token = localStorage.getItem("manage-token");
    const [transactionsReport, setTransactionsReport] = useState({
        customerName: "",
        receiverName: "",
        jobName: "",
        epoint: "",
        detail: "",
        paymentdate: "",
        note: "",
        transactionType: "",
        bankCode: "",
        status: "",
    });
    const showDrawerEdit = (transactions) => {
        setIsDrawerOpen(true);
        setTransactionsReport({
            customerName: transactions?.customerName,
            receiverName: transactions?.receiverName,
            jobName: transactions?.jobName,
            epoint: transactions?.epoint,
            detail: transactions?.detail,
            paymentdate: transactions?.paymentdate,
            note: transactions?.note,
            transactionType: transactions?.transactionType,
            bankCode: transactions?.bankCode,
            status: transactions?.status,
        });
    };
    const formattpaymentdate = moment(transactionsReport?.paymentdate).format("YYYY-MM-DD HH:mm:ss");
    const columns = [
        {
            title: "Người gửi",
            dataIndex: "customerName",
            width: "12.5%",
            render: (_, record) => {
                return record?.customerName ? record?.customerName : "Quản trị viên";
            },
        },
        {
            title: "Người nhận",
            dataIndex: "receiverName",
            width: "12.5%",
            render: (_, record) => {
                return record?.receiverName ? record?.receiverName : "Quản trị viên";
            },
        },
        {
            title: "Cách thức giao dịch",
            dataIndex: "jobName",
            width: "12.5%",
            render: (_, record) => {
                return record?.jobName ? record?.jobName : transactionTypeMap[record.transactionType];
            },
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paymentdate",
            width: "12.5%",
            render: (_, record) => <Space size="middle">{record?.paymentdate ? moment(record?.paymentdate).format("YYYY-MM-DD HH:mm:ss") : ""}</Space>,
        },
        {
            title: "Số tiền",
            dataIndex: "epoint",
            width: "12.5%",
            render: (epoint) => (epoint ? epoint.toLocaleString() + " VNĐ" : "N/A"),
        },
        {
            title: "Loại giao dịch",
            dataIndex: "transactionType",
            width: "12.5%",
            render: (text, record) => {
                let transactionTypeText = "";
                switch (record?.transactionType) {
                    case 1:
                        transactionTypeText = "Nạp tiền";
                        break;
                    case 2:
                        transactionTypeText = "Rút tiền";
                        break;
                    case 3:
                        transactionTypeText = "Tạo bài đăng";
                        break;
                    case 4:
                        transactionTypeText = "Hoàn tiền";
                        break;
                    default:
                        transactionTypeText = "Không xác định";
                        break;
                }
                return <span>{transactionTypeText}</span>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: "10%",
            render: (_, record) => <Space size="middle">{record?.status === 0 ? <p>Không thành công</p> : <p>Thành công</p>}</Space>,
        },
        {
            title: <div style={{ textAlign: "left" }}>Hành động</div>,
            key: "action",
            width: "10%",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "#02AA8A",
                            color: "white",
                        }}
                        onClick={() => showDrawerEdit(record)}
                    >
                        Xem chi tiết
                    </Button>
                </Space>
            ),
        },
    ];

    const [totalItem, setTotalItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState([]);
    const [orderBy, setOrderBy] = useState("Epoint desc");
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const onShowSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };
    const handleDateChange = (dates) => {
        setDateRange(dates);
        setCurrentPage(1);
    };
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, dateRange, currentPage, pageSize]);

    const handleSearch = async () => {
        try {
            const startDateString = dateRange && dateRange[0] ? new Date(dateRange[0]).toISOString() : "";
            const endDateString = dateRange && dateRange[1] ? new Date(dateRange[1]).toISOString() : "";

            const response = await request.get("Staff/ListAllTransactions?transactionType=3", {
                params: {
                    customerId: null,
                    transactionType: null,
                    startDate: startDateString,
                    endDate: endDateString,
                    orderBy: orderBy,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(response.data.transactions);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleCancel = () => {
        setIsDrawerOpen(false);
    };
    const transactionTypeMap = {
        1: "Nạp tiền",
        2: "Rút tiền",
        3: "Tạo bài đăng",
        4: "Hoàn tiền",
    };
    const statusMap = {
        1: "Thành công",
        0: "Không thành công",
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Transaction", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transactionData.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting data: ", error);
            message.error("Lỗi khi xuất dữ liệu");
        }
    };
    return (
        <>
            <h2 style={{ color: "#02AA8A", fontWeight: "500" }}> Bảng quản lý giao dịch đăng bài của khách hàng</h2>
            <span className="fs-6 fw-bold me-2">Sắp xếp theo:</span>
            <Select
                id="orderBy"
                defaultValue="Epoint desc"
                style={{
                    width: 220,
                    marginRight: 8,
                }}
                onChange={handleChangeSort}
                options={[
                    {
                        value: "Epoint",
                        label: "Thứ tự giao dịch tăng dần",
                    },
                    {
                        value: "Epoint desc",
                        label: "Thứ tự giao dịch giảm dần",
                    },
                    {
                        value: "PaymentDate",
                        label: "Ngày thanh toán tăng dần",
                    },
                    {
                        value: "PaymentDate desc",
                        label: "Ngày thanh toán giảm dần",
                    },
                ]}
            />
            <Space direction="vertical" size={12} style={{ marginBottom: "20px" }}>
                <RangePicker showTime onChange={handleDateChange} />
            </Space>
            <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                Xuất dữ liệu
            </Button>
            <Drawer title="Thông tin chi tiết giao dịch" placement="right" closable={true} onClose={handleCancel} open={isDrawerOpen} width={720} extra={<Space></Space>}>
                <div layout="vertical">
                    <div className="row pt-1">
                        <div className="col-6 mb-3">
                            <h6>Tên khách hàng</h6>
                            <p className="text-muted">{transactionsReport?.customerName ? transactionsReport?.customerName : "Quản trị viên"}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Tên người nhận</h6>
                            <p className="text-muted">{transactionsReport?.receiverName ? transactionsReport?.receiverName : "Quản trị viên"}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Cách thức giao dịch</h6>
                            <p className="text-muted">{transactionsReport?.jobName ? transactionsReport?.jobName : transactionTypeMap[transactionsReport?.transactionType]}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Số tiềm</h6>
                            <p className="text-muted">{transactionsReport?.epoint?.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="col-12">
                            <h6>Chi tiết</h6>
                            <p className="text-muted"> {transactionsReport?.detail}</p>
                        </div>
                        <div className="col-12">
                            <h6>Ghi chú</h6>
                            <p className="text-muted"> {transactionsReport?.note}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Ngày thanh toán</h6>
                            <p className="text-muted"> {formattpaymentdate}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Loại giao dịch</h6>
                            <p className="text-muted">{transactionTypeMap[transactionsReport?.transactionType]}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Mã ngân hàng</h6>
                            <p className="text-muted"> {transactionsReport?.bankCode}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Trạng thái</h6>
                            <p className="text-muted">{statusMap[transactionsReport?.status]}</p>
                        </div>
                    </div>
                </div>
            </Drawer>
            <Table columns={columns} dataSource={data} pagination={false} />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItem}
                showSizeChanger={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={onPageChange}
                onShowSizeChange={onShowSizeChange}
                style={{ textAlign: "right", marginTop: "1em" }}
            />
        </>
    );
};

export default App;
