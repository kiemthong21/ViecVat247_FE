import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, Input, Pagination, Popconfirm, Select, Space, Spin, Table, message } from "antd";
import request from "~/utils/request";
import { EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { DeleteOutline } from "@mui/icons-material";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import useAuthorizationManage from "~/utils/useAuthorizationManage";

const App = () => {
    useEffect(() => {
        document.title = "Bảng thể loại kỹ năng - Viecvat247";
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
    useAuthorizationManage("Manager SkillCategory");
    const columns = [
        {
            title: "Thể loại kỹ năng",
            dataIndex: "skillCategoryName",
            width: "25%",
        },
        {
            title: "Miêu tả",
            dataIndex: "description",
            width: "65%",
        },
        {
            title: "Hành động",
            key: "action",
            width: "10%",
            render: (record) => (
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
                    <Popconfirm
                        title="Bạn có chắc là muốn xóa nó không?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => onSubmitDeleteCategorySkill(record)} // Pass the record to onSubmitDeleteAccount
                    >
                        <Button type="primary" danger ghost icon={<DeleteOutline />}>
                            Xóa
                        </Button>
                    </Popconfirm>
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
            const response = await request.get("Staff/SkillCategory/GetAll", {
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
            setData(response.data.skillsCategory);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    /*--------------------------------------------------------------------- */
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const token = localStorage.getItem("manage-token");
    // Drawer New Account
    const [openDrawerNewAccount, setOpenDrawerNewAccount] = useState(false);
    const showDrawerNewAccount = () => {
        setOpenDrawerNewAccount(true);
    };
    const onCloseDrawerNewAccount = () => {
        setOpenDrawerNewAccount(false);
    };

    // Drawer Edit
    const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
    const [editRecord, setEditRecord] = useState(null); // To store the record being edited
    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`Staff/SkillCategory/${record.skillCategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const skillCategoryDetails = response.data;
            setEditRecord(skillCategoryDetails);

            setOpenDrawerEdit(true);
        } catch (error) {
            console.error("Error fetching skill details: ", error);
            message.error("Failed to fetch skill details");
        }
    };
    const onCloseDrawerEdit = () => {
        setOpenDrawerEdit(false);
    };

    const onSubmitCreateAccount = (values) => {
        setLoading(true);
        console.log(values);
        const userInfo = {
            skillCategoryName: values.skillCategoryName,
            description: values.description,
        };
        const isWhitespaceskillCategoryName = /^\s*$/.test(values.skillCategoryName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespaceskillCategoryName || isWhitespacedescription) {
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
                .post("Staff/SkillCategory/Add", userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "add_successful") {
                        message.success("Tạo thể loại kỹ năng thành công");
                        setLoading(false);
                        setOpenDrawerNewAccount(false);
                        handleSearch();
                    } else if (response.data.message === "already_have_skillCategory") {
                        message.error("Thể loại kỹ năng đã tồn tại");
                        setLoading(false);
                    } else if (response.data.message === "add_fail") {
                        message.error("Cập nhật thông tin thể loại kỹ năng thất bại");
                        setLoading(false);
                    } else {
                        message.error("Cập nhật thông tin thể loại kỹ năng thất bại");
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

    // Submit Form Edit Staff Account
    const onSubmitEditAccount = (values) => {
        setLoading(true);
        const userInfo = {
            skillCategoryName: values.skillCategoryName,
            description: values.description,
        };
        const skillCategoryId = editRecord.skillCategoryId; // Lấy skillCategoryId từ editRecord
        const isWhitespaceskillCategoryName = /^\s*$/.test(values.skillCategoryName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespaceskillCategoryName || isWhitespacedescription) {
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
                .put(`Staff/SkillCategory/Update/${skillCategoryId}`, userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thông tin thể loại kỹ năng thành công");
                        setLoading(false);
                        onCloseDrawerEdit();
                        handleSearch();
                    } else if (response.data.message === "already_have_skillcatgory") {
                        message.error("Thể loại kỹ năng đã tồn tại");
                        setLoading(false);
                    } else if (response.data.message === "update_fail") {
                        message.error("Cập nhật thông tin thể loại kỹ năng thất bại");
                        setLoading(false);
                    } else {
                        message.error("Cập nhật thông tin thể loại kỹ năng thất bại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error("Error updating skill: ", error);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error updating skill: ", error);
            message.error("Cập nhật thông tin thể loại kỹ năng thất bại");
            setLoading(false);
        }
    };
    const onSubmitDeleteCategorySkill = (record) => {
        const { skillCategoryId } = record;
        const token = localStorage.getItem("manage-token");

        if (!token) {
            console.error("Token not found. Handle this case.");
            return;
        }

        try {
            request
                .delete(`Staff/SkillCategory/Delete/${skillCategoryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "delete_successful") {
                        message.success("Xóa thành công");
                        const updatedData = data.filter((item) => item.skillCategoryId !== skillCategoryId);
                        setData(updatedData);
                        if (updatedData.length === 0) {
                            setCurrentPage(1);
                        }
                    } else {
                        message.error("xóa thể loại kỹ năng thất bại");
                    }
                })
                .catch((error) => {
                    console.error("Error calling delete API: ", error);
                    message.error("xóa thể loại kỹ năng thất bại!");
                });
        } catch (error) {
            console.error("Error calling delete API: ", error);
            message.error("xóa thể loại kỹ năng thất bại!");
        }
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/SkillCategory", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "skillCategoryData.xlsx");
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
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}>Bảng quản lý thể loại kỹ năng</h2>
                <Input.Search placeholder="tìm kiếm tên thể loại" allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
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
                    Tạo mới thể loại kỹ năng
                </Button>
            </div>

            {/* Drawer New Account */}
            <Drawer
                title="Tạo mới thể loại kỹ năng"
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
                    {/*  Ename */}
                    <Form.Item
                        label="Thể loại kỹ năng"
                        name="skillCategoryName"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên thể loại kỹ năng!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên thể loại kỹ năng không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên thể loại kỹ năng" />
                    </Form.Item>
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập mô tả thể loại kỹ năng!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea type="text" placeholder="Nhập miêu tả kỹ năng" />
                    </Form.Item>
                </Form>
            </Drawer>
            {/* Drawer Edit Account */}
            <Drawer
                title="Chỉnh sửa thể loại kỹ năng"
                width={720}
                onClose={onCloseDrawerEdit}
                open={openDrawerEdit}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                /* Rest of your Drawer setup */
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
                            {loading ? <Spin /> : "Lưu chỉnh sửa"}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="form-edit"
                    layout="vertical"
                    initialValues={{
                        skillCategoryName: editRecord?.skillCategoryName,
                        description: editRecord?.description,
                    }}
                    onFinish={onSubmitEditAccount}
                >
                    {/* useEffect để cập nhật initialValues */}
                    {useEffect(() => {
                        if (editRecord) {
                            form.setFieldsValue({
                                skillCategoryName: editRecord.skillCategoryName,
                                description: editRecord.description,
                            });
                        }
                    }, [editRecord, form])}

                    {/* skill Category Name */}
                    <Form.Item
                        name="skillCategoryName"
                        label="Tên thể loại kỹ năng"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên thể loại kỹ năng!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên thể loại kỹ năng không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên thể loại kỹ năng" />
                    </Form.Item>
                    {/* Description */}
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập miêu tả kỹ năng!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập miêu tả kỹ năng" />
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
