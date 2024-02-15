import React, { Fragment, useEffect, useState } from "react";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import request from "~/utils/request";
import jwtDecode from "jwt-decode";
import LoadingIcon from "~/components/Loading";
import images from "~/assets/images";
import { Breadcrumb, Tag, message } from "antd";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";

import WorkIcon from "@mui/icons-material/Work";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import { CheckOutlined, CloseCircleOutlined, DeleteOutlined, MessageOutlined } from "@ant-design/icons";
import { Timestamp, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "~/firebase/config";
import Swal from "sweetalert2";
import firebase, { auth } from "~/firebase/config";
import { v4 as uuid } from "uuid";

const googleProvider = new firebase.auth.GoogleAuthProvider();
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
    useAuthorization([2], "/");

    const [data, setData] = useState(null);
    const [assignerProfile, setAssignerProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [firstLoad, setFirstLoad] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (firstLoad) {
            const queryParams = new URLSearchParams(window.location.search);
            const id = queryParams.get("id");
            try {
                request
                    .get("JobSeeker/GetJobDetail/" + id, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                    .then((res) => {
                        setData(res.data);
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
            } catch (error) {
                if (error.response.status === 401) {
                    logout();
                }
            }
            setFirstLoad(false);
        }
    }, [firstLoad]);

    const handleChat = async () => {
        connectionMessage();
    };

    const connectionMessage = async () => {
        var scurrentUser;
        var suser;
        var semail;
        await fetch("https://api.viecvat247.com/api/Customer/UserProfile", {
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
            .then((data) => {
                semail = data.cemail;
            })
            .catch((error) => console.error("Lỗi khi gọi API:", error));

        await db
            .collection("users")
            .where("email", "==", semail)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log("doc", doc);
                    scurrentUser = {
                        displayName: doc.data().displayName,
                        email: doc.data().email,
                        photoURL: doc.data().photoURL,
                        uid: doc.data().uid,
                    };
                });
            })
            .catch((e) => {
                console.log(e);
            });
        await db
            .collection("users")
            .where("email", "==", data?.jobAssignerEmail)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    suser = {
                        displayName: doc.data().displayName,
                        email: doc.data().email,
                        photoURL: doc.data().photoURL,
                        uid: doc.data().uid,
                    };
                });
            })
            .catch((e) => {
                console.log(e);
            });
        if (!scurrentUser) {
            await auth
                .signInWithPopup(googleProvider)
                .then(function (result) {
                    // Check if the signed-in user's email matches the allowed email
                    if (result.user.email === semail) {
                        // User is allowed to sign in
                        scurrentUser = {
                            uid: result.user.uid,
                            displayName: result.user.displayName,
                            email: result.user.email,
                            photoURL: result.user.photoURL,
                        };
                        console.log("Sign-in successful");
                    } else {
                        // Sign out the user if the email doesn't match
                        auth.signOut();
                        console.log("Unauthorized email. Sign-in aborted.");
                    }
                })
                .catch(function (error) {
                    // Handle errors
                    console.error("Sign-in error:", error);
                });
        }
        if (!suser) {
            message.warning("user chưa kết nối message");
            return;
        }
        //check whether the group(chats in firestore) exists, if not create
        const combinedId = scurrentUser.uid > suser.uid ? scurrentUser.uid + suser.uid : suser.uid + scurrentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            console.log("res", res.exists());
            /// add default message messsage
            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), {
                    messages: [
                        {
                            id: uuid(),
                            text: "Chào bạn!",
                            senderId: scurrentUser.uid,
                            date: Timestamp.now(),
                        },
                    ],
                });

                //create user chats
                await updateDoc(doc(db, "userChats", scurrentUser?.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: suser?.uid,
                        displayName: suser?.displayName,
                        photoURL: suser?.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", suser?.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: scurrentUser?.uid,
                        displayName: scurrentUser?.displayName,
                        photoURL: scurrentUser?.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            console.log(err);
        }
        navigate(`/login-with-chat?id=${combinedId}`);
    };

    const handleDoneTask = async () => {
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
                        .put(`JobSeeker/SetDone/${data.aid}`, null, {
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
                            if (response.data.message === "not_found") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Công việc này không tồn tại",
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

    const handleCancelJob = async () => {
        checkExpires();
        Swal.fire({
            title: "Bạn có chắc?",
            text: "Muốn xác nhận hủy ứng tuyển công việc này không?",
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
                        .post(`JobSeeker/CancelJob/${data.aid}`, null, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((response) => {
                            if (response.data.message === "delete_successfull") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THÀNH CÔNG",
                                    text: "Đã hủy ứng tuyển công việc thành công",
                                    icon: "success",
                                });
                                navigate(`/my-jobs-apply`);
                            }
                            if (response.data.message === "can_not_delete") {
                                setLoading(false);
                                setFirstLoad(true);
                                Swal.fire({
                                    title: "THAO TÁC THẤT BẠI",
                                    text: "Bạn đã được ứng tuyển vào công việc này thành công",
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

    return (
        <div>
            <Breadcrumb
                className="mt-4"
                items={[
                    {
                        title: "Trang chủ",
                    },
                    {
                        title: <a href="/my-jobs-apply">Việc đang thực hiện</a>,
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
                        <Link to={`/job-detail-apply?id=${data.aid}`} className="btn btn-success me-2 w-100  ">
                            Chi tiết công việc
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center" style={{ marginTop: "1em" }}>
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
                                className="d-flex justify-content-between"
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "0.5rem 0.5rem 0.5rem 1rem",
                                    borderLeft: "none",
                                    borderRight: "none",
                                }}
                            >
                                <div className="fw-bold d-flex align-items-center fs-7">
                                    <WorkIcon fontSize="small" className="me-2" />
                                    {data.typeJobs === "ONLINE" ? "Công việc trực tuyến" : "Công việc trực tiếp"}
                                    <CategoryIcon fontSize="small" className="ms-3 me-2" />
                                    {data.jobCategoryName}
                                    <LocationOnIcon fontSize="small" className="ms-3 me-2" />
                                    {data.typeJobs === "ONLINE" ? "Tất cả" : data.address}
                                </div>
                                <div className="d-flex align-items-center">
                                    <StatusJob status={data.applyStatus} />
                                </div>
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

                            <div
                                className="fw-bold"
                                style={{
                                    borderRadius: "0px 0px 0px 5px",
                                    backgroundColor: "#f2f2f2",
                                    padding: "0.5rem 0.5rem 0.5rem 1rem",
                                }}
                            >
                                ID: #{data.jobsId}
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-md-3 mb-5 justify-content-center"
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "0px 5px 5px 0px",
                                borderLeft: "none",
                                padding: "unset",
                            }}
                        >
                            <div className="p-2 justify-content-center">
                                <div className="d-flex flex-column mt-3">
                                    {data.applyStatus === 1 || data.applyStatus === 2 ? (
                                        <Fragment>
                                            <button onClick={handleChat} className="btn btn-outline-success w-100 mb-2">
                                                <MessageOutlined className="me-2" />
                                                Nhắn tin với người thuê
                                            </button>
                                            <button onClick={handleDoneTask} className="btn btn-outline-success w-100 mb-2" disabled={data.applyStatus === 2}>
                                                <CheckOutlined className="me-2" />
                                                {data.applyStatus === 2 ? "Đã xác nhận hoàn thành" : "Xác nhận đã hoàn thành"}
                                            </button>
                                        </Fragment>
                                    ) : null}
                                    {data.applyStatus === 0 ? (
                                        <>
                                            <button onClick={handleCancelJob} className="btn btn-outline-success w-100 mb-2 d-flex align-items-center text-center">
                                                <CloseCircleOutlined className="me-2" />
                                                Hủy ứng tuyển
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;
