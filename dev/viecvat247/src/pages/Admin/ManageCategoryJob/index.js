import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, Input, Pagination, Popconfirm, Select, Space, Spin, Table, message } from "antd";
import request from "~/utils/request";
import { EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import useAuthorizationManage from "~/utils/useAuthorizationManage";

const App = () => {
    useEffect(() => {
        document.title = "Bảng thể loại công việc - Viecvat247";
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
    const token = localStorage.getItem("manage-token");
    useAuthorizationManage("Manager JobCategory");
    const changeStatus = async (jobCategoryId, action) => {
        try {
            let url = "";
            if (action === "active") {
                url = `Staff/JobsCategory/Active/${jobCategoryId}`;
            } else if (action === "inactive") {
                url = `Staff/JobsCategory/Inactive/${jobCategoryId}`;
            }
            const response = await request.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.message === "active_successful") {
                message.success(`Thể loại công việc ${action === "active" ? "Hoạt động" : "không hoạt động"} thành công`);
                handleSearch();
            } else if (response.data.message === "Inactive_successful") {
                message.success(`Thể loại công việc ${action === "inactive" ? "Không hoạt động" : "Hoạt động"} thành công`);
                handleSearch();
            } else {
                message.error(`Failed to ${action === "active" ? "Hoạt động" : "không hoạt động"} Thể loại công việc`);
            }
        } catch (error) {
            console.error(`Error while changing status: ${error}`);
            message.error(`Failed to ${action === "active" ? "Hoạt động" : "không hoạt động"} Thể loại công việc`);
        }
    };

    const columns = [
        {
            title: "Thể loại công việc",
            dataIndex: "jobCategoryName",
            width: "20%",
        },
        {
            title: "Miêu tả",
            dataIndex: "description",
            width: "60%",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: "8%",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 1 ? (
                        <Popconfirm title="Bạn có chắc là muốn tắt trạng thái này không?" okText="Có" cancelText="Không" onConfirm={() => changeStatus(record.jobCategoryId, "inactive")}>
                            <Button
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
                        <Popconfirm title="Bạn có chắc là muốn mở trạng thái này không?" okText="Có" cancelText="Không" onConfirm={() => changeStatus(record.jobCategoryId, "active")}>
                            <Button danger ghost>
                                Không hoạt động
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },

        {
            title: "Hành động",
            key: "action",
            width: "10%",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => showDrawerEdit(record)} // Pass the record to showDrawerEdit
                        ghost
                        icon={<EditOutlined />}
                        style={{
                            color: "#02AA8A",
                            border: "2px solid #02AA8A",
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                </Space>
            ),
        },
    ];
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(null);
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
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, searchText, currentPage, pageSize]);

    const handleSearch = async () => {
        try {
            const response = await request.get("Staff/JobsCategory/GetAll", {
                params: {
                    searchValue: searchText,
                    cate: null,
                    orderBy: orderBy,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.jobsCategory);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    /*--------------------------------------------------------------------------------------------------------------*/

    const [data, setData] = useState([]);
    const [openDrawerNewAccount, setOpenDrawerNewAccount] = useState(false);

    const showDrawerNewAccount = () => {
        setOpenDrawerNewAccount(true);
    };
    const onCloseDrawerNewAccount = () => {
        setOpenDrawerNewAccount(false);
    };

    // Drawer Edit
    const [form] = Form.useForm();
    const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`Staff/JobsCategory/${record.jobCategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const jobDetails = response.data;
            setEditRecord(jobDetails);

            setOpenDrawerEdit(true);
        } catch (error) {
            console.error("Error fetching job details: ", error);
            message.error("Failed to fetch job details");
        }
    };
    const onCloseDrawerEdit = () => {
        setOpenDrawerEdit(false);
    };

    const onSubmitCreateAccount = (values) => {
        setLoading(true);
        console.log(values);
        const userInfo = {
            jobCategoryName: values.jobCategoryName,
            description: values.description,
        };
        const isWhitespacejobCategoryName = /^\s*$/.test(values.jobCategoryName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespacejobCategoryName || isWhitespacedescription) {
            message.error(" không được để thông tin chỉ chứa khoảng trắng.");
            setLoading(false);
            return;
        }
        const token = localStorage.getItem("manage-token");
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }
        try {
            request
                .post("Staff/JobsCategory/Add", userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "add_successful") {
                        message.success("Tạo thể loại công việc thành công");
                        setLoading(false);
                        setOpenDrawerNewAccount(false);
                        handleSearch();
                    } else if (response.data.message === "already_have_jobcategory") {
                        message.error("Thể loại công việc đã tồn tại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
            setLoading(false);
        }
    };

    const onSubmitEditAccount = (values) => {
        setLoading(true);
        const userInfo = {
            jobCategoryName: values.jobCategoryName,
            description: values.description,
        };
        const jobCategoryId = editRecord.jobCategoryId;
        const isWhitespacejobCategoryName = /^\s*$/.test(values.jobCategoryName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespacejobCategoryName || isWhitespacedescription) {
            message.error(" không được để thông tin chỉ chứa khoảng trắng.");
            setLoading(false);
            return;
        }
        if (!token) {
            console.error("Token not found. Handle this case.");
            setLoading(false);
            return;
        }

        try {
            request
                .put(`Staff/JobsCategory/Update/${jobCategoryId}`, userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thông tin kỹ năng thành công");
                        setLoading(false);
                        const updatedData = data.map((item) => {
                            if (item.jobCategoryId === jobCategoryId) {
                                return {
                                    ...item,
                                    jobCategoryName: values.jobCategoryName,
                                    description: values.description,
                                };
                            }
                            return item;
                        });
                        setData(updatedData);
                        onCloseDrawerEdit();
                        handleSearch();
                    } else if (response.data.message === "already_have_jobcategory") {
                        message.error("Thể loại công việc đã tồn tại");
                        setLoading(false);
                    } else {
                        message.error("Cập nhật thông tin kỹ năng thất bại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("Hệ thống quá tải hoặc đã có lỗi gì đó xảy ra!");
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error updating job: ", error);
            message.error("Có lỗi xảy ra khi cập nhật thông tin kỹ năng");
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

            const exportResponse = await request.get("ExportData/JobsCategories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "jobsCategoriesData.xlsx");
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
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}>Bảng quản lý thể loại công việc</h2>
                <Input.Search placeholder="Tìm kiếm..." allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ marginBottom: 20 }}>
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
                                value: "name",
                                label: "Tên thể loại Kỹ năng tăng dần",
                            },
                            {
                                value: "name desc",
                                label: "Tên thể loại kỹ năng giảm dần",
                            },
                        ]}
                    />
                    <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                        Xuất dữ liệu
                    </Button>
                </div>
                <Button type="primary" onClick={showDrawerNewAccount} icon={<PlusOutlined />} style={{ backgroundColor: "#02AA8A" }}>
                    Tạo mới
                </Button>
            </div>
            {/* Drawer New Account */}
            <Drawer
                title="Tạo mới thể loại công việc"
                width={720}
                onClose={onCloseDrawerNewAccount}
                open={openDrawerNewAccount}
                styles={{
                    body: {
                        marginRight: 8,
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onCloseDrawerNewAccount}>Hủy bỏ</Button>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#02AA8A",
                                color: "white",
                            }}
                            htmlType="submit"
                            form="form-create"
                            disabled={loading}
                        >
                            {loading ? <Spin /> : "Tạo mới"}
                        </Button>
                    </Space>
                }
            >
                <Form name="form-create" layout="vertical" onFinish={onSubmitCreateAccount}>
                    {/*  Job Category Name */}
                    <Form.Item
                        label="Tên thể loại công việc"
                        name="jobCategoryName"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên thể loại công việc!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên thể loại công việc không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên thể loại công việc" />
                    </Form.Item>

                    {/* description */}
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập miêu tả thể loại công việc!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập miêu tả thể loại công việc" />
                    </Form.Item>
                </Form>
            </Drawer>
            {/* Drawer Edit Account */}
            <Drawer
                title="Chỉnh sửa thể loại công việc"
                width={720}
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
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#02AA8A",
                                color: "white",
                            }}
                            htmlType="submit"
                            form="form-edit"
                            disabled={loading}
                        >
                            {loading ? <Spin /> : "Lưu thay đổi"}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="form-edit"
                    layout="vertical"
                    initialValues={{
                        jobCategoryName: editRecord?.jobCategoryName,
                        description: editRecord?.description,
                    }}
                    onFinish={onSubmitEditAccount}
                >
                    {/* useEffect để cập nhật initialValues */}
                    {useEffect(() => {
                        if (editRecord) {
                            form.setFieldsValue({
                                jobCategoryName: editRecord?.jobCategoryName,
                                description: editRecord?.description,
                            });
                        }
                    }, [editRecord, form])}
                    {/* jobName */}
                    <Form.Item
                        label="Tên thể loại công việc"
                        name="jobCategoryName"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên thể loại công việc!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên thể loại công việc không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên thể loại công việc" />
                    </Form.Item>
                    {/* Description */}
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập miêu tả thể loại công việc!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập miêu tả thể loại công việc" />
                    </Form.Item>
                </Form>
            </Drawer>
            <Table columns={columns} dataSource={data} pagination={false} />
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
