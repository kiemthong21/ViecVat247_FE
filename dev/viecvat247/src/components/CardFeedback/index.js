import { Rate } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import images from "~/assets/images";
import { utils } from "~/utils/utils";
function CardFeedback({ job }) {
    const url = `/job-detail?id=${job.jobId}`;
    return (
        <>
            <div className="card-job" style={{ color: "#333" }}>
                <div className="row">
                    <div className="col-md-9">
                        <h3 className="fw-500 font-size-18 mb-1" style={{ color: "#02aa8a" }}>
                            <Link className="text-decoration-none" style={{ color: "#02aa8a" }} to={url}>
                                {job.jobName}
                            </Link>
                        </h3>
                        <ul className="nav align-items-center mb-2">
                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                <span className="d-flex align-items-center flex-wrap">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <span className="me-2">{job.voting && job.voting > 0 ? job.voting : 0}</span>
                                        <Rate key={job.jobId} disabled defaultValue={job.voting && job.voting > 0 ? job.voting : 0} />
                                    </div>
                                </span>
                            </li>
                        </ul>
                        <p className="font-size-14 mb-3">{job.feedback}</p>

                        <ul className="nav align-items-center mb-2">
                            <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                <span className="fw-bold">Kỹ năng:</span>{" "}
                                {job.skillName.length > 0 ? (
                                    <div className="d-inline-block">
                                        {job.skillName.map((skill, index) => (
                                            <span key={index} className="badge bg-success me-2 mb-2">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span>Chưa thiết lập</span>
                                )}
                            </li>
                        </ul>

                        <ul className="nav align-items-center mb-2">
                            <li className="nav-item font-size-14 text-gray me-2 mb-2">
                                <img src={images.default_avatar} className="avatar avatar-32 me-2" alt="" />
                                <span>Đánh giá bởi</span>{" "}
                                <strong>
                                    {/* <Link target="_blank" className="text-decoration-none" style={{ color: "#333" }} to={`/profile-candidate/${job.jobAssignerId}`}>
                                        {job.jobAssignerName}
                                    </Link> */}
                                    {job.jobAssignerName}
                                </strong>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3 position-relative">
                        <p className="font-size-24 text-gray-600 fw-bold mb-0 text-md-end">
                            {Number(job.money).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </p>
                        <span className="position-absolute bottom-0 end-0 me-4 mb-2">{utils.calculateTimeAgo(job.endDate)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardFeedback;
