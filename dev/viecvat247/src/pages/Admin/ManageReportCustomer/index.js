import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Pagination, Space, Table, message, Form, Drawer, DatePicker, Tabs, Image, Select, Spin } from "antd";
import request from "~/utils/request";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { EditOutlined, ExportOutlined } from "@ant-design/icons";
import moment from "moment";
import { TabPane } from "react-bootstrap";
import useAuthorizationManage from "~/utils/useAuthorizationManage";
import images from "~/assets/images";
const { RangePicker } = DatePicker;

const App = () => {
    useEffect(() => {
        document.title = "Bảng phản hồi khách hàng - Viecvat247";
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

    useAuthorizationManage("Manager Report");
    const [form] = Form.useForm();
    const token = localStorage.getItem("manage-token");
    const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`/Staff/Report/${record.reportId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const reports = response.data;
            console.log(reports);
            setEditRecord(reports);

            setOpenDrawerEdit(true);
        } catch (error) {
            console.error("Error fetching skill details: ", error);
            message.error("Failed to fetch skill details");
        }
    };
    const onCloseDrawerEdit = () => {
        setOpenDrawerEdit(false);
        form.resetFields();
    };
    const isValidImageUrl = (url) => {
        const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
        return imageUrlRegex.test(url);
    };
    const columns = [
        {
            title: "Tên khách hàng",
            dataIndex: "customerName",
            width: "12.5%",
        },
        {
            title: "Email",
            dataIndex: "customerEmail",
            width: "12.5%",
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            width: "12.5%",
        },
        {
            title: "Thời gian nhận phản hồi",
            dataIndex: "timestamp",
            width: "12.5%",
            render: (_, record) => <Space size="middle">{record?.timestamp ? moment(record?.timestamp).format("YYYY-MM-DD HH:mm:ss") : ""}</Space>,
        },
        {
            title: "Thời gian trả lời phản hồi",
            dataIndex: "timeFeedback",
            width: "12.5%",
            render: (_, record) => <Space size="middle">{record?.timeFeedback ? moment(record?.timeFeedback).format("YYYY-MM-DD HH:mm:ss") : ""}</Space>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: "10%",
            render: (_, record) => <Space size="middle">{record.status === 0 ? <p>Chưa xử lý</p> : <p>Đã xử lý</p>}</Space>,
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
                            color: "#02AA8A",
                            border: "2px solid #02AA8A",
                        }}
                        onClick={() => showDrawerEdit(record)}
                        ghost
                        icon={<EditOutlined />}
                    >
                        Gửi phản hồi
                    </Button>
                </Space>
            ),
        },
    ];
    const [loading, setLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState([]);
    const [status, setStatus] = useState([]);
    const [orderBy, setOrderBy] = useState("id_desc");
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
    const callbackRole = (key) => {
        setStatus(key);
        setCurrentPage(1);
    };
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, status, dateRange, currentPage, pageSize]);

    const handleSearch = async () => {
        const startDateString = dateRange && dateRange[0] ? new Date(dateRange[0]).toISOString() : "";

        const endDateString = dateRange && dateRange[1] ? new Date(dateRange[1]).toISOString() : "";
        try {
            const response = await request.get("Staff/GetReports", {
                params: {
                    searchValue: null,
                    status: status,
                    orderBy: orderBy,
                    startDate: startDateString,
                    endDate: endDateString,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.reports);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    /*--------------------------------------------------------------------------------------------------------------*/

    const [data, setData] = useState([]);

    const onSubmitEditReport = (values) => {
        setLoading(true);
        const id = editRecord.reportId;
        const feedback = values.feedback;
        if (!token) {
            console.error("Token not found. Handle this case.");
            return;
        }

        try {
            request
                .put(
                    `Staff/SendFeedbackReport/${id}`,
                    { feedback },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.message === "feedback_done") {
                        message.success("phản hồi thành công");
                        setLoading(false);
                        onCloseDrawerEdit();
                        handleSearch();
                    } else {
                        message.error("phản hồi thất bại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("phản hồi thất bại!");
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error updating skill: ", error);
            message.error("phản hồi thất bại!");
            setLoading(false);
        }
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Report", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reportData.xlsx");
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
            <h2 style={{ color: "#02AA8A", fontWeight: "500" }}>Bảng quản lý phản hồi khách hàng</h2>
            <span className="fs-6 fw-bold me-2">Sắp xếp theo:</span>
            <Select
                id="orderBy"
                defaultValue="id_desc"
                style={{
                    width: 220,
                    marginRight: 8,
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
                        value: "customer",
                        label: "Khách hàng tăng dần",
                    },
                    {
                        value: "customer_desc",
                        label: "Khách hàng giảm dần",
                    },
                ]}
            />
            <Space direction="vertical" size={12}>
                <RangePicker showTime onChange={handleDateChange} />
            </Space>
            <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                Xuất dữ liệu
            </Button>
            <Tabs defaultActiveKey="" onChange={callbackRole}>
                <TabPane tab="Tất cả" key="">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Chưa xử lý" key="0">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đã xử lý" key="1">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
            </Tabs>
            <Drawer
                title="Phản hồi khách hàng"
                width={600}
                onClose={onCloseDrawerEdit}
                open={openDrawerEdit}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onCloseDrawerEdit}>Hủy bỏ</Button>
                        <Button type="primary" htmlType="submit" form="form-edit" style={{ backgroundColor: "#02AA8A", color: "white" }} disabled={loading}>
                            {loading ? <Spin /> : " Gửi phản hồi"}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="form-edit"
                    layout="vertical"
                    initialValues={{
                        feedback: editRecord?.feedback,
                    }}
                    onFinish={onSubmitEditReport}
                >
                    {useEffect(() => {
                        if (editRecord) {
                            form.setFieldsValue({
                                feedback: editRecord?.feedback,
                            });
                        }
                    }, [editRecord, form])}

                    <div layout="vertical">
                        <div className="row pt-1">
                            <div className="col-6 mb-3">
                                <h6>Tên khách hàng</h6>
                                <p className="text-muted">{editRecord?.customerName}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Email</h6>
                                <p className="text-muted">{editRecord?.customerEmail}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Tên nhân viên</h6>
                                <p className="text-muted">{editRecord?.employeeName}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Trạng thái</h6>
                                <p className="text-muted">{editRecord?.status ? "Đã xử lý" : "Chưa xử lý"}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Thời gian nhận phản hồi</h6>
                                <p className="text-muted">{editRecord?.timestamp ? moment(editRecord?.timestamp).format("YYYY-MM-DD HH:mm:ss") : ""}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Thời gian trả lời phản hồi</h6>
                                <p className="text-muted">{editRecord?.timeFeedback ? moment(editRecord?.timeFeedback).format("YYYY-MM-DD HH:mm:ss ") : ""}</p>
                            </div>
                            <div className="col-12">
                                <h6>Nội dung</h6>
                                <p className="text-muted">{editRecord?.content}</p>
                            </div>
                            <div className="col-12">
                                <h6>Ảnh</h6>
                                <div className="d-flex flex-wrap">
                                    {editRecord?.reportImages.map((image, index) => (
                                        <div className="me-2 mb-2">
                                            <Image
                                                width={255}
                                                key={index}
                                                src={image?.image && isValidImageUrl(image?.image) ? image?.image : images.default_image.default}
                                                style={{ width: "100%" }}
                                            ></Image>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Form.Item
                        label="Phản hồi"
                        name="feedback"
                        style={{
                            marginTop: "20px",
                        }}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập phản hồi cho khách hàng!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Phản hồi không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={editRecord?.feedback || ""}
                            onChange={(event, editor) => {
                                const data = editor?.getData();
                                form.setFieldsValue({ feedback: data });
                            }}
                        />
                    </Form.Item>
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
