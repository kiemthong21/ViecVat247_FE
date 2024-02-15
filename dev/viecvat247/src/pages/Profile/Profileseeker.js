import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
const Profileseeker = () => {
    const [userInfo, setUserInfo] = useState({
        cemail: "",
        username: "",
        phoneNumber: "",
        fullName: "",
        address: "",
        avatar: "",
        createDate: "",
        updateDate: "",
    });

    useEffect(() => {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        // Kiểm tra xem có token hay không
        if (!token) {
            // Xử lý trường hợp không có token, có thể đăng xuất người dùng hoặc thực hiện hành động khác tùy thuộc vào yêu cầu của bạn.
            console.error("Không tìm thấy token, hãy xử lý trường hợp này.");
            return;
        }
        fetch("https://api.viecvat247.com/api/Customer/UserProfile", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong tiêu đề Authorization
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    // Xử lý trường hợp token hết hạn hoặc không hợp lệ
                    console.error("Token hết hạn hoặc không hợp lệ, hãy xử lý trường hợp này.");
                } else {
                    return response.json();
                }
            })
            .then((data) => setUserInfo(data))
            .catch((error) => console.error("Lỗi khi gọi API:", error));
    }, []);
    return (
        <div className="container">
            <div className="profile">
                <h3 className="profile-tag">Job Seeker Profile</h3>
                <div className="row">
                    <div className="col-md-6 mt-1">
                        <div className="card text-center sidebar">
                            <div className="card-body">
                                <img src="image.jpg" alt="" className="rounded-circle" width="150" />
                                <div className="mt-3">
                                    <h3>MY CV</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-1">
                        <div className="card mb-3 content">
                            <div className="row mt-md-3 ms-md-2">
                                <div className="col-md-2">
                                    <img src="image.jpg" alt="" className="rounded-circle" width="150" />
                                </div>
                                <div className="col-md-7">
                                    <p>{userInfo.username}</p>
                                    <p>Level 1 | Job Seeker ID:</p>
                                </div>
                                <div className="col-md-3 ps-md-5">
                                    <button type="button" id="hireBtn" className="btn btn-outline-success">
                                        <i className="bi bi-pencil-square"></i> Edit
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-9">
                                        <h5>
                                            <i className="bi bi-calendar2"></i> Date of Birth
                                        </h5>
                                    </div>
                                    <div className="col-md-3 ps-md-5 text-secondary">{userInfo.createDate}</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h5>
                                            <i className="bi bi-envelope"></i> Email
                                        </h5>
                                    </div>
                                    <div className="col-md-3 text-secondary">{userInfo.cemail}</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h5>
                                            <i className="bi bi-telephone"></i> Phone
                                        </h5>
                                    </div>
                                    <div className="col-md-3 ps-md-4 text-secondary">{userInfo.phoneNumber}</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h5>
                                            <i className="bi bi-geo-alt"></i> Location
                                        </h5>
                                    </div>
                                    <div className="col-md-3 text-secondary">{userInfo.address}</div>
                                </div>
                            </div>
                            <hr className="mt-1" />
                            <div className="card-body">
                                <div className="col mb-md-5">
                                    <div className="col-md-3">
                                        <h5>Description</h5>
                                    </div>
                                    <div className="col-md-9 text-secondary">Descriptionnnn</div>
                                </div>
                                <div className="col">
                                    <div className="col-md-3">
                                        <h5>Skill</h5>
                                    </div>
                                    <div className="col-md-9 text-secondary">IT, Blockchain Software</div>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 content">
                            <h5 className="m-3"> Job Received </h5>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5>
                                            <i className="bi bi-clock"></i> Take care of pets
                                        </h5>
                                        <p className="text-secondary Profile-description">Description</p>
                                    </div>
                                    <div className="col-md-4 ps-md-5 text-secondary">Aug 3 2022, 14:59</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5>
                                            <i className="bi bi-clock"></i> IT View
                                        </h5>
                                        <p className="text-secondary Profile-description">Description</p>
                                    </div>
                                    <div className="col-md-4 ps-md-5 text-secondary">Aug 3 2022, 14:59</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5>
                                            <i className="bi bi-clock"></i> ABC
                                        </h5>
                                        <p className="text-secondary Profile-description">Description</p>
                                    </div>
                                    <div className="col-md-4 ps-md-5 text-secondary">Aug 3 2022, 14:59</div>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 content">
                            <h5 className="m-3">Rating</h5>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 rating">
                                        <img src="../rating.svg" alt="Rating" />
                                    </div>
                                    <div className="col-md-4 mt-md-4 text-secondary">0.0 (0 Reviews)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-button">
                    <button type="button" className="btn btn-success">
                        Back
                    </button>
                    <button type="button" className="btn btn-outline-success">
                        <LinkContainer to="/changepassword">
                            <Nav.Link>Change Password</Nav.Link>
                        </LinkContainer>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Profileseeker;
