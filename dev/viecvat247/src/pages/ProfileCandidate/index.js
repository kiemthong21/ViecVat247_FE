import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "~/utils/AuthContext";
import request from "~/utils/request";
import useAuthorization from "~/utils/useAuthorization";
import LoadingIcon from "~/components/Loading";
import { Avatar, Col, Divider, Pagination, Rate, Row } from "antd";
import images from "~/assets/images";
import { utils } from "~/utils/utils";
import CardFeedback from "~/components/CardFeedback";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { MessageOutlined } from "@ant-design/icons";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

const ProfileCandidate = () => {
    useEffect(() => {
        document.title = "Thông tin ứng viên - Viecvat247";
        const fbRoot = document.getElementById("fb-root");
        if (fbRoot) {
            fbRoot.style.display = "none";
        }
    }, []);

    // ------------------------------------------------------
    const { user, isInitialized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    });

    useAuthorization([1, 2], "/");
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [messageError, setMessageError] = useState(null);
    const [numberFeedbackResponse, setNumberFeedbackResponse] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const profileResponse = await request.get("Customer/GetProfileById/" + id);
            console.log(profileResponse.data);

            if (profileResponse.data.message === "user_not_exist") {
                setMessageError("Không có thông tin về ứng viên này!");
            } else {
                setData(profileResponse.data);
            }

            const numberFeedbackResponse = await request.get("Report/GetNumberFeedbackByCid?cid=" + id);
            setNumberFeedbackResponse(numberFeedbackResponse.data.numberFeedback);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setMessageError("Không có thông tin về ứng viên này!");
            console.error("Error fetching data:", error);
        }
    };

    const [feedbackData, setFeedbackData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const handlePagination = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataFeedback = async () => {
            try {
                const profileFeedback = await request.get("Report/GetFeedbacksByCid", {
                    params: {
                        cid: id,
                        pageIndex: currentPage,
                        pageSize: 5,
                    },
                });
                setFeedbackData(profileFeedback.data.jobs);
                setTotalPage(profileFeedback.data.totalItems);

                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchDataFeedback();
    }, [currentPage]);

    return (
        <>
            {loading ? (
                <LoadingIcon />
            ) : (
                <>
                    {isInitialized && data ? (
                        <div>
                            <div className="fs-5 fw-bold mb-3 mt-5">Thông tin ứng viên</div>
                            <div className="border rounded p-2 pb-3 mb-5">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <Avatar
                                            src={data.avatar && utils.isValidImageUrl(data.avatar) ? data.avatar : images.avatar.default}
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
                                            {/* <div className=" mt-2">
                                                <button className="btn btn-success btn-sm w-100 mb-2" onClick={() => alert("Đây là ID của ứng viên: " + data.cid)}>
                                                    <MessageOutlined className="me-2" />
                                                    Nhắn tin với ứng viên
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <div className="ms-3">
                                    {/* <div>
                                        <span className="fw-bold">Địa chỉ email:</span> {data.cemail ? data.cemail : "Chưa thiết lập"}
                                    </div>
                                    <div>
                                        <span className="fw-bold">Số điện thoại:</span> {data.phoneNumber ? data.phoneNumber : "Chưa thiết lập"}
                                    </div> */}
                                    <div>
                                        <span className="fw-bold">Ngày sinh:</span> {data.dob ? dayjs(data.dob).format(dateFormat) : "Chưa thiết lập"}
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
                            <section className="py-3">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        {loading ? (
                                            <LoadingIcon />
                                        ) : (
                                            <Fragment>
                                                <div className="border border-1 rounded">
                                                    <div className="p-3 py-3 rounded-top fw-bold d-flex align-items-center border-bottom">
                                                        <div className="fs-6">Đánh giá</div>
                                                    </div>
                                                    {feedbackData.length > 0 ? (
                                                        <>
                                                            {feedbackData.map((item, index) => (
                                                                <CardFeedback key={index} job={item} />
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <div className="text-center mt-4 fs-6">Không có kết quả nào</div>
                                                    )}
                                                    <div className="p-2 py-3 text-center rounded-bottom">
                                                        {feedbackData.length && totalPage > 0 ? (
                                                            <Pagination current={currentPage} onChange={handlePagination} total={totalPage} defaultPageSize={5} />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )}
                                    </Col>
                                </Row>
                            </section>
                        </div>
                    ) : (
                        <div>{messageError}</div>
                    )}
                </>
            )}
        </>
    );
};

export default ProfileCandidate;
