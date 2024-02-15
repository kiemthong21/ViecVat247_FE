import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import request from "~/utils/request";
import LoadingIcon from "~/components/Loading";
import { Breadcrumb, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Tag, message } from "antd";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";

import WorkIcon from "@mui/icons-material/Work";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import { CheckOutlined, RetweetOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import Map from "~/components/Map";

function StatusJob({ status }) {
    switch (status) {
        case 0:
            return (
                <>
                    <Tag className="ms-2" color="#FFD700">
                        Đang đợi duyệt
                    </Tag>
                </>
            );
        case 1:
            return (
                <>
                    <Tag className="ms-2" color="#02aa8a">
                        Đã được duyệt
                    </Tag>
                </>
            );
        case 2:
            return (
                <>
                    <Tag className="ms-2" color="#FF4500">
                        Yêu cầu chỉnh sửa
                    </Tag>
                </>
            );
        case 3:
            return (
                <>
                    <Tag className="ms-2" color="#FF0000 ">
                        Bị từ chối
                    </Tag>
                </>
            );
        case 4:
            return (
                <>
                    <Tag className="ms-2" color="#0000FF ">
                        Hoàn thành
                    </Tag>
                </>
            );
        case 5:
            return (
                <>
                    <Tag className="ms-2" color="#0000FF ">
                        Bản nháp
                    </Tag>
                </>
            );
        case 6:
            return (
                <>
                    <Tag className="ms-2" color="#0000FF ">
                        Đã đóng
                    </Tag>
                </>
            );
        default:
            return <></>;
    }
}
const JobDetail = () => {
    const { user, isInitialized, checkExpires, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1], "/");
    // ------------------------------------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isOffline, setIsOffline] = useState(true);

    const updateData = (updatedData) => {
        setFirstLoad(updatedData);
        setIsModalOpen(false);
    };
    const showModal = () => {
        if (data) {
            if (data.typeJobs === "ONLINE") {
                setIsOnline(false);
            } else if (data.typeJobs === "OFFLINE") {
                setIsOffline(false);
            }
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        if (firstLoad) {
            const queryParams = new URLSearchParams(window.location.search);
            const id = queryParams.get("id");
            try {
                request
                    .get("PostRecruitment/getJobsById", { params: { jid: id } })
                    .then((res) => {
                        setData(res.data);
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
                setFirstLoad(false);
            } catch (error) {
                if (error.response.status === 401) {
                    logout();
                }
            }
        }
    }, [navigate, user, firstLoad, logout]);

    const handleCompleteTask = async () => {
        checkExpires();
        Swal.fire({
            title: "Bạn có chắc?",
            text: "Muốn xác nhận đã hoàn thành công việc này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    request
                        .put(`JobAssigner/SetJobDone/${data.jobsId}`, null, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((response) => {
                            if (response.data.message === "set_done_successful") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THÀNH CÔNG",
                                    text: "Đã xác nhận hoàn thành công việc",
                                    icon: "success",
                                });
                            }
                            if (response.data.message === "job_has_done") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Công việc này đã hoàn thành rồi",
                                    icon: "warning",
                                });
                            }
                            if (response.data.message === "job_has_reject") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Công việc này đã bị từ chối",
                                    icon: "error",
                                });
                            }
                            if (response.data.message === "job_wait_approve") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Công việc đang đợi duyệt",
                                    icon: "error",
                                });
                            }
                            if (response.data.message === "job_is_pending") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Công việc chưa được duyệt",
                                    icon: "error",
                                });
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                        });
                } catch (error) {
                    setLoading(false);
                }
            }
        });
    };

    const handlePostDraff = async (jobId) => {
        checkExpires();
        Swal.fire({
            title: "Bạn có chắc?",
            text: "Muốn đăng công việc này, số tiền để đăng bài là 3.000 VND",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vâng, tôi muốn",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#02aa8a",
            cancelButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    request
                        .put(`PostRecruitment/PostJobsDraff?id=${jobId}`, null, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((response) => {
                            if (response.data.message === "create_successful") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THÀNH CÔNG",
                                    text: "Đã đăng công việc thành công",
                                    icon: "success",
                                });
                            }
                            if (response.data.message === "insufficient_balance") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Số dư của bạn không đủ",
                                    icon: "success",
                                });
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                        });
                } catch (error) {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div>
            <Breadcrumb
                className="mt-4"
                items={[
                    {
                        title: "Trang chủ",
                    },
                    {
                        title: <a href="/manage-jobs">Quản lý công việc</a>,
                    },
                    {
                        title: "Chi tiết công việc",
                    },
                ]}
            />
            {loading ? (
                <LoadingIcon />
            ) : (
                <div className="container">
                    <div className="d-flex justify-content-between w-100 mt-5">
                        <Link to={`/job-detail-created?id=${data.jobsId}`} className="btn btn-success me-2 w-100  ">
                            Chi tiết công việc
                        </Link>
                        <Link
                            to={`/list-cadidate-apply?id=${data.jobsId}`}
                            className="btn btn-outline-success ms-2 w-100"
                            style={{ display: data.status === 1 || data.status === 4 || data.status === 6 ? "" : "none" }}
                        >
                            Danh sách ứng tuyển
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center" style={{ marginTop: "1em" }}>
                        <div className="col-xl-9 col-md-9 mb-5" style={{ border: "1px solid #ccc", borderRadius: "5px 0px 0px 5px", padding: "unset" }}>
                            <div className="d-flex justify-content-between  p-3" style={{ borderRadius: "5px 0px 0px 0px", backgroundColor: "#f2f2f2" }}>
                                <div className="fs-4 fw-bold m-0">{data.title}</div>
                            </div>
                            <div className="d-flex justify-content-between" style={{ border: "1px solid #ccc", padding: "0.5rem 0.5rem 0.5rem 1rem", borderLeft: "none", borderRight: "none" }}>
                                <div className="fw-bold d-flex align-items-center fs-7">
                                    <WorkIcon fontSize="small" className="me-2" />
                                    {data.typeJobs === "ONLINE" ? "Công việc trực tuyến" : "Công việc trực tiếp"}
                                    <CategoryIcon fontSize="small" className="ms-3 me-2" />
                                    {data.jobCategoryName}
                                    <LocationOnIcon fontSize="small" className="ms-3 me-2" />
                                    {data.typeJobs === "ONLINE" ? "Tất cả" : data.address}
                                </div>
                                <div className="d-flex align-items-center">
                                    <StatusJob status={data.status} />
                                </div>
                            </div>

                            <div style={{ border: "1px solid #ccc", padding: "0.5rem 0.5rem 0.5rem 1rem", borderLeft: "none", borderRight: "none", borderTop: "none" }}>
                                <div className="">
                                    <span className="fs-6 fw-bold">Nhận được: </span>
                                    <span className="fs-6 text-secondary ms-2">
                                        {data.money
                                            ? Number(data.money).toLocaleString("vi-VN", {
                                                  style: "currency",
                                                  currency: "VND",
                                              })
                                            : "0"}
                                    </span>
                                    <span className="fs-6 fw-bold ms-3">Cần thuê:</span>
                                    <span className="fs-6 text-secondary ms-2">{data.numberPerson}</span>

                                    <span className="fs-6 fw-bold ms-3">Thời gian:</span>
                                    <span className="fs-6 text-secondary ms-2">{data.workingTime} giờ</span>
                                </div>
                            </div>

                            {/* <h5 className="m-3">Các kỹ năng yêu cầu</h5>
                            <div className="m-3">
                                {data.skills.length > 0 ? (
                                    <div className="d-inline-block">
                                        {data.skills.map((skill, index) => (
                                            <span key={index} className="badge bg-success me-2 mb-2">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span>Chưa thiết lập</span>
                                )}
                            </div> */}

                            <hr className="m-2 dot" />

                            <h5 className="m-3">Tổng quan công việc</h5>
                            <div className="m-3">{data.job_Overview}</div>

                            <hr className="m-2 dot" />
                            <h5 className="m-3">Các kĩ năng và kinh nghiệm yêu cầu</h5>
                            <div className="m-3">{data.required_Skills}</div>

                            <hr className="m-2 dot" />
                            <h5 className="m-3">Các kĩ năng và công việc được ưu tiên</h5>
                            <div className="m-3">{data.preferred_Skills}</div>

                            <hr className="m-2 dot" />
                            <h5 className="m-3">Ghi chú</h5>
                            <div className="m-3">{data.noticeToJobSeeker}</div>

                            <div className="fw-bold" style={{ borderRadius: "0px 0px 0px 5px", backgroundColor: "#f2f2f2", padding: "0.5rem 0.5rem 0.5rem 1rem" }}>
                                ID: #{data.jobsId}
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-3 mb-5 justify-content-center" style={{ border: "1px solid #ccc", borderRadius: "0px 5px 5px 0px", borderLeft: "none", padding: "unset" }}>
                            <div className="p-2 justify-content-center">
                                {data.status === 1 || data.status === 3 ? null : (
                                    <div className="d-flex flex-column mt-3">
                                        {data.status === 2 || data.status === 0 ? (
                                            <Fragment>
                                                <button className="btn btn-outline-success w-100 mb-2" onClick={showModal}>
                                                    <EditIcon className="me-2" />
                                                    Chỉnh sửa bài đăng
                                                </button>
                                            </Fragment>
                                        ) : null}
                                    </div>
                                )}
                                {data.status === 1 || data.status === 6 ? (
                                    <>
                                        <button className="btn btn-outline-success w-100 mb-2" onClick={handleCompleteTask} disabled={data.status === 4}>
                                            <CheckOutlined className="me-2" />
                                            {data.status === 4 ? "Đã xác nhận hoàn thành" : "Xác nhận đã hoàn thành"}
                                        </button>
                                    </>
                                ) : null}
                                {data.status === 5 ? (
                                    <Fragment>
                                        <button className="btn btn-outline-success w-100 mb-2" onClick={showModal}>
                                            <EditIcon className="me-2" />
                                            Chỉnh sửa bài đăng
                                        </button>
                                        <button className="btn btn-outline-success w-100 mb-2" onClick={() => handlePostDraff(data.jobsId)}>
                                            <RetweetOutlined className="me-2" />
                                            Đăng công việc
                                        </button>
                                    </Fragment>
                                ) : null}
                            </div>
                        </div>
                        <Modal title="Chỉnh sửa bài đăng" open={isModalOpen} onCancel={handleCancel} width={1000} footer={null} destroyOnClose={true}>
                            <div hidden={isOnline}>
                                <EditJobOnline dataJob={data} isUpdateData={updateData} />
                            </div>
                            <div hidden={isOffline}>
                                <EditJobOffline dataJob={data} isUpdateData={updateData} />
                            </div>
                        </Modal>
                    </div>
                </div>
            )}
        </div>
    );
};

