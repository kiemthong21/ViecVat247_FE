import React, { useEffect, useState } from "react";

import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Form, Input, Modal, Select, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import request from "~/utils/request";
import images from "~/assets/images";
import moment from "moment";
import { useAuth } from "~/utils/AuthContext";
import { Fragment } from "react";

const { Option } = Select;

const ManageLayout = () => {
    useEffect(() => {
        document.title = "Bảng thông tin cá nhân - Viecvat247";
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

    const [form] = Form.useForm();
    const token = localStorage?.getItem("manage-token");
    const [data, setData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const handleChangePassword = () => {
        setChangePasswordLoading(true);
        const { oldPassword, newPassword, confirmPassword } = changePasswordData;

        if (newPassword !== confirmPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
            setChangePasswordLoading(false);
            return;
        }
        request
            .put(
                "Staff/ChangePassword",
                {
                    oldPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                if (response.data.message === "wrong_password") {
                    message.error("Mật khẩu cũ không đúng");
                    setChangePasswordLoading(false);
                }
                if (response.data.message === "update_successful") {
                    message.success("Đổi mật khẩu thành công!");
                    setChangePasswordLoading(false);
                    handleCancelChangePassword();
                } else {
                    message.error("Đổi mật khẩu thất bại. Hãy thử lại sau!");
                    setChangePasswordLoading(false);
                }
            })
            .catch((error) => {
                message.error("Đổi mật khẩu thất bại. Hãy thử lại sau!");
                setChangePasswordLoading(false);
                console.error("Change Password Error:", error);
            });
    };
    const showModal = () => {
        setIsModalVisible(true);
        fetchUserData();
        setAvatarUrl(data?.avatar);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetchUserData = () => {
        request
            .get("Staff/Profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setData(res.data);
            })
            .catch(() => {});
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    const showChangePasswordModal = () => {
        setChangePasswordVisible(true);
    };

    const handleCancelChangePassword = () => {
        setChangePasswordVisible(false);
    };

    const onSubmitEditAccount = (values) => {
        setLoading(true);
        var dataProfile = {
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            address: values.address,
            avatar: values.avatarUrl,
            gender: values.gender === "male" ? true : false,
            dob: values.dob,
        };
        request
            .put("Staff/EditProfile", dataProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.message === "update_successful") {
                    message.success("Cập nhật thông tin thành công!");
                    setLoading(false);
                    fetchUserData();
                    setIsModalVisible(false);
                }
            })
            .catch((error) => {
                message.error("Cập nhật thông tin thất bại. Hãy thử lại lần sau!");
                setLoading(false);
            });
    };
    const isValidImageUrl = (url) => {
        const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
        return imageUrlRegex.test(url);
    };
    const [avatarUrl, setAvatarUrl] = useState();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handlePreviewAvatar = (e) => {
        const file = e.target.files[0];
        const handleUploadImage = async () => {
            try {
                setIsUploadingAvatar(true);
                const formData = new FormData();
                formData.append("file", file);
                const response = await request.post("Other/upload-image", formData);
                setAvatarUrl(response.data.imageUrl);
                form.setFieldsValue({ avatarUrl: response.data.imageUrl });
                setIsUploadingAvatar(false);
            } catch (error) {
                console.error("Upload failed:", error);
                setIsUploadingAvatar(false);
            }
        };
        handleUploadImage();
    };
    const handleButtonEditAvatar = () => {
        document.querySelector("#file-input").click();
    };
    const today = moment();
    const disabledDate = (current) => {
        return current && current > today.endOf("day");
    };
    return (
        <Fragment>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-300">
                    <div className="col col-lg-6 mb-4 mb-lg-0" style={{ width: "1000px" }}>
                        <div className="card mb-3" style={{ borderRadius: ".5rem" }}>
                            <div className="row g-0">
                                <div className="col-md-4 gradient-custom text-center text-white" style={{ borderTopLeftRadius: ".5rem", borderBottomLeftRadius: ".5rem" }}>
                                    {data && (
                                        <Avatar
                                            src={data.avatar && isValidImageUrl(data?.avatar) ? data?.avatar : images.avatar.default}
                                            className="img-fluid my-5"
                                            style={{ width: "100px", height: "100px" }}
                                        ></Avatar>
                                    )}
                                    <div style={{ color: "black" }}>
                                        {data && (
                                            <>
                                                <h5>{data?.fullName}</h5>
                                                <h5>{data?.dob ? moment(data?.dob).format("YYYY-MM-DD") : ""}</h5>
                                                <p>{userManage && userManage.roleid === 1 ? "Nhân viên" : "Quản lý"}</p>
                                                <Button className="mb-5" style={{ color: "green" }} type="default" ghost icon={<EditOutlined />} onClick={showModal}>
                                                    Chỉnh sửa
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body p-4">
                                        <Button className="mb-5" type="primary" ghost icon={<EditOutlined />} onClick={showChangePasswordModal}>
                                            Đổi mật khẩu
                                        </Button>
                                        <h6>Thông tin</h6>
                                        <hr className="mt-0 mb-4" />
                                        <div className="row pt-1">
                                            <div className="col-6 mb-3">
                                                <h6>Email</h6>
                                                <p className="text-muted">{data?.uemail}</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6>Số điện thoại</h6>
                                                <p className="text-muted">{data?.phoneNumber}</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6>Giới tính</h6>
                                                <p className="text-muted">{data?.gender === false ? "Nữ" : "Nam"}</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6>Nơi ở</h6>
                                                <p className="text-muted">{data?.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                styles={{
                    body: {
                        marginRight: 8,
                        paddingBottom: 80,
                    },
                }}
                destroyOnClose
            >
                <div className="d-flex flex-column position-relative">
                    <div style={{ width: "100px", height: "100px" }} className="d-flex align-items-center justify-content-center border rounded-circle position-relative">
                        {isUploadingAvatar ? <Spin /> : avatarUrl && <Avatar src={isValidImageUrl(avatarUrl) ? avatarUrl : images.avatar.default} className="img-fluid w-100 h-100" />}
                        <input type="file" id="file-input" onChange={handlePreviewAvatar} className="d-none" accept="image/*" />
                        <Button shape="circle" icon={<EditOutlined />} onClick={handleButtonEditAvatar} className="position-absolute bottom-0 end-0" />
                    </div>
                </div>
                <Form
                    form={form}
                    name="editForm"
                    layout="vertical"
                    initialValues={{
                        fullName: data?.fullName || "Chưa thiết lập",
                        phoneNumber: data?.phoneNumber || "Chưa thiết lập",
                        dob: data?.dob ? moment(data?.dob) : null,
                        address: data?.address || "Chưa thiết lập",
                        gender: data?.gender ? "male" : "female",
                        avatarUrl: data?.avatar,
                    }}
                    onFinish={onSubmitEditAccount}
                >
                    <Form.Item name="avatarUrl" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên đầy đủ"
                        name="fullName"
                        hasFeedback
                        rules={[
                            { required: true, message: "Hãy nhập tên của bạn!" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Tên đầy đủ không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        hasFeedback
                        rules={[
                            { required: true, message: "Hãy nhập số điện thoại!" },
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
                        <Input type="phoneNumber" />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="dob" hasFeedback rules={[{ required: true, message: "Hãy nhập ngày sinh của bạn!" }]}>
                        <DatePicker disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        label="Nơi ở"
                        name="address"
                        hasFeedback
                        rules={[
                            { required: true, message: "Hãy nhập Nơi ở của bạn!" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Nơi ở không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: "Hãy chọn giới tính của bạn!" }]}>
                        <Select placeholder="Select gender">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#02AA8A", color: "white" }} disabled={loading}>
                            {loading ? <Spin /> : "Lưu chỉnh sửa"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Đổi mật khẩu" open={changePasswordVisible} onCancel={handleCancelChangePassword} footer={null}>
                <Form layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[
                            { required: true, message: "Hãy nhập mật khẩu cũ" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: " mật khẩu cũ không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" onChange={(e) => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Hãy nhập mật khẩu mới!" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Mật khẩu mới không thể để khoảng trắng đầu cuối!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: "Hãy xác nhận mật khẩu!" },
                            {
                                pattern: /^\S(?:.*\S)?\s?$/,
                                message: "Xác nhận mật khẩu không thể để khoảng trắng đầu cuối!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#02AA8A", color: "white" }} disabled={changePasswordLoading}>
                            {changePasswordLoading ? <Spin /> : " Thay đổi mật khẩu"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
};
export default ManageLayout;
