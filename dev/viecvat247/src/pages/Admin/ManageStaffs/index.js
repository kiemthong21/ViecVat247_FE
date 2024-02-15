import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Pagination, Select, Space, Table, message, TreeSelect, Avatar, DatePicker, Popconfirm, Spin } from "antd";
import request from "~/utils/request";
import { AppstoreAddOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuthorizationManage from "~/utils/useAuthorizationManage";
import images from "~/assets/images";
const { SHOW_PARENT } = TreeSelect;
const App = () => {
    useEffect(() => {
        document.title = "Bảng nhân viên - Viecvat247";
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
    useAuthorizationManage("Manager Staff");
    const [data, setData] = useState([]);
    const token = localStorage.getItem("manage-token");
    const { Option } = Select;
    const [form] = Form.useForm();

    const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const handleChangePassword = async (record) => {
        try {
            const response = await request.post(`Admin/ResetPassword/${record.uid}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "reset_successful") {
                message.success("Đổi mật khẩu nhân viên thành công, hãy kiểm tra email!");
            } else {
                message.error("Đổi mật khẩu nhân viên thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu nhân viên: ", error);
            message.error("Hệ thống quá tải hoặc đã có lỗi xảy ra khi đổi mật khẩu nhân viên");
        }
    };
    const showDrawerEdit = async (record) => {
        try {
            const response = await request.get(`Admin/GetStaff/${record.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const staff = response.data;
            console.log(staff);
            setEditRecord(staff);

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
            title: "Email",
            dataIndex: "uemail",
            width: "18%",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            width: "14%",
        },
        {
            title: "Nơi ở",
            dataIndex: "address",
            width: "18%",
        },
        {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            width: "18%",
        },
        {
            title: "Ảnh",
            dataIndex: "avatar",
            width: "10%",
            render: (_, record) => (
                <Avatar
                    src={record?.avatar && isValidImageUrl(record?.avatar) ? record?.avatar : images.avatar.default}
                    size={{ xs: 14, sm: 12, md: 20, lg: 44, xl: 60, xxl: 50 }}
                    className="me-2"
                ></Avatar>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: "10%",
            render: (_, record) => <Space size="middle">{record.status === 0 ? <p>Không hoạt động</p> : <p>Hoạt động</p>}</Space>,
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
                        ghost
                        onClick={() => showDrawerEdit(record)}
                        icon={<AppstoreAddOutlined />}
                    >
                        Quản lý
                    </Button>
                    <Popconfirm title="Bạn có chắc là muốn đặt lại mật khẩu nhân viên này không?" okText="Có" cancelText="Không" onConfirm={() => handleChangePassword(record)}>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#02AA8A",
                                border: "2px solid #02AA8A",
                                color: "white",
                            }}
                        >
                            Đặt lại mật khẩu nhân viên
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
            const response = await request.get("Admin/GetStaffs", {
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
            const updatedStaffData = response.data.staff.map((staff) => {
                const typeManagerId = staff.typeManagerId;
                const correspondingTypeManager = typeManagerData.find((manager) => manager.typeManagerId === typeManagerId);
                if (correspondingTypeManager) {
                    return {
                        ...staff,
                        typeManagerName: correspondingTypeManager.typeManagerName,
                    };
                }

                return staff;
            });

            // Cập nhật data với thông tin typeManagerName
            setData(updatedStaffData);
            setTotalItem(response.data.totalItems);
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    /*--------------------------------------------------------------------------------------------------------------*/

    const [openDrawerNewAccount, setOpenDrawerNewAccount] = useState(false);
    const showDrawerNewAccount = () => {
        setOpenDrawerNewAccount(true);
    };
    const onCloseDrawerNewAccount = () => {
        setOpenDrawerNewAccount(false);
    };
    const onSubmitCreateAccount = (values) => {
        setLoading(true);
        console.log(values);
        const userInfo = {
            uemail: values.uemail,
            fullName: values.fullname,
            phoneNumber: values.phoneNumber,
            address: values.address,
            dob: values.dob,
            gender: values.gender === "male" ? true : false,
        };
        const isWhitespaceemail = /^\s*$/.test(values.uemail);
        const isWhitespacephoneNumber = /^\s*$/.test(values.phoneNumber);
        const isWhitespacefullname = /^\s*$/.test(values.fullname);
        const isWhitespaceaddress = /^\s*$/.test(values.address);
        if (isWhitespacephoneNumber || isWhitespaceemail || isWhitespacefullname || isWhitespaceaddress) {
            message.error("không được để thông tin chỉ chứa khoảng trắng");
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
                .post("Admin/AddNewStaff", userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "add_successful") {
                        message.success("Tạo tài khoản thành công");
                        setLoading(false);
                        setOpenDrawerNewAccount(false);
                        handleSearch();
                    } else if (response.data.message === "account_exist") {
                        message.error("số điện thoại hoặc email đã được đăng ký trong hệ thống");
                        setLoading(false);
                    } else {
                        message.error("Cập nhật thông tin nhân viên thất bại");
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
    const onSubmitEditAccount = async (values) => {
        setLoading(true);
        const { status, typeManagers } = values;

        if (!editRecord || !editRecord.uid) {
            console.error("Không có thông tin nhân viên để cập nhật.");
            setLoading(false);
            return;
        }

        const staffId = editRecord.uid;
        const requestBody = {
            id: staffId,
            status: status === "Hoạt động" ? 1 : 0,
            typeManagers: typeManagers || [],
        };

        try {
            const response = await request.put("Admin/UpdateStaff", requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "update_successful") {
                message.success("Cập nhật thông tin nhân viên thành công");
                setLoading(false);
                setOpenDrawerEdit(false);
                handleSearch();
            } else if (response.data.message === "account_exist") {
                message.error("số điện thoại hoặc email đã được đăng ký trong hệ thống");
                setLoading(false);
            } else {
                message.error("Cập nhật thông tin nhân viên thất bại");
                setLoading(false);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin nhân viên: ", error);
            message.error("Hệ thống quá tải hoặc đã có lỗi xảy ra khi cập nhật thông tin nhân viên");
            setLoading(false);
        }
    };

    const [typeManagerData, setTypeManagerData] = useState([]);
    const getTypeManagerData = async () => {
        try {
            const response = await request.get("Admin/GetAllTypeManager", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTypeManagerData(response.data);
        } catch (error) {
            console.error("Error fetching type manager data: ", error);
            message.error("Failed to fetch type manager data");
        }
    };
    const today = moment();
    const disabledDate = (current) => {
        return current && current > today.endOf("day");
    };
    useEffect(() => {
        getTypeManagerData();
    }, []);
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("manage-token");
            if (!token) {
                console.error("Token not found. Handle this case.");
                return;
            }

            const exportResponse = await request.get("ExportData/Staff", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "staffsData.xlsx");
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
                <h2 style={{ color: "#02AA8A", fontWeight: "500" }}> Bảng quản lý nhân viên</h2>
                <Input.Search placeholder="tìm kiếm..." allowClear onSearch={onSearchText} style={{ width: "50%", marginRight: 8 }} />
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
                                value: "email",
                                label: "Email tăng dần",
                            },
                            {
                                value: "email desc",
                                label: "Email giảm dần",
                            },
                            {
                                value: "address",
                                label: "Nơi ở tăng dần",
                            },
                            {
                                value: "address desc",
                                label: "Nơi ở giảm dần",
                            },
                        ]}
                    />
                    <Button onClick={handleExportData} type="primary" icon={<ExportOutlined />} style={{ backgroundColor: "#02AA8A", marginLeft: "20px" }}>
                        Xuất dữ liệu
                    </Button>
                </div>
                <Button type="primary" onClick={showDrawerNewAccount} icon={<PlusOutlined />} style={{ backgroundColor: "#02AA8A" }}>
                    Tạo mới tài khoản
                </Button>
            </div>
            {/* Drawer New Account */}
            <Drawer
                title="Tạo mới tài khoản nhân viên"
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
                    {/*  Email */}
                    <Form.Item
                        label="Email"
                        name="uemail"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập email!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Email không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="email" placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        label="Tên đầy đủ"
                        name="fullname"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên đây đủ!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên đầy đủ không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên đầy đủ" />
                    </Form.Item>
                    {/* Phone Number */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập số điện thoại!",
                            },
                            {
                                pattern: /^[0-9]*$/,
                                message: "Vui lòng chỉ nhập số điện thoại!",
                            },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Số điện thoại không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="dob" hasFeedback rules={[{ required: true, message: "Hãy nhập ngày sinh!" }]}>
                        <DatePicker disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        label="Nơi ở"
                        name="address"
                        hasFeedback
                        rules={[
                            { required: true, message: "Hãy nhập địa chỉ!" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Nơi ở không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập nơi ở" />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender" hasFeedback rules={[{ required: true, message: "Hãy lựa chọn giới tính!" }]}>
                        <Select placeholder="Lựa chọn giới tính">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
            {/* Drawer Edit Account */}
            <Drawer
                title="Chỉnh sửa thông tin nhân viên"
                width={600}
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
                        status: editRecord?.status ? "Hoạt động" : "Không hoạt động",
                        typeManagers: editRecord?.typeManagers.map((typeManager) => typeManager.typeManagerId.toString()),
                    }}
                    onFinish={onSubmitEditAccount}
                >
                    {/* useEffect để cập nhật initialValues */}
                    {useEffect(() => {
                        if (editRecord) {
                            form.setFieldsValue({
                                status: editRecord?.status ? "Hoạt động" : "Không hoạt động",
                                typeManagers: editRecord?.typeManagers.map((typeManager) => typeManager.typeManagerId.toString()),
                            });
                        }
                    }, [editRecord, form])}
                    <div style={{ marginBottom: "20px" }}>
                        <Avatar
                            src={editRecord?.avatar && isValidImageUrl(editRecord?.avatar) ? editRecord?.avatar : images.avatar.default}
                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                            className="me-2"
                        ></Avatar>
                        <div className="d-flex flex-column">
                            <span className="fw-bold text-dark">
                                {userManage && userManage.roleid === 1 ? "Nhân viên" : "Nhân viên"} | ID: {editRecord?.uid}
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
                                <p className="text-muted">{editRecord?.uemail}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Số điện thoại</h6>
                                <p className="text-muted">{editRecord?.phoneNumber}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Năm sinh</h6>
                                <p className="text-muted">{editRecord?.dob ? moment(editRecord.dob).format("YYYY-MM-DD") : ""}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>Nơi ở</h6>
                                <p className="text-muted">{editRecord?.address}</p>
                            </div>
                            <div className="col-6 mb-3">
                                <h6>giới tính</h6>
                                <p className="text-muted">{editRecord?.gender ? "Nam" : "Nữ"}</p>
                            </div>
                        </div>
                    </div>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy lựa chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select placeholder="Hãy lựa chọn trạng thái của bạn">
                            <Option value="Hoạt động">Hoạt động</Option>
                            <Option value="Không hoạt động">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="typeManagers"
                        label="Loại quản lý"
                        rules={[
                            {
                                required: true,
                                message: "Hãy lựa chọn loại quản lý!",
                                type: "array",
                            },
                        ]}
                    >
                        <TreeSelect
                            showSearch
                            allowClear
                            style={{ width: "100%" }}
                            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                            placeholder="Lựa chọn Loại quản lý"
                            treeDefaultExpandAll
                            treeCheckable
                            showCheckedStrategy={SHOW_PARENT}
                            treeNodeFilterProp="title"
                            treeData={typeManagerData.map((manager) => ({
                                title: manager.typeManagerName,
                                value: manager.typeManagerId.toString(), // Giá trị này phải khớp với giá trị của typeManagers trong initialValues và onSubmitEditAccount
                                key: manager.typeManagerId.toString(),
                            }))}
                        />
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
