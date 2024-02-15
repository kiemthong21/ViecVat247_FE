import { LogoutOutlined, WarningOutlined } from "@ant-design/icons";
import images from "~/assets/images";
import { useAuth } from "~/utils/AuthContext";

const BoxAccount = ({ user, onClose }) => {
    const { logout } = useAuth();
    const isValidImageUrl = (url) => {
        const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
        return imageUrlRegex.test(url);
    };
    const logoutAndClose = () => {
        logout();
        onClose();
    };
    return (
        <div className="box-account-logined">
            <div className="box-account-title">
                <div className="fw-bold">Tài khoản</div>
                <img src={images.profile_close.default} alt="" className="close-login-popup" onClick={onClose} />
            </div>
            <div className="box-account account-logined-content box-account_logined">
                <div className="account-sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-section-avt">
                            <img className="sidebar-section-avt border" src={user.avatar && isValidImageUrl(user.avatar) ? user.avatar : images.avatar.default} alt="" />
                        </div>
                        <div className="sidebar-section-info">
                            <div className="sidebar-section-title d-flex flex-column">
                                <span className="">{user.fullname}</span>
                                <span className="text-secondary">{user.roleid === 1 ? "Nhà tuyển dụng" : "Ứng viên"}</span>
                            </div>
                            <div className="sidebar-section-info-text">
                                Số dư:{" "}
                                <span>
                                    {user.money
                                        ? Number(user.money).toLocaleString("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                          })
                                        : "0"}
                                </span>
                            </div>
                            <p className="sidebar-section-info-text">
                                ID: <span>{user.uid}</span>
                            </p>
                        </div>
                    </div>
                    <div className="sidebar-section flex-column">
                        <div className="sidebar-item">
                            <a href="/user/profile" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.thongtintaikhoan.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Thông tin tài khoản</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                        <div className="sidebar-item-partition d-flex c-my-8"></div>
                        <div className="sidebar-item">
                            <a href="/user/changepassword" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.doimatkhau.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Đổi mật khẩu</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-section flex-column">
                        <p className="sidebar-section-title mb-3">Quản lý giao dịch</p>
                        <div className="sidebar-item">
                            <a href="/user/deposit" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.naptien.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Nạp tiền</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                        <div className="sidebar-item-partition d-flex c-my-8"></div>
                        <div className="sidebar-item">
                            <a href="/user/withdraw" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.rutvatpham.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Rút tiền</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-section flex-column">
                        <p className="sidebar-section-title mb-3">Lịch sử giao dịch</p>
                        <div className="sidebar-item">
                            <a href="/user/transaction-history" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.biendongsodu.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Biến động số dư</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                        <div className="sidebar-item-partition d-flex c-my-8"></div>
                        <div className="sidebar-item">
                            <a href="/user/deposit-history" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <img src={images.lichsunaptien.default} alt="" />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Lịch sử nạp tiền</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-item">
                            <a href="/report" className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <WarningOutlined style={{ color: "#434657", fontSize: "22px" }} />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0">Báo cáo</p>
                                <img src={images.sidebar_arrow_right.default} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-item">
                            <button onClick={logoutAndClose} className="d-block align-items-center d-flex">
                                <div className="icon-sidebar">
                                    <LogoutOutlined style={{ color: "#434657", fontSize: "22px" }} />
                                </div>
                                <p className="sidebar-item-text fw-400 fz-12 mb-0 text-start">Đăng xuất</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxAccount;
