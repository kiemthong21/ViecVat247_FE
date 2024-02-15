import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import images from "~/assets/images";
import request from "~/utils/request";
import { utils } from "~/utils/utils";

const Notification = ({ notifications, onClose }) => {
    const navigate = useNavigate();
    const handleReadNotification = (notification) => {
        const ListNotificationId = [];
        if (notification.status === 0) {
            ListNotificationId.push(notification.notificationId);
            fetchReadNotifications(ListNotificationId);
        }
        const auth = JSON.parse(localStorage?.getItem("auth"));
        const user_role = auth.roleid;
        if (user_role === 1) {
            window.location.href = `/job-detail-created?id=${notification.jobId}`;
        } else if (user_role === 2) {
            window.location.href = `/job-detail-apply?id=${notification.aid}`;
        }
    };

    const handleReadAllNotification = () => {
        const ListNotificationId = [];
        notifications.forEach((notification) => {
            if (notification.status === 0) {
                ListNotificationId.push(notification.notificationId);
            }
        });
        if (ListNotificationId.length > 0) {
            fetchReadNotifications(ListNotificationId);
            console.log(ListNotificationId);
        }
    };

    const fetchReadNotifications = async (listNotificationID) => {
        try {
            const token = localStorage?.getItem("token");
            if (!token) {
                navigate("/login");
            }
            const response = await request.put(
                "Customer/UpdateNotification",
                {
                    listNotificationID: listNotificationID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log("Cập nhật thông báo thành công");
            } else {
                console.log("Có lỗi khi cập nhật thông báo");
            }
        } catch (error) {
            console.error("Lỗi khi gửi request:", error.message);
        }
    };

    return (
        <div className="notify_menu">
            <div className="notify_header d-flex justify-content-between">
                <div className="fw-bold">Thông báo</div>
                <img src={images.profile_close.default} alt="" className="close-notification-popup" onClick={onClose} />
            </div>
            <div className="notify_content_layout">
                <div id="result-notification" className="notify_content">
                    {notifications && notifications.length > 0 ? (
                        <Fragment>
                            {notifications.map((notification, index) => (
                                <div className="notification-item" key={index} onClick={() => handleReadNotification(notification)}>
                                    <div className="profile-picture">
                                        <img src={images.logo.default} alt="Profile" />
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">{utils.convertText(notification.description, 90)}</div>
                                        <div className="notification-time">{utils.calculateTimeAgo(notification.timestamp)}</div>
                                    </div>
                                    <div className="notification-status">{notification.status === 0 ? <span className="status-unread"></span> : null}</div>
                                </div>
                            ))}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div className="m-5 notification-menu-in-content">
                                <img src={images.notification_mailbox} alt="" />
                                <p className="no-notify-message">Bạn chưa có thông báo nào</p>
                            </div>
                        </Fragment>
                    )}
                </div>
            </div>
            {notifications && notifications.length > 0 && (
                <div className="mark-read-all" onClick={handleReadAllNotification}>
                    Đánh dấu tất cả là đã đọc
                </div>
            )}
        </div>
    );
};

export default Notification;
