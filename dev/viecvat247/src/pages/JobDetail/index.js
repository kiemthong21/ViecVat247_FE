import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "~/utils/request";
import LoadingIcon from "~/components/Loading";
import images from "~/assets/images";
import { Breadcrumb, Rate, message } from "antd";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";

import WorkIcon from "@mui/icons-material/Work";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const JobDetail = () => {
    const { user, isInitialized, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");

    // -----------------------------------------------------
    const [data, setData] = useState(null);
    const [assignerProfile, setAssignerProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isApply, setIsApply] = useState(false);

    useEffect(() => {
        if (firstLoad) {
            fetchData();
            setFirstLoad(false);
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(window.location.search);
            const id = queryParams.get("id");
            const token = localStorage.getItem("token");

            // Get job details
            const jobResponse = await request.get("PostRecruitment/getJobsById", { params: { jid: id } });
            setData(jobResponse.data);

            // Check apply job
            const checkApplyResponse = await request.get(`JobSeeker/CheckApplyJob/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (checkApplyResponse.data.message === "job_has_apply") {
                setIsApply(true);
            }

            // Get assigner profile
            const assignerResponse = await request.get(`Customer/GetProfileById/${jobResponse.data.jobAssignerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setAssignerProfile(assignerResponse.data);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response.status === 401) {
                logout();
            }
        }
    };

    const handleConfirmRequest = () => {
        const token = localStorage.getItem("token");
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn gửi yêu cầu tham gia công việc này không?");
        if (isConfirmed) {
            console.log("Gửi yêu cầu thành công!");

            try {
                request
                    .post(
                        "JobSeeker/ApplyJob",
                        { jobId: data.jobsId },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.message === "job_has_apply") {
                            message.warning("Bạn đã yêu cầu tham gia công việc này rồi!", [1.5]);
                        }
                        if (response.data.message === "please_update_profile") {
                            message.warning("Hãy cập nhật thông tin cá nhân!", [1.5]);
                        }
                        if (response.data.message === "apply_successful") {
                            message.success("Gửi yêu cầu thành công!", [1.5]);
                            setIsApply(true);
                        }

                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
                if (error.response.status === 401) {
                    logout();
                }
            }
        }
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
                        title: <a href="/jobs">Tìm việc</a>,
                    },
                    {
                        title: "Chi tiết công việc",
                    },
                ]}
            />
            {loading ? (
                <LoadingIcon />
            ) : (
                <>
                    <div className="container">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center" style={{ marginTop: "4em" }}>
                            <div
                                className="col-xl-9 col-md-9 mb-5"
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "5px 0px 0px 5px",
                                    padding: "unset",
                                }}
                            >
                                <div
                                    className="d-flex justify-content-between  p-3"
                                    style={{
                                        borderRadius: "5px 0px 0px 0px",
                                        backgroundColor: "#f2f2f2",
                                    }}
                                >
                                    <div className="fs-4 fw-bold m-0">{data.title}</div>
                                </div>
                                <div
                                    className="fw-bold d-flex align-items-center fs-7"
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "0.5rem 0.5rem 0.5rem 1rem",
                                        borderLeft: "none",
                                        borderRight: "none",
                                    }}
                                >
                                    <WorkIcon fontSize="small" className="me-2" />
                                    {data.typeJobs === "ONLINE" ? "Công việc trực tuyến" : "Công việc trực tiếp"}
                                    <CategoryIcon fontSize="small" className="ms-3 me-2" />
                                    {data.jobCategoryName}
                                    <LocationOnIcon fontSize="small" className="ms-3 me-2" />
                                    {data.typeJobs === "ONLINE" ? "Tất cả" : data.address}
                                </div>
                                <div
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "0.5rem 0.5rem 0.5rem 1rem",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        borderTop: "none",
                                    }}
                                >
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

                                <h5 className="m-3">Tổng quan về công việc</h5>
                                <div className="m-3">{data.job_Overview}</div>

                                <hr className="m-2 dot" />
                                <h5 className="m-3">Yêu cầu</h5>
                                <div className="m-3">{data.required_Skills}</div>

                                <hr className="m-2 dot" />
                                <h5 className="m-3">Ưu tiên</h5>
                                <div className="m-3">{data.preferred_Skills}</div>

                                <hr className="m-2 dot" />
                                <h5 className="m-3">Chú ý</h5>
                                <div className="m-3">{data.noticeToJobSeeker}</div>

                                <div className="fw-bold" style={{ borderRadius: "0px 0px 0px 5px", backgroundColor: "#f2f2f2", padding: "0.5rem 0.5rem 0.5rem 1rem" }}>
                                    ID: #{data.jobsId}
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 mb-5 justify-content-center" style={{ border: "1px solid #ccc", borderRadius: "0px 5px 5px 0px", borderLeft: "none", padding: "unset" }}>
                                <div className="p-2 justify-content-center">
                                    {user.roleid === 2 && (
                                        <div className="d-flex flex-column mt-3">
                                            <button className="btn btn-outline-success w-100 mb-2">Lưu công việc</button>
                                            <span className="text-center">Hoặc</span>
                                            <button className="btn btn-success w-100 mt-2" onClick={handleConfirmRequest} disabled={isApply}>
                                                {isApply ? "Đã gửi yêu cầu" : "Gửi yêu cầu"}
                                            </button>
                                            <hr className="m-2 dot" />
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <div className="fs-6 m-3 fw-bold">NGƯỜI ĐĂNG:</div>
                                        {assignerProfile && (
                                            <div className="m-3">
                                                <div className="d-flex flex-wrap align-items-center">
                                                    <img
                                                        src={assignerProfile.avatar ? assignerProfile.avatar : images.default_image}
                                                        alt=""
                                                        className="img-fluid me-3"
                                                        style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid black" }}
                                                    />
                                                    <div className="text-left fw-bold fs-6">
                                                        <span>{assignerProfile.fullName}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 d-flex align-items-center">
                                                    <span className="me-2 fw-bold">Địa chỉ:</span>
                                                    {assignerProfile.address}
                                                </div>
                                                <div className="mt-2 d-flex align-items-center">
                                                    <span className="me-2 fw-bold">Đánh giá:</span>
                                                    <Rate disabled defaultValue={assignerProfile.voting && assignerProfile.voting > 0 ? assignerProfile.voting : 0} />
                                                </div>
                                                <div className="mt-2 d-flex align-items-center">
                                                    <span className="me-2 fw-bold">Việc đã đăng:</span>
                                                    {assignerProfile.numberJobs}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="container p-0">
                        <div className="row ms-0 me-0 shadow-md mb-8">
                            <div className="col-lg-9 col-md-8 pl-0 pr-0">
                                <div className="card h-100" style={boxShadowUnset}>
                                    <div className="card-header d-flex align-items-center pt-4 pb-4 pl-10 pr-10 border-bottom">
                                        <h1 className="h5 m-0">Tuyển gấp nhân viên vận hành phần mềm ( làm việc online) LƯƠNG CAO</h1>
                                        <div className="ms-3">
                                            <a href="/" target="_blank">
                                                <img style={{ width: "24px" }} src="https://staticfvvn.s3-ap-southeast-1.amazonaws.com/fv4tmpl/default/img/icon-sharing-facebook.png" alt="" />
                                            </a>
                                            <a href="/" target="_blank">
                                                <img style={{ width: "24px" }} src="https://staticfvvn.s3-ap-southeast-1.amazonaws.com/fv4tmpl/default/img/icon-sharing-linkedin.png" alt="" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <ul className="nav align-items-center pl-10 pr-10 pt-2 border-bottom">
                                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                                <i className="fa fa-folder-open" aria-hidden="true"></i> Quảng Cáo/ Truyền Thông/ PR
                                            </li>
                                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i> Tất cả
                                            </li>
                                        </ul>
                                        <ul className="nav align-items-center mb-2 pl-10 pr-10 pt-13 border-bottom">
                                            <li className="nav-item font-size-14 text-gray me-2 mb-13">
                                                <span className="font-size-24 fw-bold text-gray-600">₫7,000,000</span>
                                                <span className="font-size-14 text-gray-500">Giá theo dự án</span>
                                            </li>
                                            <li className="nav-item mb-13 me-2">
                                                <span className="nav-item-divider style-3 ms-2 me-2"></span>
                                            </li>
                                            <li className="nav-item font-size-14 text-gray me-2 mb-13">
                                                <strong>Kinh nghiệm:</strong> <span>1 - 2 năm</span>
                                            </li>
                                            <li className="nav-item mb-13 me-2">
                                                <span className="nav-item-divider style-3 ms-2 me-2"></span>
                                            </li>
                                            <li className="nav-item font-size-14 text-gray me-2 mb-13">
                                                <strong>Báo giá:</strong> <span className="text-primary">0</span>
                                            </li>
                                        </ul>
                                        <div className="pl-10 pr-10 pt-4 pb-4 border-bottom">
                                            <h3 className="font-size-16 mb-3">Yêu cầu công việc</h3>
                                            <div className="font-size-14">
                                                MÔ TẢ CÔNG VIỆC​
                                                <br />
                                                <br />
                                                Làm việc trên exel online
                                                <br />
                                                <br />
                                                Lấy data
                                                <br />
                                                <br />
                                                Kiểm tra &amp; giao cho khách
                                                <br />
                                                <br />
                                                2. Vận hành phần mềm auto ( telegram auto send mess)
                                                <br />
                                                <br />
                                                Build group
                                                <br />
                                                <br />
                                                Send tin nhắn
                                                <br />
                                                <br />
                                                3. Các công việc cấp trên giao
                                                <br />
                                                <br />
                                                Thời gian làm việc
                                                <br />
                                                <br />
                                                Sáng : 8-11h
                                                <br />
                                                <br />
                                                Chiều : 2-5h
                                                <br />
                                                <br />
                                                Tối 9-11h
                                                <br />
                                                <br />
                                                II/QUYỀN LỢI
                                                <br />
                                                <br />
                                                Thu nhập
                                                <br />
                                                <br />
                                                Lương cứng 6tr
                                                <br />
                                                <br />
                                                Thưởng 2tr nếu hàng ngày không làm việc muộn
                                                <br />
                                                <br />
                                                ( dù làm online nhưng vẫn cần trực đúng giờ )<br />
                                                <br />
                                                Thưởng 1-2tr theo doanh số cty
                                                <br />
                                                <br />
                                                Tổng thu nhập tới 10tr mà làm việc online tương ứng suất lương 15tr/tháng
                                                <br />
                                                <br />
                                                III/YÊU CẦU
                                                <br />
                                                <br />
                                                Nam/Nữ
                                                <br />
                                                <br />
                                                Tuổi 20-27
                                                <br />
                                                <br />
                                                Có máy tính
                                                <br />
                                                <br />
                                                Sử dụng thành thạo các kỹ năng máy tính cơ bản ( gõ văn bản, sử dụng các phần mềm )<br />
                                                <br />
                                                Chủ động
                                                <br />
                                                <br />
                                                Nhanh nhẹn
                                                <br />
                                                <br />
                                                Chăm chỉ
                                                <br />
                                                <br />
                                                Chú ý : đây là công việc không cần trình độ cao mà thu nhập cao &amp; ổn định. Chúng tôi cần tìm người làm lâu dài
                                                <br />
                                                <br />
                                                Trả lương theo ngày/tuần và nói không với mấy lừa đảo vớ vẩn
                                                <br />
                                                <br />
                                                Không phải ứng bất cứ khoản chi phí nào
                                            </div>
                                        </div>
                                        <div className="pl-10 pr-10 pt-4 pb-4">
                                            <div className="font-size-14 mb-3">
                                                <strong>Lĩnh vực:</strong> Tiếp Thị/ Truyền Thông/ Media/Quảng Cáo/ Truyền Thông/ PR
                                            </div>
                                            <div className="font-size-14 mb-3">
                                                <strong>Thời gian công việc:</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer font-size-14">
                                        <strong>ID: #202312150003</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 pl-0 pr-0 bg-white border-left">
                                <div className="card p-4 h-100">
                                    <div className="">
                                        <div className="card-body p-0">
                                            <a
                                                href="https://freelancerviet.vn/dang-nhap.html?r=https%3A%2F%2Ffreelancerviet.vn%2Fthong-tin-viec-freelance%2Ftuyen-gap-nhan-vien-van-hanh-phan-mem-lam-viec-online-luong-cao.html"
                                                className="btn btn-primary btn-block shadow-sm"
                                            >
                                                Gửi báo giá
                                            </a>

                                            <p className="mt-3 mb-3 text-center text-gray">Hoặc</p>
                                            <a href="/" data-params-project="202312150003" className="btn btn-outline-primary btn-block shadow-sm btn-save-project">
                                                Lưu công việc
                                            </a>
                                        </div>
                                    </div>
                                    <hr className="mt-4 mb-4" />
                                    <div className=" bg-transparent">
                                        <h3 className="card-header p-0 font-size-16 fw-500 bg-transparent mb-3">Khách hàng</h3>
                                        <div className="card-body bg-transparent p-0">
                                            <p className="font-size-14">
                                                <img
                                                    src="https://staticfvvn.s3-ap-southeast-1.amazonaws.com/fv4tmpl/default/img/default-avatar.png"
                                                    className="avatar avatar-32 me-1"
                                                    alt="Khánh Hoàng"
                                                />
                                                <strong>Khánh Hoàng</strong>
                                            </p>
                                            <p className="font-size-14 text-gray mb-2">
                                                <i className="fa fa-map-marker"></i> Viet Nam
                                            </p>
                                            <div className="rating-wrap mb-3">
                                                <div className="rating-container rating-xs rating-animate rating-disabled">
                                                    <div className="rating">
                                                        <span className="empty-stars">
                                                            <span className="star">
                                                                <i className="fa fa-star-o"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star-o"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star-o"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star-o"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star-o"></i>
                                                            </span>
                                                        </span>
                                                        <span className="filled-stars" style={{ width: "0%" }}>
                                                            <span className="star">
                                                                <i className="fa fa-star"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star"></i>
                                                            </span>
                                                            <span className="star">
                                                                <i className="fa fa-star"></i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <input type="hidden" className="input-rating hide" data-size="xs" disabled="disabled" data-show-clear="false" data-show-caption="false" value="0" />
                                                </div>
                                                <span className="text-gray font-size-14">0/0 đánh giá</span>
                                            </div>
                                            <p className="font-size-14">
                                                <strong>Việc đã đăng:</strong> <span>1</span> <br />
                                                <span className="text-gray">1 việc đang nhận báo giá</span>
                                            </p>
                                            <p className="font-size-14">
                                                <strong>Đã chi trả:</strong> <span>₫0</span> <br />
                                                <span className="text-gray">0 đã tuyển</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div
                                            className="fb-page fb_iframe_widget"
                                            data-href="https://www.facebook.com/freelancerviet.official"
                                            data-tabs=""
                                            data-width="500"
                                            data-height=""
                                            data-small-header="true"
                                            data-adapt-container-width="true"
                                            data-hide-cover="false"
                                            data-show-facepile="true"
                                            fb-xfbms-state="rendered"
                                            fb-iframe-plugin-query="adapt_container_width=true&amp;app_id=298590760253178&amp;container_width=244&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2Ffreelancerviet.official&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=true&amp;tabs=&amp;width=500"
                                        >
                                            <span style={{ verticalAlign: "bottom", width: "0px", height: "0px" }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-md">
                            <div className="card-header pt-4 pb-4 pl-10 pr-10 border-bottom">
                                <h1 className="h5 m-0">Công việc tương tự</h1>
                            </div>
                            <div className="card-body p-0">
                                <div className="card card-border-bottom card-hover">
                                    <div className="card-body p-10">
                                        <h3 className="fw-500 font-size-18 mb-1">
                                            <a href="https://freelancerviet.vn/thong-tin-viec-freelance/photo-editing-and-resize-photos.html" className="text-primary">
                                                photo editing and resize photos
                                            </a>
                                        </h3>
                                        <ul className="nav align-items-center mb-2">
                                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                                <i className="fa fa-folder-open" aria-hidden="true"></i> Quảng Cáo/ Truyền Thông/ PR
                                            </li>
                                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i> Tất cả
                                            </li>
                                            <li className="nav-item font-size-14 text-gray me-4 mb-2">Đã đăng cách đây 4 ngày</li>
                                        </ul>
                                        <p className="font-size-14 mb-3">
                                            I am looking for&nbsp; photo editor who can help me remove the background dressing photos and resize the image , attach are resizing photo sample
                                            <a href="https://freelancerviet.vn/thong-tin-viec-freelance/photo-editing-and-resize-photos.html" className="text-primary fw-bold">
                                                Xem thêm
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </div>
    );
};

export default JobDetail;