const EditJobOnline = ({ dataJob, isUpdateData }) => {
    const data = dataJob;

    const [formOnline] = Form.useForm();
    const [formOffline] = Form.useForm();

    const { Option } = Select;
    const [listCategorySkill, setListCategorySkill] = useState([]);
    const [listCategoryJob, setListCategoryJob] = useState([]);
    const [listSkillOnline, setListSkillOnline] = useState([]);
    const [listSkillOffline, setListSkillOffline] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobCategoryResponse = await request.get("JobsCategory/GetAll");
                setListCategoryJob(jobCategoryResponse.data.jobsCategory);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        request
            .get("Staff/SkillCategory/GetAll")
            .then((response) => {
                setListCategorySkill(response.data.skillsCategory);
                request
                    .get("Staff/Skill/GetAll", { params: { cate: data.skillCategoryId } })
                    .then((response) => {
                        setListSkillOnline(response.data.skills);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleNumberChange = (fieldName, value, form) => {
        if (value < 0) {
            const updatedValue = Math.abs(value);
            const updatedField = {};
            updatedField[fieldName] = updatedValue;
            form.setFieldsValue(updatedField);
        }
    };

    const changeCategorySkill = (value) => {
        request
            .get("Staff/Skill/GetAll", { params: { cate: value } })
            .then((response) => {
                setListSkillOnline(response.data.skills);
                formOnline.setFieldsValue({
                    listSkills: [],
                });
                setListSkillOffline(response.data.skills);
                formOffline.setFieldsValue({
                    listSkills: [],
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const onFinishOnline = (values) => {
        console.log(values);
        setLoading(true);
        var formData = {
            jobsId: data.jobsId,
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
            status: data.status === 5 ? data.status : 0,
            isGmail: true,
        };
        try {
            const token = localStorage.getItem("token");
            request
                .put("PostRecruitment/UpdateJobs", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thành công", [1.5]);
                        isUpdateData(true);
                        setLoading(false);
                        // Update data user
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <>
            <Form
                form={formOnline}
                name="recruitment-online"
                onFinish={onFinishOnline}
                layout="vertical"
                initialValues={{
                    title: data.title,
                    jobCategoryId: data.jobCategoryId,
                    skillCategoryId: data.skillCategoryId,
                    listSkills: data.skills,
                    money: data.money,
                    numberPerson: data.numberPerson,
                    overview: data.job_Overview,
                    required: data.required_Skills,
                    preferred: data.preferred_Skills,
                    notice: data.noticeToJobSeeker,
                    workingTime: data.workingTime,
                }}
            >
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
                            label="Số tiền"
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
                <Form.Item className="d-flex justify-content-end mb-0">
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
    );
};

const EditJobOffline = ({ dataJob, isUpdateData }) => {
    const data = dataJob;

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

    const { Option } = Select;
    const [listCategorySkill, setListCategorySkill] = useState([]);
    const [listCategoryJob, setListCategoryJob] = useState([]);
    const [listSkillOnline, setListSkillOnline] = useState([]);
    const [listSkillOffline, setListSkillOffline] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAddress(data.address);
        setlocation(data.location);
        const fetchData = async () => {
            try {
                const jobCategoryResponse = await request.get("JobsCategory/GetAll");
                setListCategoryJob(jobCategoryResponse.data.jobsCategory);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        request
            .get("Staff/SkillCategory/GetAll")
            .then((response) => {
                setListCategorySkill(response.data.skillsCategory);
                request
                    .get("Staff/Skill/GetAll", { params: { cate: data.skillCategoryId } })
                    .then((response) => {
                        setListSkillOnline(response.data.skills);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleNumberChange = (fieldName, value, form) => {
        if (value < 0) {
            const updatedValue = Math.abs(value);
            const updatedField = {};
            updatedField[fieldName] = updatedValue;
            form.setFieldsValue(updatedField);
        }
    };

    const changeCategorySkill = (value) => {
        request
            .get("Staff/Skill/GetAll", { params: { cate: value } })
            .then((response) => {
                setListSkillOffline(response.data.skills);
                formOffline.setFieldsValue({
                    listSkills: [],
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const onFinishOffline = (values) => {
        console.log(values);
        setLoading(true);
        var formData = {
            jobsId: data.jobsId,
            jobCategoryId: values.jobCategoryId,
            title: values.title,
            location: values.location,
            address: values.address,
            job_Overview: values.overview,
            required_Skills: values.required,
            preferred_Skills: values.preferred,
            noticeToJobSeeker: values.notice,
            workingTime: values.workingTime,
            money: parseInt(values.money),
            typeJobs: "OFFLINE",
            numberPerson: parseInt(values.numberPerson),
            listSkill: values.listSkills,
            status: data.status === 5 ? data.status : 0,
            isGmail: true,
        };
        try {
            const token = localStorage.getItem("token");
            request
                .put("PostRecruitment/UpdateJobs", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.message === "update_successful") {
                        message.success("Cập nhật thành công", [1.5]);
                        isUpdateData(true);
                        setLoading(false);
                        // Update data user
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <>
            <Form
                form={formOffline}
                name="recruitment-offline"
                onFinish={onFinishOffline}
                layout="vertical"
                initialValues={{
                    title: data.title,
                    jobCategoryId: data.jobCategoryId,
                    skillCategoryId: data.skillCategoryId,
                    listSkills: data.skills,
                    money: data.money,
                    numberPerson: data.numberPerson,
                    address: data.address,
                    location: data.location,
                    overview: data.job_Overview,
                    required: data.required_Skills,
                    preferred: data.preferred_Skills,
                    notice: data.noticeToJobSeeker,
                    workingTime: data.workingTime,
                }}
            >
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
                            label="Số tiền"
                            rules={[
                                {
                                    required: true,
                                    message: "Số tiền là bắt buộc",
                                },
                                { type: "integer", min: 1, message: "Số tiền phải lớn hơn 0" },
                            ]}
                        >
                            <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("money", value, formOffline)} />
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
                            <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("numberPerson", value, formOffline)} />
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
                            <InputNumber size="large" style={{ width: "100%" }} onChange={(value) => handleNumberChange("workingTime", value, formOffline)} />
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
                <Form.Item className="d-flex justify-content-end mb-0">
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
    );
};

export default JobDetail;
