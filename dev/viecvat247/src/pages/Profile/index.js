import { EditOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Divider, Form, Input, Modal, Radio, Rate, Select, Spin, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import images from "~/assets/images";
import LoadingIcon from "~/components/Loading";
import { useAuth } from "~/utils/AuthContext";
import request from "~/utils/request";
import useAuthorization from "~/utils/useAuthorization";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

const Profile = () => {
    useEffect(() => {
        document.title = "Thông tin tài khoản - Viecvat247";
    }, []);
    // ------------------------------------------------------
    const { user, isInitialized } = useAuth();
    const [data, setData] = useState(null);
    const [numberFeedbackResponse, setNumberFeedbackResponse] = useState(0);

    const [loading, setLoading] = useState(false);
    const [listSkill, setListSkill] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [form] = Form.useForm();
    const { Option } = Select;
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");
    // -----------------------------------------------
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Gọi API lấy thông tin người dùng
            const responseData = await request.get(`Customer/UserProfile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setData(responseData.data);
            console.log(responseData.data.listSkills);

            const auth = JSON.parse(localStorage?.getItem("auth"));
            const user_id = auth.uid;
            console.log(user_id);
            const numberFeedbackResponse = await request.get("Report/GetNumberFeedbackByCid?cid=" + user_id);
            setNumberFeedbackResponse(numberFeedbackResponse.data.numberFeedback);
            console.log(numberFeedbackResponse.data.numberFeedback);

            // Gọi API lấy danh sách kỹ năng
            const responseSkills = await request.get(`Staff/Skill/GetAll`);
            setListSkill(responseSkills.data.skills);

            // Gọi API lấy danh sách tỉnh/thành phố
            const responseCities = await request.get("https://provinces.open-api.vn/api/?depth=1");
            setCities(responseCities.data);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (firstLoad) {
            fetchData();
            setFirstLoad(false);
        }
    }, [firstLoad]);
    // -----------------------------------------------

    const [editModalOpen, setEditModalOpen] = useState(false);
    const showEditModal = () => {
        setEditModalOpen(true);
        setAvatarUrl(data.avatar);
    };
    const editHandleCancel = () => {
        setEditModalOpen(false);
        form.resetFields();
    };
    // --------------------------------------

    // Thêm state cho tỉnh/thành phố, quận/huyện, xã/phường
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    // Gọi API lấy danh sách quận/huyện khi tỉnh/thành phố được chọn
    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                if (selectedCity) {
                    const responseDistricts = await request.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`);
                    setDistricts(responseDistricts.data.districts);
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };

        fetchDistricts();
    }, [selectedCity]);

    // Gọi API lấy danh sách xã/phường khi quận/huyện được chọn
    useEffect(() => {
        const fetchWards = async () => {
            try {
                if (selectedDistrict) {
                    const responseWards = await request.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
                    setWards(responseWards.data.wards);
                }
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        };

        fetchWards();
    }, [selectedDistrict]);

    const onSubmitUpdate = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            dob: fieldsValue["dob"].format("YYYY-MM-DD"),
        };
        console.log(values);

        var formData = {
            phoneNumber: values.phoneNumber,
            fullName: values.fullName,
            location: null,
            address: values.city.trim() + ", " + values.district.trim() + ", " + values.ward.trim(),
            descrition: values.description,
            avatar: values.avatarUrl,
            dob: values.dob,
            cv: null,
            gender: values.gender,
            skills: values.listSkills,
        };

        try {
            setLoading(true);
            const token = localStorage?.getItem("token");
            request
                .put("Customer/UserProfile", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thành công", [1.5]);
                        setLoading(false);
                        setEditModalOpen(false);
                        // Update data user
                        getUserProfile(token)
                            .then((userData) => {
                                setData(userData);
                                const auth = JSON.parse(localStorage?.getItem("auth"));
                                auth.avatar = userData.avatar;
                                auth.fullname = userData.fullName;
                                auth.money = userData.epoint;
                                localStorage.setItem("auth", JSON.stringify(auth));
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error updating profile:", error);
            setLoading(false);
        }
    };

    async function getUserProfile(token) {
        try {
            const response = await request.get("Customer/UserProfile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }

    const isValidImageUrl = (url) => {
        const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
        return imageUrlRegex.test(url);
    };
    const disabledDate = (current) => {
        return current && current > dayjs().endOf("day");
    };

    // Upload avatar image
    const [avatarUrl, setAvatarUrl] = useState();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleButtonEditAvatar = () => {
        document.querySelector("#file-input").click();
    };

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

    return (
        <Fragment>
            {!isInitialized || !data ? (
                <LoadingIcon />
            ) : (
                <>
                    <div className="fs-5 fw-bold mb-3">Thông tin tài khoản</div>
                    <div className="border rounded p-3 pb-3 ">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center flex-wrap">
                                <Avatar
                                    src={data.avatar && isValidImageUrl(data.avatar) ? data.avatar : images.avatar.default}
                                    size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }}
                                    className="me-2 border rounded-circle"
                                ></Avatar>
                                <div className="d-flex flex-column">
                                    <span className="fw-bold text-primary">{data.fullName ? data.fullName : ""}</span>
                                    <span className="fw-bold text-dark">
                                        {data.role === 1 ? "Nhà tuyển dụng" : "Ứng viên"} | ID: {data.cid}
                                    </span>
                                    <span className="d-flex align-items-center flex-wrap">
                                        <div className="d-flex align-items-center flex-wrap">
                                            <span className="me-2">{data.voting && data.voting > 0 ? Number(data.voting).toFixed(1) : 0}</span>
                                            <Rate disabled defaultValue={data.voting && data.voting > 0 ? Number(data.voting).toFixed(1) : 0} />
                                            <span className="ms-2">({numberFeedbackResponse} đánh giá)</span>
                                        </div>
                                    </span>
                                </div>
                            </div>

                            <Button onClick={showEditModal} type="default" size="small" className="d-flex align-items-center">
                                <EditOutlined />
                                Chỉnh sửa
                            </Button>
                            <Modal title="Chỉnh sửa thông tin" open={editModalOpen} onCancel={editHandleCancel} width={1000} destroyOnClose={true} footer={null}>
                                <>
                                    <div className="d-flex flex-column position-relative">
                                        <div style={{ width: "100px", height: "100px" }} className="d-flex align-items-center justify-content-center border rounded-circle position-relative">
                                            {isUploadingAvatar ? (
                                                <Spin />
                                            ) : (
                                                <Avatar src={avatarUrl && isValidImageUrl(avatarUrl) ? avatarUrl : images.avatar.default} className="img-fluid w-100 h-100" />
                                            )}
                                            <input type="file" id="file-input" onChange={handlePreviewAvatar} className="d-none" accept="image/*" />
                                            <Button shape="circle" icon={<EditOutlined />} onClick={handleButtonEditAvatar} className="position-absolute bottom-0 end-0" />
                                        </div>
                                    </div>

                                    <Form
                                        form={form}
                                        id="updateProfileForm"
                                        layout="vertical"
                                        onFinish={onSubmitUpdate}
                                        initialValues={{
                                            avatarUrl: data.avatar,
                                            fullName: data.fullName,
                                            phoneNumber: data.phoneNumber,
                                            dob: dayjs(data.dob, dateFormat),
                                            gender: data.gender ? data.gender : true,
                                            // address: data.address,
                                            description: data.descrition,
                                            listSkills: data.listSkills,
                                            city: data.address ? data.address.split(", ")[0] : selectedCity,
                                            district: data.address ? data.address.split(", ")[1] : selectedDistrict,
                                            ward: data.address ? data.address.split(", ")[2] : selectedWard,
                                        }}
                                    >
                                        <Form.Item name="avatarUrl" hidden={true}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Tên"
                                            name="fullName"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Tên là bắt buộc",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phoneNumber"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Số điện thoại là bắt buộc",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ngày sinh"
                                            name="dob"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Ngày sinh là bắt buộc",
                                                },
                                            ]}
                                        >
                                            {/* <DatePicker format={dateFormat} /> */}
                                            <DatePicker format={dateFormat} disabledDate={disabledDate} />
                                        </Form.Item>

                                        <Form.Item name="gender" label="Giới tính">
                                            <Radio.Group>
                                                <Radio value={true}>Nam</Radio>
                                                <Radio value={false}>Nữ</Radio>
                                            </Radio.Group>
                                        </Form.Item>

                                        {/* <Form.Item
                                            label="Địa chỉ"
                                            name="address"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Địa chỉ là bắt buộc",
                                                },
                                            ]}
                                            hidden={true}
                                        >
                                            <Input />
                                        </Form.Item> */}

                                        <Form.Item
                                            label="Tỉnh/Thành phố"
                                            name="city"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn tỉnh/thành phố",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                placeholder="Chọn quận/huyện"
                                                onChange={(value) => setSelectedCity(cities.find((city) => city.name === value))}
                                            >
                                                {cities.map((city) => (
                                                    <Option key={city.code} value={city.name}>
                                                        {city.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Quận/Huyện"
                                            name="district"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn quận/huyện",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                placeholder="Chọn quận/huyện"
                                                onChange={(value) => setSelectedDistrict(districts.find((district) => district.name === value))}
                                                disabled={!selectedCity}
                                            >
                                                {districts.map((district) => (
                                                    <Option key={district.code} value={district.name}>
                                                        {district.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Xã/Phường"
                                            name="ward"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn xã/phường",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                placeholder="Chọn xã/phường"
                                                onChange={(value) => setSelectedWard(wards.find((ward) => ward.name === value))}
                                                disabled={!selectedDistrict}
                                            >
                                                {wards.map((ward) => (
                                                    <Option key={ward.code} value={ward.name}>
                                                        {ward.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Tóm tắt bản thân"
                                            name="description"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Tóm tắt bản thân là bắt buộc",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea />
                                        </Form.Item>

                                        <Form.Item
                                            name="listSkills"
                                            label="Kỹ năng"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn kỹ năng của bạn",
                                                    type: "array",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                mode="multiple"
                                                placeholder="Chưa chọn kỹ năng nào"
                                                disabled={listSkill.length === 0}
                                            >
                                                {listSkill.map((item) => (
                                                    <Option key={item.skillId} value={item.skillId}>
                                                        {item.skillName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item className="d-flex justify-content-end mb-0">
                                            <Button danger onClick={editHandleCancel} className="me-2">
                                                Hủy
                                            </Button>
                                            <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Spin className="me-2" />
                                                        Lưu lại
                                                    </>
                                                ) : (
                                                    "Lưu lại"
                                                )}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            </Modal>
                        </div>
                        <Divider />
                        <div className="">
                            <div>
                                <span className="fw-bold">Số dư:</span>{" "}
                                {data.epoint
                                    ? Number(data.epoint).toLocaleString("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                      })
                                    : "0"}
                            </div>
                            <div>
                                <span className="fw-bold">Địa chỉ email:</span> {data.cemail ? data.cemail : "Chưa thiết lập"}
                            </div>
                            <div>
                                <span className="fw-bold">Số điện thoại:</span> {data.phoneNumber ? data.phoneNumber : "Chưa thiết lập"}
                            </div>
                            <div>
                                <span className="fw-bold">Ngày sinh của bạn:</span> {data.dob ? dayjs(data.dob).format(dateFormat) : "Chưa thiết lập"}
                            </div>
                            <div>
                                <span className="fw-bold">Giới tính:</span> {data.gender === true ? "Nam" : "Nữ"}
                            </div>
                            <div>
                                <span className="fw-bold">Địa chỉ:</span> {data.address ? data.address : "Chưa thiết lập"}
                            </div>
                            <div>
                                <span className="fw-bold">Tóm tắt bản thân:</span> {data.descrition ? data.descrition : "Chưa thiết lập"}
                            </div>

                            <div>
                                <span className="fw-bold">Kỹ năng:</span>{" "}
                                {data.skills.length > 0 ? (
                                    <div className="d-inline-block">
                                        {data.skills.map((skill, index) => (
                                            <span key={index} className="badge bg-success me-2 mb-2">
                                                {skill.skillName}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span>Chưa thiết lập</span>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Fragment>
    );
};

export default Profile;
