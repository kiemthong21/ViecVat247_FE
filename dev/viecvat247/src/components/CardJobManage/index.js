import React from "react";
import { Link } from "react-router-dom";
import images from "~/assets/images";
import { utils } from "~/utils/utils";

function CardJobManage({ job }) {
    const url = `/job-detail-created?id=${job.jobsId}`;
    return (
        <>
            <Link to={url} className="text-decoration-none" style={{ color: "#333" }}>
                <div className="card-job">
                    <div className="row">
                        <div className="col-md-9">
                            <h3 className="fw-500 font-size-18 mb-1" style={{ color: "#02aa8a" }}>
                                {job.title}
                            </h3>
                            <ul className="nav align-items-center mb-2">
                                <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                    <i className="fa fa-folder-open" aria-hidden="true"></i> {job.jobCategoryName}
                                </li>
                                <li className="nav-item font-size-14 text-gray me-4 mb-2">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i> {job.typeJobs === "OFFLINE" ? job.address : "Tất cả"}
                                </li>
                            </ul>
                            <p className="font-size-14 mb-3">{utils.convertText(job.job_Overview, 100)}</p>
                            <div className="mb-2">
                                <div></div>
                            </div>
                            <ul className="nav align-items-center mb-2">
                                <li className="nav-item font-size-14 text-gray me-2 mb-2">
                                    <strong>Cần tuyển:</strong> <span>{job.numberPerson} người</span>
                                </li>
                                <li className="nav-item font-size-14 text-gray me-2 mb-2">
                                    <strong>|</strong>
                                </li>
                                <li className="nav-item font-size-14 text-gray me-2 mb-2">
                                    <strong>Số giờ:</strong> <span>{job.workingTime} tiếng</span>
                                </li>
                            </ul>
                            <ul className="nav align-items-center mb-2">
                                <li className="nav-item font-size-14 text-gray me-2 mb-2">
                                    <img src={images.default_avatar} className="avatar avatar-32 me-2" alt="" />
                                    <span>Đăng bởi</span> <strong>{job.jobAssignerName}</strong>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 position-relative">
                            <p className="font-size-24 text-gray-600 fw-bold mb-0">
                                {Number(job.money).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </p>
                            <p className="font-size-14 text-gray-500 mb-2">Giá theo từng người</p>
                            <span className="position-absolute bottom-0 end-0 me-4 mb-2">{utils.calculateTimeAgo(job.startDate)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default CardJobManage;
