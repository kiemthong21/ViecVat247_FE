import { Fragment, useEffect, useState } from "react";
import request from "~/utils/request";
import images from "~/assets/images";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import LoadingIcon from "~/components/Loading";
import { useAuth } from "~/utils/AuthContext";
import firebase, { auth, db } from "~/firebase/config";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import Swal from "sweetalert2";
const googleProvider = new firebase.auth.GoogleAuthProvider();

const Login = () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    useEffect(() => {
        document.title = "Đăng nhập - Viecvat247";
        const fbRoot = document.getElementById("fb-root");
        if (fbRoot) {
            fbRoot.style.display = "none";
        }
    }, []);

    // ------------------------------------------------------
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        const auth = localStorage?.getItem("auth");
        if (auth) {
            navigate("/");
        } else {
            setLoading(false);
        }
    }, []);

    const saveLogin = (response) => {
        login(response);
        console.log(response);
        setLoading(true);
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoadingLogin(true);
        if (!formData.email || !formData.password) {
            message.warning("Email/Mật khẩu là bắt buộc!", [1.5]);
            setLoadingLogin(false);
            return;
        }
        try {
            request
                .post("Authen/Customer/Login", formData)
                .then(async (response) => {
                    if (response.data.message === "email_password_wrong") {
                        message.error("Tài khoản hoặc mật khẩu không chính xác!");
                        setLoadingLogin(false);
                    }
                    if (response.data.message === "account_not_confirm_mail") {
                        message.error("Tài khoản chưa xác nhận email!");
                        setLoadingLogin(false);
                    }
                    if (response.data.message === "account_has_ban") {
                        message.error("Tài khoản này đã bị cấm!");
                        setLoadingLogin(false);
                    }
                    if (response.data.token) {
                        const checkFirstLogin = await checkIfEmailExists();
                        console.log(checkFirstLogin);
                        if (checkFirstLogin) {
                            Swal.fire({
                                title: "Đây là lần đăng nhập đầu tiên của bạn?",
                                text: "Bạn cần đăng nhập với google để tiếp tục!",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Hủy",
                                confirmButtonColor: "#02aa8a",
                                cancelButtonColor: "#dc3545",
                                reverseButtons: true,
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    await handleLoginWithGG().then((check) => {
                                        if (check) {
                                            saveLogin(response);
                                            message.success("Đăng nhập thành công");
                                        } else {
                                            setLoadingLogin(false);
                                            return;
                                        }
                                    });
                                } else {
                                    message.warning("Đăng nhập thất bại");
                                    setLoadingLogin(false);
                                    return;
                                }
                            });
                        } else {
                            saveLogin(response);
                            message.success("Đăng nhập thành công");
                        }
                    }
                })
                .catch((error) => {
                    // message.error(error);
                    setLoadingLogin(false);
                });
        } catch (error) {
            // message.error(error);
            setLoadingLogin(false);
        }
    };

    const checkIfEmailExists = async () => {
        try {
            const q = query(collection(db, "users"), where("email", "==", formData.email));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 0) {
                // Email exists in the "users" collection
                console.log('Email exists in the "users" collection');
                return false;
            } else {
                // Email does not exist in the "users" collection
                console.log('Email does not exist in the "users" collection');
                return true;
            }
        } catch (error) {
            console.error("Error checking email existence:", error);
            throw error; // rethrow the error if needed
        }
    };

    const handleLoginWithGG = async () => {
        let check = true;
        try {
            let user;
            await auth
                .signInWithPopup(googleProvider)
                .then(function (result) {
                    // Check if the signed-in user's email matches the allowed email
                    if (result.user.email === formData.email) {
                        // User is allowed to sign in
                        user = result.user;
                    } else {
                        // Sign out the user if the email doesn't match
                        message.warning("Đăng nhập thất bại, email không trùng khớp với tài khoản");
                        auth.signOut();
                        check = false;
                    }
                })
                .catch(function (error) {
                    // Handle errors
                    console.error("Sign-in error:", error);
                });

            await setDoc(doc(db, "users", user?.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });
            await setDoc(doc(db, "userChats", user?.uid), {});
        } catch (err) {
            console.error(err);
            check = false;
        }
        return check;
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    return (
        <Fragment>
            {loading ? (
                <LoadingIcon />
            ) : (
                <div className="container">
                    <div className="d-flex justify-content-center flex-column align-items-center mt-3 mb-3">
                        <Link to="/" className="">
                            <img src={images.logo.default} alt="Logo" />
                        </Link>
                    </div>
                    <div className="box-login-outline">
                        <form className="w-100 box-login" onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-center flex-column align-items-center">
                                <span className="fs-2 fw-normal mb-5">Đăng nhập vào Viecvat247</span>
                            </div>
                            {/* <a className="c-btn-google btn btn-block w-100 fw-bold " target="_blank" href="google.com" role="button">
                            <span>
                                <img className="rounded-circle me-2" src={images.google.default} alt="" />
                            </span>
                            Tiếp tục với Google{" "}
                        </a>
                        <div className="c-divider">
                            <span>HOẶC</span>
                        </div> */}
                            <div className="form-outline mb-4">
                                <input type="email" className="form-control form-control-lg c-input" placeholder="Địa chỉ email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    className="form-control form-control-lg c-input"
                                    placeholder="Mật khẩu"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" name="rememberMe" type="checkbox" value={formData.rememberMe} onChange={handleChange} />
                                    <span className="form-check-label"> Nhớ đăng nhập </span>
                                </div>
                                <Link to="/forgotPassword" className="text-decoration-none">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button type="submit" className="c-btn-submit btn btn-primary btn-lg btn-block w-100 d-flex justify-content-center align-items-center" disabled={loadingLogin}>
                                {loadingLogin ? (
                                    <>
                                        <Spin className="me-2" />
                                        Đăng nhập
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>

                            <div className="d-flex justify-content-center py-4">
                                <span className="me-2">Chưa có tài khoản?</span>
                                <Link to="/signup" className="text-decoration-none justify-content-start">
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Login;
