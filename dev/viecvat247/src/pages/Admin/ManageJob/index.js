import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Table, message, Drawer, Pagination, Space, Tabs, Select, Spin } from "antd";
import request from "~/utils/request";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import TabPane from "antd/es/tabs/TabPane";
import useAuthorizationManage from "~/utils/useAuthorizationManage";
import { ExportOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const App = () => {
    useEffect(() => {
        document.title = "Bảng công việc - Viecvat247";
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
    useAuthorizationManage("Manager Job");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedJobInfo, setSelectedJobInfo] = useState({
        jobAssignerName: "",
        jobCategoryName: "",
        title: "",
        image: "",
        job_Overview: "",
        required_Skills: "",
        preferred_Skills: "",
        noticeToJobSeeker: "",
        location: "",
        address: "",
        startDate: "",
        endDate: "",
        workingTime: "",
        money: "",
        numberPerson: "",
        typeJobs: "",
    });
    // Trước khi đưa vào state, định dạng lại startDate và endDate từ response API hoặc dữ liệu
    const formattedStartDate = moment(selectedJobInfo.startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(selectedJobInfo.endDate).format("YYYY-MM-DD");
    const [form] = Form.useForm();
    const validStatusOptions = ["1", "2"];
    const showModal = (job) => {
        setSelectedJob(job);
        setIsDrawerOpen(true);
        setSelectedJobInfo({
            jobAssignerName: job.jobAssignerName,
            jobCategoryName: job.jobCategoryName,
            title: job.title,
            image: job.image,
            job_Overview: job.job_Overview,
            required_Skills: job.required_Skills,
            preferred_Skills: job.preferred_Skills,
            noticeToJobSeeker: job.noticeToJobSeeker,
            location: job.location,
            address: job.address,
            startDate: job.startDate,
            endDate: job.endDate,
            workingTime: job.workingTime,
            money: job.money,
            numberPerson: job.numberPerson,
            typeJobs: job.typeJobs,
        });
        if (validStatusOptions.includes(job.status.toString())) {
            form.setFieldsValue({ status: job.status.toString(), note: job.note });
        } else {
            form.setFieldsValue({ status: "", note: job.note });
        }
    };

    const handleCancel = () => {
        setIsDrawerOpen(false);
    };
    const [loading, setLoading] = useState(false);
    const onFinishReject = (e) => {
        setLoading(true);
        const updatedJob = {
            status: 3,
            note: e.note,
        };
        console.log(updatedJob.status);
        console.log(updatedJob);
        const token = localStorage.getItem("manage-token");
        const jobId = selectedJob ? selectedJob.jobsId : null;
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }

        try {
            request
                .post(`Staff/Censorship/${jobId}`, updatedJob, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "check_mail") {
                        message.success("Cập nhật trạng thái thành công");
                        setLoading(false);
                        const updatedData = data.map((job) => {
                            if (job.jobsId === jobId) {
                                return {
                                    ...job,
                                    status: 3,
                                    note: updatedJob.note,
                                };
                            }
                            return job;
                        });
                        closeStatusTow(false);
                        setSelectedJob(null);
                        form.resetFields();
                        setData(updatedData);
                        setIsDrawerOpen(false);
                        handleSearch();
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!!!!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
            setLoading(false);
        }
    };
    const onFinishPending = (e) => {
        setLoading(true);
        console.log(e);
        const updatedJob = {
            status: 2,
            note: e.note,
        };
        console.log(updatedJob.status);
        console.log(updatedJob);
        const token = localStorage.getItem("manage-token");
        const jobId = selectedJob ? selectedJob.jobsId : null;
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }

        try {
            request
                .post(`Staff/Censorship/${jobId}`, updatedJob, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "check_mail") {
                        message.success("Cập nhật trạng thái thành công");
                        setLoading(false);
                        const updatedData = data.map((job) => {
                            if (job.jobsId === jobId) {
                                return {
                                    ...job,
                                    status: 2,
                                    note: updatedJob.note,
                                };
                            }
                            return job;
                        });
                        closeStatus(false);
                        setSelectedJob(null);
                        form.resetFields();
                        setData(updatedData);
                        setIsDrawerOpen(false);
                        handleSearch();
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!!!!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
            setLoading(false);
        }
    };
    const onFinishAprrove = (e) => {
        setLoading(true);
        console.log(e);
        const updatedJob = {
            status: 1,
            note: e.note,
        };
        console.log(updatedJob.status);
        console.log(updatedJob);
        const token = localStorage.getItem("manage-token");
        const jobId = selectedJob ? selectedJob.jobsId : null;
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }

        try {
            request
                .post(`Staff/Censorship/${jobId}`, updatedJob, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "check_mail") {
                        message.success("Cập nhật trạng thái thành công");
                        setLoading(false);
                        const updatedData = data.map((job) => {
                            if (job.jobsId === jobId) {
                                return {
                                    ...job,
                                    status: 1,
                                    note: updatedJob.note,
                                };
                            }
                            return job;
                        });
                        closeStatus(false);
                        setSelectedJob(null);
                        form.resetFields();
                        setData(updatedData);
                        setIsDrawerOpen(false);
                        handleSearch();
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!!!!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
            setLoading(false);
        }
    };
    const columns = [
        {
            title: "Người giao việc",
            dataIndex: "jobAssignerName",
            width: "10%",
        },
        {
            title: "Loại công việc",
            dataIndex: "jobCategoryName",
            width: "15%",
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            width: "20%",
        },
        {
            title: "Hình thức",
            dataIndex: "typeJobs",
            width: "10%",
        },
        {
            title: "Số người",
            dataIndex: "numberPerson",
            width: "5%",
        },
        {
            title: "Số tiền",
            dataIndex: "money",
            width: "10%",
            render: (money) => (money ? money.toLocaleString() + " VNĐ" : "N/A"),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            width: "10%",
            render: (_, record) => <Space size="middle">{record?.startDate ? moment(record?.startDate).format("YYYY-MM-DD") : ""}</Space>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (text, record) => {
                let transactionTypeText = "";
                switch (record?.status) {
                    case 0:
                        transactionTypeText = "Đang chờ duyệt";
                        break;
                    case 1:
                        transactionTypeText = "Đã được nhận";
                        break;
                    case 2:
                        transactionTypeText = "Đang chờ chỉnh sửa";
                        break;
                    case 3:
                        transactionTypeText = "Bị từ chối";
                        break;
                    case 4:
                        transactionTypeText = "Đã hoàn thành";
                        break;
                    case 6:
                        transactionTypeText = "Đã đóng";
                        break;
                    default:
                        transactionTypeText = "Nháp";
                        break;
                }
                return <span>{transactionTypeText}</span>;
            },
        },
        {
            title: "Hành động",
            width: "10%",
            align: "right",
            render: (status, record) => {
                return (
                    <Button style={{ backgroundColor: "#02AA8A", color: "white" }} onClick={() => showModal(record)}>
                        Xem chi tiết
                    </Button>
                );
            },
        },
    ];
    const [data, setData] = useState([]);
    const token = localStorage.getItem("manage-token");
    const [status, setStatus] = useState(0);
    const [searchText, setSearchText] = useState(null);
    const [typeJobs, setTypeJobs] = useState([]);
    const [totalItem, setTotalItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
    const onChangeTypeJob = (value) => {
        setTypeJobs(value);
        setCurrentPage(1);
    };
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, typeJobs, status, searchText, currentPage, pageSize]);

    const handleSearch = async () => {
        try {
            const response = await request.get("Staff/ListAllJobs", {
                params: {
                    searchValue: searchText,
                    orderBy: orderBy,
                    status: status,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                    typeJob: typeJobs,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.jobs);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Đang chờ duyệt";
            case 1:
                return "Đã được nhận";
            case 2:
                return "Đang chờ chỉnh sửa";
            case 3:
                return "Bị từ chối";
            case 4:
                return "Đã xong";
            case 6:
                return "Đã đóng";
            default:
                return "Unknown";
        }
    };
    const [statusOpen, setStatusOpen] = useState(false);

    const openStatus = () => {
        setStatusOpen(true);
    };

    const closeStatus = () => {
        setStatusOpen(false);
    };
    const [statusOpentow, setStatusOpenTwo] = useState(false);

    const openStatusTow = () => {
        setStatusOpenTwo(true);
    };

    const closeStatusTow = () => {
        setStatusOpenTwo(false);
    };
    const callbackStatus = (key) => {
        setStatus(key);
        setCurrentPage(1);
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Job", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "jobsData.xlsx");
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
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}>Bảng quản lý công việc</h2>
                <Input.Search placeholder="Tìm kiếm..." allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
            </div>
            <span className="fs-6 fw-bold me-2">Hình thức:</span>
            <Select
                placeholder="Lựa chọn hình thức"
                onChange={onChangeTypeJob}
                style={{
                    width: "150px",
                    marginRight: 8,
                }}
                defaultValue=""
                options={[
                    {
                        value: "",
                        label: "Tất cả hình thức",
                    },
                    {
                        value: "ONLINE",
                        label: "Trực tuyến",
                    },
                    {
                        value: "OFFLINE",
                        label: "Trực tiếp",
                    },
                ]}
            />
            <span className="fs-6 fw-bold me-2">Sắp xếp theo:</span>
            <Select
                id="orderBy"
                defaultValue="id desc"
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
                        value: "id desc",
                        label: "Thứ tự giảm dần",
                    },
                    {
                        value: "title",
                        label: "tiêu đề tăng dần",
                    },
                    {
                        value: "title desc",
                        label: "Tiêu đề giảm dần giảm dần",
                    },
                    {
                        value: "address",
                        label: "Nơi ở tăng dần",
                    },
                    {
                        value: "address desc",
                        label: "Nơi ở  giảm dần",
                    },
                ]}
            />
            <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                Xuất dữ liệu
            </Button>
            <Tabs defaultActiveKey="0" onChange={callbackStatus}>
                <TabPane tab="Tất cả" key="">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đang chờ duyệt" key="0">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đã được nhận" key="1">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đang chờ chỉnh sửa" key="2">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đã đóng" key="6">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Bị từ chối" key="3">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
                <TabPane tab="Đã xong" key="4">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </TabPane>
            </Tabs>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItem}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={onPageChange}
                onShowSizeChange={onShowSizeChange}
                style={{ textAlign: "right", marginTop: "1em" }}
            />
            <Drawer
                title={`Chỉnh sửa trạng thái: ${selectedJob ? getStatusText(selectedJob.status) : ""}`}
                placement="right"
                closable={true}
                onClose={handleCancel}
                open={isDrawerOpen}
                width={1000}
                extra={
                    <Space>
                        {selectedJob && ![3, 4, 6].includes(selectedJob.status) && (
                            <div
                                buttonStyle="solid"
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                }}
                            >
                                {selectedJob && ![1, 2].includes(selectedJob.status) && (
                                    <Button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        ghost
                                        htmlType="submit"
                                        form="Approve"
                                        style={{
                                            height: "38px",
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <Spin /> : "Duyệt bài"}
                                    </Button>
                                )}
                                {selectedJob && ![2].includes(selectedJob.status) && (
                                    <button type="button" className="btn btn-outline-primary" onClick={openStatus}>
                                        Yêu cầu chỉnh sửa bài viết
                                    </button>
                                )}
                                <button type="button" className="btn btn-outline-primary" ghost onClick={openStatusTow}>
                                    Từ chối
                                </button>
                            </div>
                        )}
                        <Form name="Approve" onFinish={onFinishAprrove} layout="vertical">
                            <Form.Item name="note"></Form.Item>
                        </Form>
                        <Modal title="Bảng đang chờ chỉnh sửa" open={statusOpen} footer={null} onCancel={closeStatus}>
                            <Form onFinish={onFinishPending} layout="vertical">
                                <Form.Item
                                    label="Ghi chú"
                                    name="note"
                                    id="note"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Hãy nhập ghi chú!",
                                        },
                                        {
                                            pattern: /^\S(?:.*\S)?\s?$/,
                                            message: "Ghi chú không thể để khoảng trắng đầu cuối!",
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "#02AA8A", color: "white" }} disabled={loading}>
                                        {loading ? <Spin /> : "Lưu"}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Modal title="Bảng từ chối" open={statusOpentow} footer={null} onCancel={closeStatusTow}>
                            <Form onFinish={onFinishReject} layout="vertical">
                                <Form.Item
                                    label="Ghi chú"
                                    name="note"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Hãy nhập ghi chú!",
                                        },
                                        {
                                            pattern: /^\S(?:.*\S)?\s?$/,
                                            message: "Ghi chú không thể để khoảng trắng đầu cuối!",
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "#02AA8A", color: "white" }} disabled={loading}>
                                        {loading ? <Spin /> : "Lưu"}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Space>
                }
            >
                <div layout="vertical">
                    <div className="row pt-1">
                        <div className="col-6 mb-3">
                            <h6>Người giao việc</h6>
                            <p className="text-muted">{selectedJobInfo.jobAssignerName}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Loại công việc</h6>
                            <p className="text-muted">{selectedJobInfo.jobCategoryName}</p>
                        </div>
                        <div className="col-12">
                            <h6>Tiêu đề</h6>
                            <p className="text-muted">{selectedJobInfo.title}</p>
                        </div>
                        <div className="col-12">
                            <h6>Tổng quan về công việc</h6>
                            <p className="text-muted"> {selectedJobInfo.job_Overview}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Kỹ năng cần thiết</h6>
                            <p className="text-muted"> {selectedJobInfo.required_Skills}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Kỹ năng ưa thích</h6>
                            <p className="text-muted"> {selectedJobInfo.preferred_Skills}</p>
                        </div>
                        <div className="col-12">
                            <h6>Thông báo cho người tìm việc</h6>
                            <p className="text-muted"> {selectedJobInfo.noticeToJobSeeker}</p>
                        </div>
                        <div className="col-12">
                            <h6>Địa chỉ</h6>
                            <p className="text-muted"> {selectedJobInfo.address}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Ngày bắt đầu</h6>
                            <p className="text-muted"> {formattedStartDate}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Ngày kết thúc</h6>
                            <p className="text-muted"> {formattedEndDate}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Thời gian làm việc</h6>
                            <p className="text-muted"> {selectedJobInfo.workingTime}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Số tiền khi hoàn thành</h6>
                            <p className="text-muted"> {selectedJobInfo.money?.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Số người</h6>
                            <p className="text-muted"> {selectedJobInfo.numberPerson}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6>Loại công việc</h6>
                            <p className="text-muted"> {selectedJobInfo.typeJobs}</p>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default App;
