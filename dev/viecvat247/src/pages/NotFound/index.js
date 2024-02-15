import React from "react";
import styles from "./NotFound.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const NotFound = () => {
    const cx = classNames.bind(styles);
    var previousPageURL = document.referrer;
    return (
        <div className={cx("page_not_found")}>
            <div className={cx("content")}>
                <h2>404</h2>
                <h1>Lost in space ?</h1>
                <p>Bạn đang truy cập một trang không tồn tại hoặc đã bị xoá/thay thế trong hệ thống Viecvat247. Đừng lo, hãy quay về trang chủ, trở lại trang trước đó hoặc gửi yêu cầu hỗ trợ cho Viecvat247.</p>
                <div className="mb-2">
                    <Link to="/" className="btn btn-success me-2">
                        Trang chủ
                    </Link>
                    <Link to={previousPageURL} className="btn btn-outline-success">
                        Quay lại
                    </Link>
                </div>
                <Link to="/support" className={cx("support")}>
                    Cần hỗ trợ ?
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
