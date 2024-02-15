import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Tabs, message } from "antd";
import request from "~/utils/request";
import LoadingIcon from "~/components/Loading";
import Map from "~/components/Map";
import { useAuth } from "~/utils/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import useAuthorization from "~/utils/useAuthorization";
import Swal from "sweetalert2";

const { Option } = Select;

const CreateRecruitment = () => {
    useEffect(() => {
        document.title = "Đăng việc - Viecvat247";
    }, []);

    //   ---------------------------------------
    const { user, isInitialized } = useAuth();
    const { checkExpires } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1], "/");
    // ---------------------------------------------------------------------

    const [formOnline] = Form.useForm();
    const [formOffline] = Form.useForm();
    // GG Map
    const [modal2Open, setModal2Open] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [location, setlocation] = useState(null);
    const handleLocationChange = (location) => {
        setSelectedLocation(location);
    };
    const handleOk = () => {
        console.log("Selected Location:", selectedLocation);
        formOffline.setFieldsValue({ address: selectedLocation?.label ? selectedLocation?.label : null });
        formOffline.setFieldsValue({ location: selectedLocation?.lat && selectedLocation?.lng ? selectedLocation?.lat + ", " + selectedLocation?.lng : null });
        setModal2Open(false);
        setAddress(selectedLocation?.label);
        setlocation(selectedLocation?.lat + ", " + selectedLocation?.lng);
    };
    //
    const [loading, setLoading] = useState(false);
    const [listCategorySkill, setListCategorySkill] = useState([]);
    const [listCategoryJob, setListCategoryJob] = useState([]);
    const [listSkillOnline, setListSkillOnline] = useState([]);
    const [listSkillOffline, setListSkillOffline] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skillCategoryResponse = await request.get("SkillCategory/GetAll");
                setListCategorySkill(skillCategoryResponse.data.skillsCategory);

                const jobCategoryResponse = await request.get("JobsCategory/GetAll");
                setListCategoryJob(jobCategoryResponse.data.jobsCategory);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const changeCategorySkill = async (value) => {
        try {
            const skillResponse = await request.get("Skill/GetAll", { params: { cate: value } });
            setListSkillOnline(skillResponse.data.skills);
            setListSkillOffline(skillResponse.data.skills);
            console.log(listSkillOnline);
        } catch (error) {
            console.error("Error fetching data:", error);
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

    // Online Form
    const onFinishOnline = (values) => {
        console.log(values);
        checkExpires();
        var formData = {
            jobCategoryId: values.jobCategoryId,
            title: values.title,
            job_Overview: values.overview,
            required_Skills: values.required,
            preferred_Skills: values.preferred,
            noticeToJobSeeker: values.notice,
            workingTime: values.workingTime,
            money: parseInt(values.money),
            typeJobs: "ONLINE",
            numberPerson: parseInt(values.numberPerson),
            listSkill: values.listSkills,
            status: values.status,
            isGmail: true,
        };

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            request
                .post("PostRecruitment/CreateJobs", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.message === "create_successful") {
                        message.success("Đăng bài thành công", [1.5]);
                        // Update data user
                        getUserProfile(token)
                            .then((userData) => {
                                const auth = JSON.parse(localStorage?.getItem("auth"));
                                auth.avatar = userData.avatar;
                                auth.fullname = userData.fullName;
                                auth.money = userData.epoint;
                                localStorage.setItem("auth", JSON.stringify(auth));
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                        setLoading(false);
                        navigate("/manage-jobs");
                    }
                    if (response.data.message === "create_draf_job_successful") {
                        message.success("Đã lưu thành bản nháp", [1.5]);
                        // Update data user
                        getUserProfile(token)
                            .then((userData) => {
                                const auth = JSON.parse(localStorage?.getItem("auth"));
                                auth.avatar = userData.avatar;
                                auth.fullname = userData.fullName;
                                auth.money = userData.epoint;
                                localStorage.setItem("auth", JSON.stringify(auth));
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                        setLoading(false);
                        navigate("/manage-jobs");
                    }
                    if (response.data.message === "skill_not_found") {
                        message.error("Không tìm thấy kỹ năng này", [1.5]);
                        setLoading(false);
                    }
                    if (response.data.message === "insufficient_balance") {
                        message.warning("Số dư của bạn không đủ", [1.5]);
                        setLoading(false);
                    }
                });
        } catch (error) {
            setLoading(false);
        }
    };
    // Offline Form
    const onFinishOffline = (values) => {
        console.log(values);
        checkExpires();
        var formData = {
            jobCategoryId: values.jobCategoryId,
            title: values.title,
            job_Overview: values.overview,
            required_Skills: values.required,
            preferred_Skills: values.preferred,
            noticeToJobSeeker: values.notice,
            location: values.location,
            address: values.address,
            workingTime: values.workingTime,
            money: parseInt(values.money),
            typeJobs: "OFFLINE",
            numberPerson: parseInt(values.numberPerson),
            listSkill: values.listSkills,
            status: values.status,
            isGmail: true,
        };
        console.log(formData);
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            request
                .post("PostRecruitment/CreateJobs", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.message === "create_successful") {
                        message.success("Đăng bài thành công", [1.5]);
                        // Update data user
                        getUserProfile(token)
                            .then((userData) => {
                                const auth = JSON.parse(localStorage?.getItem("auth"));
                                auth.avatar = userData.avatar;
                                auth.fullname = userData.fullName;
                                auth.money = userData.epoint;
                                localStorage.setItem("auth", JSON.stringify(auth));
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                        setLoading(false);
                        navigate("/manage-jobs");
                    }
                    if (response.data.message === "create_draf_job_successful") {
                        message.success("Đã lưu thành bản nháp", [1.5]);
                        // Update data user
                        getUserProfile(token)
                            .then((userData) => {
                                const auth = JSON.parse(localStorage?.getItem("auth"));
                                auth.avatar = userData.avatar;
                                auth.fullname = userData.fullName;
                                auth.money = userData.epoint;
                                localStorage.setItem("auth", JSON.stringify(auth));
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                        setLoading(false);
                        navigate("/manage-jobs");
                    }
                    if (response.data.message === "skill_not_found") {
                        message.error("Không tìm thấy kỹ năng này", [1.5]);
                        setLoading(false);
                    }
                    if (response.data.message === "insufficient_balance") {
                        message.warning("Số dư của bạn không đủ", [1.5]);
                        setLoading(false);
                    }
                });
        } catch (error) {
            setLoading(false);
        }
    };

    const handleNumberChange = (fieldName, value, form) => {
        if (value < 0) {
            const updatedValue = Math.abs(value);
            const updatedField = {};
            updatedField[fieldName] = updatedValue;
            form.setFieldsValue(updatedField);
        }
    };

    const items = [
        {
            key: "1",
            label: "Đăng tuyển dụng việc vặt trực tuyến",
            children: (
                <div className="border mb-3 rounded-1">
                    <div className="container">
                        <div className="text-center h3 mt-4 mb-4" style={{ color: "#02aa8a" }}>
                            THÔNG TIN TUYỂN DỤNG
                        </div>
                        <Form form={formOnline} name="recruitment-online" onFinish={onFinishOnline} layout="vertical">
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Tiêu đề là bắt buộc",
                                    },
                                ]}
                            >
                                <Input showCount maxLength={150} size="large" />
                            </Form.Item>

                            <Form.Item
                                name="jobCategoryId"
                                label="Danh mục công việc"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục công việc của bạn",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="Chưa chọn danh mục công việc nào"
                                >
                                    {listCategoryJob.map((item) => (
                                        <Option key={item.jobCategoryId} value={item.jobCategoryId}>
                                            {item.jobCategoryName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="skillCategoryId"
                                label="Danh mục kỹ năng"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục kỹ năng cho công việc của bạn",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={changeCategorySkill}
                                    placeholder="Chưa chọn danh mục kỹ năng nào"
                                >
                                    {listCategorySkill.map((item) => (
                                        <Option key={item.skillCategoryId} value={item.skillCategoryId}>
                                            {item.skillCategoryName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="listSkills"
                                label="Kỹ năng"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kỹ năng cho công việc của bạn",
                                        type: "array",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    mode="multiple"
                                    placeholder="Chưa chọn kỹ năng nào"
                                    disabled={listSkillOnline.length === 0}
                                >
                                    {listSkillOnline.map((item) => (
                                        <Option key={item.skillId} value={item.skillId}>
                                            {item.skillName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row gutter={8}>
                                <Col span={8}>
                                    <Form.Item
                                        name="money"
                                        label="Số tiền (VNĐ)"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số tiền là bắt buộc",
                                            },
                                            { type: "integer", min: 1, message: "Số tiền phải lớn hơn 0" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("money", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="numberPerson"
                                        label="Số người"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số người là bắt buộc",
                                            },
                                            { type: "integer", min: 1, max: 10, message: "Số người phải lớn hơn 0 và nhỏ hơn 10" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("numberPerson", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="workingTime"
                                        label="Số giờ"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số giờ là bắt buộc",
                                            },
                                            { type: "integer", min: 1, max: 240, message: "Số giờ lớn hơn 0 và nhỏ hơn 240" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("workingTime", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="overview"
                                label="Tổng quan công việc"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Tổng quan công việc là bắt buộc",
                                    },
                                    {
                                        minLength: 50,
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="required"
                                label="Các kĩ năng và kinh nghiệm yêu cầu"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Các kĩ năng và kinh nghiệm yêu cầu là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="preferred"
                                label="Các kĩ năng và công việc được ưu tiên"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Các kĩ năng và công việc được ưu tiên là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="notice"
                                label="Ghi chú"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Ghi chú là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>

                            <Form.Item name="status" hidden={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item className="d-flex justify-content-end">
                                <Button
                                    style={{ color: "#01b195", borderColor: "#01b195" }}
                                    htmlType="submit flex-end"
                                    className="me-2"
                                    onClick={() => formOnline.setFieldsValue({ status: 5 })}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spin className="me-2" />
                                            Lưu bản nháp
                                        </>
                                    ) : (
                                        "Lưu bản nháp"
                                    )}
                                </Button>
                                <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit" onClick={() => formOnline.setFieldsValue({ status: 0 })} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spin className="me-2" />
                                            Lưu lại
                                        </>
                                    ) : (
                                        "Đăng bài"
                                    )}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: "Đăng tuyển dụng việc vặt trực tiếp",
            children: (
                <div className="border mb-3 rounded-1">
                    <div className="container">
                        <div className="text-center h3 mt-4 mb-4" style={{ color: "#02aa8a" }}>
                            THÔNG TIN TUYỂN DỤNG
                        </div>
                        <Form form={formOffline} name="recruitment-offline" onFinish={onFinishOffline} layout="vertical">
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Tiêu đề là bắt buộc",
                                    },
                                ]}
                            >
                                <Input showCount maxLength={150} size="large" />
                            </Form.Item>

                            <Form.Item
                                name="jobCategoryId"
                                label="Danh mục công việc"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục công việc của bạn",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="Chưa chọn danh mục công việc nào"
                                >
                                    {listCategoryJob.map((item) => (
                                        <Option key={item.jobCategoryId} value={item.jobCategoryId}>
                                            {item.jobCategoryName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="skillCategoryId"
                                label="Danh mục kỹ năng"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục kỹ năng cho công việc của bạn",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={changeCategorySkill}
                                    placeholder="Chưa chọn danh mục kỹ năng nào"
                                >
                                    {listCategorySkill.map((item) => (
                                        <Option key={item.skillCategoryId} value={item.skillCategoryId}>
                                            {item.skillCategoryName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="listSkills"
                                label="Kỹ năng"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kỹ năng cho công việc của bạn",
                                        type: "array",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    mode="multiple"
                                    placeholder="Chưa chọn kỹ năng nào"
                                    disabled={listSkillOffline.length === 0}
                                >
                                    {listSkillOffline.map((item) => (
                                        <Option key={item.skillId} value={item.skillId}>
                                            {item.skillName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row gutter={8}>
                                <Col span={8}>
                                    <Form.Item
                                        name="money"
                                        label="Số tiền (VNĐ)"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số tiền là bắt buộc",
                                            },
                                            { type: "integer", min: 1, message: "Số tiền phải lớn hơn 0" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("money", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="numberPerson"
                                        label="Số người"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số người là bắt buộc",
                                            },
                                            { type: "integer", min: 1, max: 10, message: "Số người phải lớn hơn 0 và nhỏ hơn 10" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("numberPerson", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="workingTime"
                                        label="Số giờ"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Số giờ là bắt buộc",
                                            },
                                            { type: "integer", min: 1, max: 240, message: "Số giờ lớn hơn 0 và nhỏ hơn 240" },
                                        ]}
                                    >
                                        <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("workingTime", value, formOnline)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Địa chỉ là bắt buộc",
                                    },
                                ]}
                            >
                                <div className="d-flex align-items-center">
                                    <Input size="large" type="text" value={address} readOnly />
                                    <Button size="large" style={{ backgroundColor: "#01b195" }} type="primary" className="ms-2" onClick={() => setModal2Open(true)}>
                                        Bản đồ
                                    </Button>
                                </div>

                                <Modal title="Chọn vị trí" centered open={modal2Open} onOk={handleOk} onCancel={() => setModal2Open(false)} width={700}>
                                    <Map onLocationChange={handleLocationChange} />
                                </Modal>
                            </Form.Item>
                            <Form.Item name="location" label="Location" hidden>
                                <Input type="text" value={location} readOnly />
                            </Form.Item>

                            <Form.Item
                                name="overview"
                                label="Tổng quan công việc"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Tổng quan công việc là bắt buộc",
                                    },
                                    {
                                        minLength: 50,
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="required"
                                label="Các kĩ năng và kinh nghiệm yêu cầu"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Các kĩ năng và kinh nghiệm yêu cầu là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="preferred"
                                label="Các kĩ năng và công việc được ưu tiên"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Các kĩ năng và công việc được ưu tiên là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="notice"
                                label="Ghi chú"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Ghi chú là bắt buộc",
                                    },
                                ]}
                            >
                                <Input.TextArea size="large" showCount minLength={50} maxLength={3000} rows={4} />
                            </Form.Item>
                            <Form.Item name="status" hidden={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item className="d-flex justify-content-end">
                                <Button
                                    style={{ color: "#01b195", borderColor: "#01b195" }}
                                    htmlType="submit flex-end"
                                    className="me-2"
                                    onClick={() => formOffline.setFieldsValue({ status: 5 })}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spin className="me-2" />
                                            Lưu bản nháp
                                        </>
                                    ) : (
                                        "Lưu bản nháp"
                                    )}
                                </Button>
                                <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit" onClick={() => formOffline.setFieldsValue({ status: 0 })} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spin className="me-2" />
                                            Lưu lại
                                        </>
                                    ) : (
                                        "Đăng bài"
                                    )}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <Fragment>
            <Breadcrumb
                className="mt-4"
                items={[
                    {
                        title: <a href="/">Trang chủ</a>,
                    },
                    {
                        title: "Đăng tuyển dụng",
                    },
                ]}
            />
            {!isInitialized ? (
                <LoadingIcon />
            ) : (
                <Fragment>
                    <Tabs className="mt-3" defaultActiveKey="1" items={items} tabBarStyle={{ color: "#01b195" }} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default CreateRecruitment;
