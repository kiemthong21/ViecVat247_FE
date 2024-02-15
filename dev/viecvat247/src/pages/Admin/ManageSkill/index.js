import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, Input, Pagination, Popconfirm, Select, Space, Spin, Table, message } from "antd";
import request from "~/utils/request";
import { EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@mui/icons-material";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import useAuthorizationManage from "~/utils/useAuthorizationManage";

const { Option } = Select;
const App = () => {
    useEffect(() => {
        document.title = "Bảng kỹ năng - Viecvat247";
    }, []);
    // Auth
    /*--------------------------------------------------------------------------------------------------------------*/
    const { userManage, isInitialized } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!userManage) {
                navigate("/manage/login");
            }
        }
    }, [isInitialized]);
    useAuthorizationManage("Manager Skill");
    /*--------------------------------------------------------------------------------------------------------------*/

    const columns = [
        {
            title: "Thể loại kỹ năng",
            dataIndex: "skillCategoryName",
            width: "20%",
        },

        {
            title: "Tên kỹ năng",
            dataIndex: "skillName",
            width: "20%",
        },
        {
            title: "Miêu tả",
            dataIndex: "description",
            width: "40%",
        },
        {
            title: "Hành động",
            key: "action",
            width: "20%",
            render: (text, record) => (
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
                        title="Bạn có chắc là muốn xóa kỹ năng này không?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => onSubmitDeleteAccount(record)} // Pass the record to onSubmitDeleteAccount
                    >
                        <Button type="primary" danger ghost icon={<DeleteOutlined />}>
                            Xóa kĩ năng
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const [loading, setLoading] = useState(false);
    const [skillCategories, setSkillCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
    const onChangeCategory = (value) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };
    const handleChangeSort = (value) => {
        setOrderBy(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        handleSearch();
    }, [orderBy, selectedCategory, searchText, currentPage, pageSize]);

    const handleSearch = async () => {
        try {
            const response = await request.get("Staff/Skill/GetAll", {
                params: {
                    searchValue: searchText,
                    cate: selectedCategory,
                    orderBy: orderBy,
                    pageIndex: currentPage,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.skills);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    useEffect(() => {
        request
            .get("SkillCategory/GetAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSkillCategories(response.data.skillsCategory);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy danh sách skill categories từ API: ", error);
            });
    }, []);

    /*----------------------------------------------- */

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
    const [editRecord, setEditRecord] = useState(null);
    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`Staff/Skill/${record.skillId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const skillDetails = response.data;

            setEditRecord(skillDetails);

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

    // Submit Form Create Staff Account
    const onSubmitCreateAccount = (values) => {
        setLoading(true);
        console.log(values);
        const userInfo = {
            skillCategoryId: values.skillCategoryId,
            skillName: values.skillName,
            description: values.description,
        };
        const token = localStorage.getItem("manage-token");
        if (!token) {
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            setLoading(false);
            return;
        }
        const isWhitespaceskillname = /^\s*$/.test(values.skillName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespaceskillname || isWhitespacedescription) {
            message.error(" không được để thông tin chỉ chứa khoảng trắng.");
            setLoading(false);
            return;
        }
        try {
            request
                .post("Staff/Skill/Add", userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "add_successful") {
                        message.success("Tạo kỹ năng thành công");
                        setLoading(false);
                        setOpenDrawerNewAccount(false);
                        handleSearch();
                    } else if (response.data.message === "already_have_skills") {
                        message.error("Kỹ năng đã tồn tại");
                        setLoading(false);
                    } else if (response.data.error === "add_fail") {
                        message.error("Tạo kỹ năng thất bại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("Tạo kỹ năng thất bại!");
                    setLoading(false);
                });
        } catch (error) {
            message.error("Tạo kỹ năng thất bại!");
            setLoading(false);
        }
    };
    const onSubmitEditAccount = (values) => {
        setLoading(true);
        const userInfo = {
            skillCategoryId: values.skillCategoryId,
            skillName: values.skillName,
            description: values.description,
        };
        const skillId = editRecord.skillId;
        const isWhitespaceskillname = /^\s*$/.test(values.skillName);
        const isWhitespacedescription = /^\s*$/.test(values.description);
        if (isWhitespaceskillname || isWhitespacedescription) {
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
                .put(`Staff/Skill/Update/${skillId}`, userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thông tin kỹ năng thành công");
                        setLoading(false);
                        onCloseDrawerEdit();
                        handleSearch();
                    } else if (response.data.message === "already_have_skills") {
                        message.error("Kỹ năng đã tồn tại");
                        setLoading(false);
                    } else {
                        message.error("Cập nhật thông tin kỹ năng thất bại");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    message.error("Cập nhật thông tin kỹ năng thất bại!");
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error updating skill: ", error);
            message.error("Cập nhật thông tin kỹ năng thất bại");
            setLoading(false);
        }
    };

    const onSubmitDeleteAccount = (record) => {
        const { skillId } = record;
        const token = localStorage.getItem("manage-token");
        if (!token) {
            console.error("Token not found. Handle this case.");
            return;
        }

        try {
            request
                .delete(`Staff/Skill/Delete/${skillId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "delete_successful") {
                        message.success("Xóa kỹ năng thành công thành công");
                        const updatedData = data.filter((item) => item.skillId !== skillId);
                        setData(updatedData);
                        if (updatedData.length === 0) {
                            setCurrentPage(1);
                        }
                    } else {
                        message.error("Xóa kỹ năng thất bại");
                    }
                })

                .catch((error) => {
                    console.error("Error calling delete API: ", error);
                    message.error("Xóa kỹ năng thất bại!");
                });
        } catch (error) {
            console.error("Error calling delete API: ", error);
            message.error("Xóa kỹ năng thất bại!");
        }
    };
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Skill", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "skillData.xlsx");
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
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}>Bảng quản lý kĩ năng</h2>
                <Input.Search placeholder="Tìm kiếm tên kĩ năng" allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <span className="fs-6 fw-bold me-2">Danh mục:</span>
                    <Select placeholder="Chọn thể loại kĩ năng" style={{ width: 200, marginRight: 8 }} onChange={onChangeCategory} defaultValue={""}>
                        <Option value={""}>Tất cả thể loại kĩ năng</Option>
                        {skillCategories.map((category, index) => (
                            <Option key={index} value={category.skillCategoryId}>
                                {category.skillCategoryName}
                            </Option>
                        ))}
                    </Select>
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
                                label: "Tên Kỹ năng tăng dần",
                            },
                            {
                                value: "name desc",
                                label: "Tên kỹ năng giảm dần",
                            },
                        ]}
                    />
                    <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                        Xuất dữ liệu
                    </Button>
                </div>
                <Button type="primary" onClick={showDrawerNewAccount} icon={<PlusOutlined />} style={{ backgroundColor: "#02AA8A", marginBottom: 20 }} disabled={loading}>
                    {loading ? <Spin /> : "Tạo kĩ năng mới"}
                </Button>
            </div>

            {/* Drawer New Account */}
            <Drawer
                title="Màn tạo kĩ năng mới"
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
                        <Button onClick={onCloseDrawerNewAccount}>Hủy</Button>
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
                            {loading ? <Spin /> : "Lưu kĩ năng"}
                        </Button>
                    </Space>
                }
            >
                <Form name="form-create" layout="vertical" onFinish={onSubmitCreateAccount}>
                    <div className="row">
                        {/* skillName */}
                        <Form.Item
                            label="Tên kĩ năng"
                            name="skillName"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập tên kĩ năng trước khi lưu lại!",
                                },
                                {
                                    pattern: /^\S(?:.*\S)?\s?$/,
                                    message: "Tên kỹ năng không thể để khoảng trắng đầu cuối!",
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Nhập kĩ năng" />
                        </Form.Item>
                    </div>
                    {/* skillCategoryId */}
                    <Form.Item
                        name="skillCategoryId"
                        label="Thể loại kĩ năng"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy chọn thể loại kĩ năng trước khi lưu lại!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn thể loại kĩ năng">
                            {skillCategories.map((skillCategory) => (
                                <Option key={skillCategory.skillCategoryId} value={skillCategory.skillCategoryId}>
                                    {skillCategory.skillCategoryName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập Miêu tả trước khi lưu lại!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Phần miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập phần mô tả của kĩ năng" />
                    </Form.Item>
                </Form>
            </Drawer>
            {/* Drawer Edit Account */}
            <Drawer
                title="Màn chỉnh sửa kỹ năng"
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
                        <Button onClick={onCloseDrawerEdit}>Hủy</Button>
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
                        skillCategoryId: editRecord?.skillCategoryId,
                        skillCategoryName: editRecord?.skillCategoryName,
                        skillName: editRecord?.skillName,
                        status: editRecord?.status,
                        description: editRecord?.description,
                    }}
                    onFinish={onSubmitEditAccount}
                >
                    {/* useEffect để cập nhật initialValues */}
                    {useEffect(() => {
                        if (editRecord) {
                            form.setFieldsValue({
                                skillCategoryId: editRecord.skillCategoryId,
                                skillCategoryName: editRecord.skillCategoryName,
                                skillName: editRecord.skillName,
                                status: editRecord.status,
                                description: editRecord.description,
                            });
                        }
                    }, [editRecord, form])}
                    {/* skillName */}
                    <Form.Item
                        name="skillName"
                        label="Tên kỹ năng"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên kỹ năng trước khi lưu lại!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên kỹ năng không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên kỹ năng" />
                    </Form.Item>
                    {/* skill Category Name */}
                    <Form.Item
                        name="skillCategoryId"
                        label="Thể loại kỹ năng"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy chọn thể loại kỹ năng trước khi lưu lại!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn thể loại kỹ năng">
                            {skillCategories.map((skillCategory) => (
                                <Option key={skillCategory.skillCategoryId} value={skillCategory.skillCategoryId}>
                                    {skillCategory.skillCategoryName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label="Miêu tả"
                        name="description"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập miêu tả trước khi lưu lại!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Miêu tả không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả của kỹ năng" />
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
