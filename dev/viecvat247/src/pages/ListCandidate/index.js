import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import request from "~/utils/request";
import LoadingIcon from "~/components/Loading";
import images from "~/assets/images";
import { Breadcrumb, Button, Divider, Form, Input, Modal, Rate, Tag, message } from "antd";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";

import { db } from "~/firebase/config";
import { Timestamp, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import firebase, { auth } from "~/firebase/config";
import Swal from "sweetalert2";
import { MessageOutlined } from "@ant-design/icons";

const googleProvider = new firebase.auth.GoogleAuthProvider();

function StatusJob({ status }) {
    switch (status) {
        case 0:
            return (
                <>
                    <Tag color="orange">Wait for approval</Tag>
                </>
            );
        case 1:
            return (
                <>
                    <Tag color="green">Approve</Tag>
                </>
            );
        case 2:
            return (
                <>
                    <Tag color="red">Pending</Tag>
                </>
            );
        case 3:
            return (
                <>
                    <Tag color="blue ">Reject</Tag>
                </>
            );
        case 4:
            return (
                <>
                    <Tag color="black ">Complete</Tag>
                </>
            );
        default:
            return <></>;
    }
}
const isValidImageUrl = (url) => {
    const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
    return imageUrlRegex.test(url);
};

const ListCandidate = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const { user, isInitialized } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1], "/");

    const [data, setData] = useState(null);
    const [listCandidateAccept, setListCandidateAccept] = useState(null);
    const [listCandidateNotAccept, setListCandidateNotAccept] = useState(null);
    const [listCandidateReject, setListCandidateReject] = useState(null);
    const [listCandidateComplete, setListCandidateComplete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const jobResponse = await request.get("PostRecruitment/getJobsById", { params: { jid: id } });
            setData(jobResponse.data);

            const candidateResponseAccept = await request.get(`JobAssigner/ListCandidate/${id}`, {
                params: { status: 1 },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setListCandidateAccept(candidateResponseAccept.data.customers);

            const candidateResponseNotAccept = await request.get(`JobAssigner/ListCandidate/${id}`, {
                params: { status: 0 },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setListCandidateNotAccept(candidateResponseNotAccept.data.customers);

            const candidateResponseReject = await request.get(`JobAssigner/ListCandidate/${id}`, {
                params: { status: 3 },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setListCandidateReject(candidateResponseReject.data.customers);

            const candidateResponseComplete = await request.get(`JobAssigner/ListCandidate/${id}`, {
                params: { status: 2 },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setListCandidateComplete(candidateResponseComplete.data.customers);

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
                        title: "Danh sách ứng tuyển",
                    },
                ]}
            />
            {loading ? (
                <LoadingIcon />
            ) : (
                <div className="container">
                    <div className="d-flex justify-content-between w-100 mt-5">
                        <Link to={`/job-detail-created?id=${data.jobsId}`} className="btn btn-outline-success me-2 w-100  ">
                            Chi tiết công việc
                        </Link>
                        <Link to={`/list-cadidate-apply?id=${data.jobsId}`} className="btn btn-success ms-2 w-100">
                            Danh sách ứng tuyển
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center" style={{ marginTop: "1em" }}>
                        <div className="col-xl-12 col-md-12 mb-5" style={{ border: "1px solid #ccc", borderRadius: "5px 0px 0px 5px", padding: "unset" }}>
                            <div className="d-flex justify-content-between  p-3" style={{ borderRadius: "5px 0px 0px 0px", backgroundColor: "#f2f2f2" }}>
                                <div className="fs-4 fw-bold m-0">{data.title}</div>
                            </div>
                            <div className="d-flex justify-content-center" style={{ border: "1px solid #ccc", padding: "1rem", borderLeft: "none", borderRight: "none" }}>
                                <Fragment>
                                    <div className="row row-cols-1 row-cols-md-1 row-cols-xl-4 justify-content-center w-100">
                                        <div className="col col-md-12 col-xl-3">
                                            <div className="h5">DS chưa được duyệt</div>
                                            <hr />
                                            {listCandidateNotAccept.lenght === 0 ? (
                                                <div className="">Chưa có ứng viên nào</div>
                                            ) : (
                                                <div className="d-flex flex-column">
                                                    {listCandidateNotAccept.map((item, index) => (
                                                        <CardCandidate jobData={data} candidate={item} key={index} updateFirstLoad={fetchData} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col col-md-12 col-xl-3">
                                            <div className="h5">DS đã được duyệt</div>
                                            <hr />
                                            {listCandidateAccept.lenght === 0 ? (
                                                <div className="">Chưa có ứng viên nào</div>
                                            ) : (
                                                <div className="d-flex flex-column">
                                                    {listCandidateAccept.map((item, index) => (
                                                        <CardCandidate jobData={data} candidate={item} key={index} updateFirstLoad={fetchData} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col col-md-12 col-xl-3">
                                            <div className="h5">DS đã hoàn thành</div>
                                            <hr />
                                            {listCandidateComplete.lenght === 0 ? (
                                                <div className="">Chưa có ứng viên nào</div>
                                            ) : (
                                                <div className="d-flex flex-column">
                                                    {listCandidateComplete.map((item, index) => (
                                                        <CardCandidate jobData={data} candidate={item} key={index} updateFirstLoad={fetchData} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col col-md-12 col-xl-3">
                                            <div className="h5">DS bị từ chối</div>
                                            <hr />
                                            {listCandidateReject.lenght === 0 ? (
                                                <div className="">Chưa có ứng viên nào</div>
                                            ) : (
                                                <div className="d-flex flex-column">
                                                    {listCandidateReject.map((item, index) => (
                                                        <CardCandidate jobData={data} candidate={item} key={index} updateFirstLoad={fetchData} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Fragment>
                            </div>

                            <div className="fw-bold" style={{ borderRadius: "0px 0px 0px 5px", backgroundColor: "#f2f2f2", padding: "0.5rem 0.5rem 0.5rem 1rem" }}>
                                ID: #{data.jobsId}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function CardCandidate({ jobData, candidate, updateFirstLoad }) {
    const { checkExpires } = useAuth();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
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
            .where("email", "==", candidate?.cemail)
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
    const handleConfirmReceive = (aid) => {
        const isConfirmed = window.confirm("Bạn có chắc muốn nhận ứng viên này không?");
        if (isConfirmed) {
            console.log("Gửi yêu cầu thành công!");
            const newToken = localStorage.getItem("token");
            setLoading(true);
            try {
                request
                    .put(`JobAssigner/ReceiveCandidates/` + aid, null, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    })
                    .then((response) => {
                        if (response.data.message === "user_has_apply_successful") {
                            message.warning("Bạn chấp nhận ứng viên này rồi!", [1.5]);
                        }
                        if (response.data.message === "apply_successfull") {
                            message.success("Đã chấp nhận ứng viên này", [1.5]);
                            updateFirstLoad();
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
            }
        }
    };
    const handleConfirmReApply = (aid) => {
        const isConfirmed = window.confirm("Bạn có chắc muốn nhận ứng viên này không?");
        if (isConfirmed) {
            console.log("Gửi yêu cầu thành công!");
            const newToken = localStorage.getItem("token");
            setLoading(true);
            try {
                request
                    .put(`JobAssigner/ReApply/` + aid, null, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    })
                    .then((response) => {
                        if (response.data.message === "user_has_apply_successful") {
                            message.warning("Không thể thực hiện thao tác này vì ứng viên này đã được nhận", [1.5]);
                        }
                        if (response.data.message === "job_has_full_slot_apply") {
                            message.warning("Công việc này đã đủ ứng viên, không thể tuyển thêm!", [1.5]);
                        }
                        if (response.data.message === "apply_successfull") {
                            message.success("Đã chấp nhận ứng viên này", [1.5]);
                            updateFirstLoad();
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
            }
        }
    };
    const handleConfirmReject = (aid) => {
        const isConfirmed = window.confirm("Bạn có chắc muốn nhận ứng viên này không?");
        if (isConfirmed) {
            console.log("Gửi yêu cầu thành công!");
            const newToken = localStorage.getItem("token");
            setLoading(true);
            try {
                request
                    .put(`JobAssigner/RejectCandidates/` + aid, null, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    })
                    .then((response) => {
                        if (response.data.message === "user_has_process") {
                            message.warning("Không thể từ chối, vì ứng viên đã được duyệt!", [1.5]);
                        }
                        if (response.data.message === "reject_successfull") {
                            message.success("Đã từ chối ứng viên này!", [1.5]);
                            updateFirstLoad();
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
            }
        }
    };
    const handleChatWithSeeker = (cemail) => {
        connectionMessage();
    };

    const handleCancelCandidate = (aid) => {
        const isConfirmed = window.confirm("Bạn có chắc muốn hủy ứng viên này không?");
        if (isConfirmed) {
            console.log("Gửi yêu cầu thành công!");
            try {
                const newToken = localStorage.getItem("token");
                console.log(newToken);
                setLoading(true);
                request
                    .get(`JobAssigner/CancelJobSeekerApprove/` + aid, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    })
                    .then((response) => {
                        if (response.data.message === "not_approve_yet") {
                            message.error("Không thể hủy ứng viên này vì ứng viên này chưa được nhận", [1.5]);
                        }
                        if (response.data.message === "cancel_successfull") {
                            message.success("Đã hủy ứng viên này", [1.5]);
                            updateFirstLoad();
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
            }
        }
    };

    const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="Nhận xét"
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={onCancel}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log("Validate Failed:", info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: "public",
                    }}
                >
                    <Form.Item
                        name="rate"
                        label="Đánh giá"
                        rules={[
                            {
                                required: true,
                                message: "Đánh giá là bắt buộc",
                            },
                        ]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        label="Bình luận"
                        rules={[
                            {
                                required: true,
                                message: "Bình luận là bắt buộc",
                            },
                        ]}
                    >
                        <Input.TextArea allowClear showCount />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const [open, setOpen] = useState(false);
    const onCreate = (values) => {
        console.log("Received values of form: ", values);
        checkExpires();
        var formData = {
            rate: values.rate,
            comment: values.comment,
        };
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            request
                .put("JobAssigner/SendFeedback/" + candidate.aid, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.message === "user_has_process") {
                        message.success("Đã gửi nhận xét thành công", [1.5]);
                        updateFirstLoad();
                        setLoading(false);
                    }
                });
        } catch (error) {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <div className="d-flex justify-content-between flex-column border rounded p-2 mb-2">
            <div className="d-flex">
                <div className="text-center">
                    <img
                        src={candidate.avatar && isValidImageUrl(candidate.avatar) ? candidate.avatar : images.avatar.default}
                        className="border rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                        alt="Avatar"
                    />
                </div>
                <div className="ms-3">
                    <div>
                        <a className="text-decoration-none" href={`/profile-candidate/${candidate.applicantId}`} target="_blank" rel="noopener noreferrer">
                            <span className="fw-bold text-primary">{candidate ? candidate.fullName : ""}</span>
                        </a>
                    </div>
                    <div>
                        <span className="fw-bold text-dark">{candidate && candidate.role === 1 ? "Nhà tuyển dụng" : "Ứng viên"}</span>
                    </div>
                    {/* <div>{candidate.cemail ? candidate.cemail : ""}</div>
                    <div>{candidate.phoneNumber ? candidate.phoneNumber : ""}</div> */}
                    <div>{candidate.address ? candidate.address : ""}</div>
                </div>
            </div>

            {candidate.status === 1 || candidate.status === 3 || candidate.status === 2 ? null : (
                <div className="w-100 mt-2">
                    <button className="btn btn-success btn-sm w-100 mb-2" onClick={() => handleConfirmReceive(candidate.aid)} disabled={loading}>
                        Chấp nhận
                    </button>
                    <button className="btn btn-danger btn-sm w-100" onClick={() => handleConfirmReject(candidate.aid)} disabled={loading}>
                        Từ chối
                    </button>
                </div>
            )}
            {candidate.status === 1 && jobData.status !== 4 ? (
                <div className="w-100 mt-2">
                    <button className="btn btn-success btn-sm w-100 mb-2" onClick={() => handleChatWithSeeker(candidate.cemail)} disabled={loading}>
                        <MessageOutlined className="me-2" />
                        Nhắn tin với ứng viên
                    </button>
                    <button className="btn btn-danger btn-sm w-100 mb-2" onClick={() => handleCancelCandidate(candidate.aid)} disabled={loading}>
                        Hủy ứng viên
                    </button>
                </div>
            ) : null}
            {candidate.status === 3 && jobData.status !== 4 ? (
                <div className="w-100 mt-2">
                    <button className="btn btn-success btn-sm w-100 mb-2" onClick={() => handleConfirmReApply(candidate.aid)} disabled={loading}>
                        Chấp nhận lại
                    </button>
                </div>
            ) : null}
            {candidate.status === 2 ? (
                <div className="w-100 mt-2">
                    <button
                        className="btn btn-success btn-sm w-100 mb-2"
                        onClick={() => {
                            setOpen(true);
                        }}
                        disabled={candidate.feedback !== null}
                    >
                        {candidate.feedback !== null ? "Đã nhận xét" : "Nhận xét"}
                    </button>
                    <CollectionCreateForm
                        open={open}
                        onCreate={onCreate}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
}

export default ListCandidate;
