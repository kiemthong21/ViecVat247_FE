import React, { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Form, Input, Pagination, Popconfirm, Rate, Select, Space, Table, Tabs, message } from "antd";
import request from "~/utils/request";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { TabPane } from "react-bootstrap";
import images from "~/assets/images";
import useAuthorizationManage from "~/utils/useAuthorizationManage";
import { ExportOutlined } from "@ant-design/icons";
const App = () => {
    useEffect(() => {
        document.title = "Bảng khách hàng - Viecvat247";
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
    useAuthorizationManage("Manager Customer");
    const [data, setData] = useState([]);
    const token = localStorage.getItem("manage-token");
    const changeStatus = async (cid, action) => {
        try {
            let url = "";
            if (action === "active") {
                url = `Staff/BanOrBanRemoveCustomer/${cid}`;
            } else if (action === "inactive") {
                url = `Staff/BanOrBanRemoveCustomer/${cid}`;
            }
            const response = await request.put(url, cid, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.message === "ban_remove_successful") {
                message.success(`Customer ${action === "active" ? "inactivated" : "activated"} successfully`);
                handleSearch();
            } else if (response.data.message === "ban_successful") {
                message.success(`Customer ${action === "inactive" ? "activated" : "inactivated"} successfully`);
                handleSearch();
            } else {
                message.error(`Failed to ${action === "active" ? "activate" : "inactivate"} Customer`);
            }
        } catch (error) {
            console.error(`Error while changing status: ${error}`);
            message.error(`Failed to ${action === "active" ? "activate" : "inactivate"} Customer`);
        }
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`Staff/GetCustomer/${record.cid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const customers = response.data;
            setEditRecord(customers);
            setIsDrawerOpen(true);
        } catch (error) {
            console.error("Error fetching skill details: ", error);
            message.error("Failed to fetch skill details");
        }
    };
    const formatdate = moment(editRecord?.dob).format("YYYY-MM-DD");
    const formatcreateDate = moment(editRecord?.createDate).format("YYYY-MM-DD HH:mm:ss");
    const handleCancel = () => {
        setIsDrawerOpen(false);
    };
    const columns = [
        {
            title: "Email",
            dataIndex: "cemail",
            width: "11.11%",
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            width: "11.11%",
            render: (_, record) => <Space size="middle">{record.status === 1 ? <p>Job Assigner</p> : <p>Job Seeker</p>}</Space>,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            width: "11.11%",
        },
        {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            width: "11.11%",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createDate",
            width: "11.11%",
            render: (_, record) => <Space size="middle">{record?.createDate ? moment(record.createDate).format("YYYY-MM-DD HH:mm:ss") : ""}</Space>,
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            width: "11.11%",
            render: (_, record) => <Space size="middle">{record?.dob ? moment(record.dob).format("YYYY-MM-DD") : ""}</Space>,
        },
        {
            title: "Ảnh",
            dataIndex: "avatar",
            width: "11.11%",
            render: (_, record) => (
                <Avatar
                    src={record?.avatar && isValidImageUrl(record?.avatar) ? record?.avatar : images.avatar.default}
                    size={{ xs: 14, sm: 12, md: 20, lg: 44, xl: 60, xxl: 50 }}
                    className="me-2"
                ></Avatar>
            ),
        },
        {
            title: <div style={{ textAlign: "left" }}>Trạng thái</div>,
            dataIndex: "status",
            width: "8%",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 1 ? (
                        <Popconfirm title="Bạn có chắc là muốn thay đổi trạng thái này?" okText="Có" cancelText="Không" onConfirm={() => changeStatus(record.cid, "active")} className="">
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: "#02AA8A",
                                    border: "2px solid #02AA8A",
                                    color: "white",
                                }}
                            >
                                Hoạt động
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm title="Bạn có chắc là muốn thay đổi trạng thái này?" okText="Có" cancelText="Không" onConfirm={() => changeStatus(record.cid, "inactive")}>
                            <Button danger ghost>
                                Không hoạt động
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: <div style={{ textAlign: "left" }}>Hành động</div>,
            key: "action",
            width: "8%",
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

    const [searchText, setSearchText] = useState(null);
    const [totalItem, setTotalItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [role, setRole] = useState([]);
    const [status, setStatus] = useState([]);
    const [orderBy, setOrderBy] = useState("id desc");
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const onShowSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const onSearchText = (value, _e) => {
        setSearchText(value);
        setCurrentPage(1);
    };
    const callbackRole = (key) => {
        setRole(key);
        setCurrentPage(1);
    };
    const onChangeStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, role, status, searchText, currentPage, pageSize]);

    const handleSearch = async () => {
        try {
            const response = await request.get("Staff/GetCustomers", {
                params: {
                    searchValue: searchText,
                    status: status,
                    orderBy: orderBy,
                    role: role,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.customers);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };
    const isValidImageUrl = (url) => {
        const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
        return imageUrlRegex.test(url);
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Customer", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "CustomerData.xlsx");
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}> Bảng quản lý khách hàng</h2>
                <Input.Search placeholder="tìm kiếm..." allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
            </div>

            <span className="fs-6 fw-bold me-2">Hình thức:</span>
            <Select
                placeholder="Lựa chọn trạng thái"
                onChange={onChangeStatus}
                style={{
                    width: "150px",
                    marginRight: 8,
                }}
                defaultValue=""
                options={[
                    {
                        value: "",
                        label: "Tất cả trạng thái",
                    },
                    {
                        value: "1",
                        label: "Hoạt động",
                    },
                    {
                        value: "0",
                        label: "Không hoạt động",
                    },
                ]}
            />
            <span className="fs-6 fw-bold me-2">Sắp xếp theo:</span>
            <Select
                id="orderBy"
                defaultValue="id_desc"
                style={{
                    width: 180,
                }}
                onChange={handleChangeSort}
                options={[
                    {
                        value: "id",
                        label: "Thứ tự tăng dần",
                    },
                    {
                        value: "id_desc",
                        label: "Thứ tự giảm dần",
                    },
                    {
                        value: "email",
                        label: "Email tăng dần",
                    },
                    {
                        value: "email_desc",
                        label: "Email giảm dần",
                    },
                    {
                        value: "name",
                        label: "Tên tăng dần",
                    },
                    {
                        value: "name_desc",
                        label: "Tên giảm dần",
                    },
                    {
                        value: "address",
                        label: "Nơi ở tăng dần",
                    },
                    {
                        value: "address_desc",
                        label: "Nơi ở giảm dần",
                    },
                ]}
            />
            <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                Xuất dữ liệu
            </Button>
            <Tabs defaultActiveKey="" onChange={callbackRole}>
                <TabPane tab="Tất cả" key="">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Người giao việc" key="1">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Người nhận việc" key="2">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
            </Tabs>
            <Drawer
                title="xem chi tiết thông tin khách hàng"
                width={600}
                onClose={handleCancel}
                open={isDrawerOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                /* Rest of your Drawer setup */
                extra={
                    <Space>
                        <Button onClick={handleCancel}>hủy</Button>
                    </Space>
                }
            >
                <Form name="form-edit" layout="vertical">
                    <div style={{ marginBottom: "20px" }}>
                        <Avatar
                            src={editRecord?.avatar && isValidImageUrl(editRecord?.avatar) ? editRecord.avatar : images.avatar.default}
                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                            className="me-2"
                        ></Avatar>
                        <div className="d-flex flex-column">
                            <span className="fw-bold text-dark">
                                {editRecord?.role === 1 ? "Nhà tuyển dụng" : "Ứng viên"} | ID: {editRecord?.cid}
                            </span>
                            <span className="d-flex align-items-center">
                                <span className="me-2 fw-bold">Đánh giá:</span>
                                <Rate disabled defaultValue={editRecord?.voting && editRecord?.voting > 0 ? editRecord?.voting : 0} />
                            </span>
                        </div>
                    </div>
                    <div layout="vertical">
                        <div className="row pt-1">
                            <div className="col-6 mb-3">
                                <h6>Tên đầy đủ</h6>
                                <p className="text-muted">{editRecord?.fullName}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Email</h6>
                                <p className="text-muted">{editRecord?.cemail}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Số điện thoại</h6>
                                <p className="text-muted">{editRecord?.phoneNumber}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Số tiềm</h6>
                                <p className="text-muted">{editRecord?.epoint} VND</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Năm sinh</h6>
                                <p className="text-muted">{formatdate}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Nơi ở</h6>
                                <p className="text-muted">{editRecord?.address}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Ngày tạo tài khoản</h6>
                                <p className="text-muted">{formatcreateDate}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>giới tính</h6>
                                <p className="text-muted">{editRecord?.gender ? "male" : "female"}</p>
                            </div>
                        </div>
                    </div>
                </Form>
            </Drawer>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItem}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={onPageChange}
                onShowSizeChange={onShowSizeChange}
                style={{ textAlign: "right", marginTop: "1em" }}
            />
        </>
    );
};

export default App;
