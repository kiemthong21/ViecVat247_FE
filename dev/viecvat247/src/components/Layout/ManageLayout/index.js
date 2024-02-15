import React, { useEffect, useState } from "react";
import { BulbOutlined, CoffeeOutlined, DesktopOutlined, DollarOutlined, FileOutlined, FileTextOutlined, IdcardOutlined, LeftOutlined, LogoutOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "~/utils/AuthContext";
import styles from "./manageLayout.module.scss";
import classNames from "classnames/bind";
const { Header, Content, Footer, Sider } = Layout;
const cx = classNames.bind(styles);
const ManageLayout = ({ children }) => {
    const { userManage, isInitialized, logoutManage } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!userManage) {
                navigate("/manage/login");
            }
        }
    }, [isInitialized]);

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const items =
        userManage && userManage.roleid === 1
            ? [
                  getItem(<div className={cx("label")}>Bảng điều khiển</div>, "/manage/dashboard", <PieChartOutlined />),
                  userManage.typeManager.some((item) => item.typeManagerName === "Manager Skill" || item.typeManagerName === "Manager SkillCategory")
                      ? getItem(<div className={cx("label")}>Quản lý kỹ năng</div>, "skill", <BulbOutlined className={cx("label")} />, [
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Skill")
                                ? getItem(<div className={cx("label")}>kỹ năng</div>, "/manage/manage-skill", <DesktopOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager SkillCategory")
                                ? getItem(<div className={cx("label")}>Thể loại kỹ năng</div>, "/manage/manage-category-skill", <DesktopOutlined className={cx("label")} />)
                                : "",
                        ])
                      : "",
                  userManage.typeManager.some((item) => item.typeManagerName === "Manager JobCategory" || item.typeManagerName === "Manager Job")
                      ? getItem(<div className={cx("label")}>Quản lý công việc</div>, "Job", <IdcardOutlined className={cx("label")} />, [
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager JobCategory")
                                ? getItem(<div className={cx("label")}>Thế loại công việc</div>, "/manage/manage-category-job", <FileTextOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Job")
                                ? getItem(<div className={cx("label")}>Công việc</div>, "/manage/manage-job", <FileTextOutlined  className={cx("label")} />)
                                : "",
                        ])
                      : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Staff")
                                ? getItem("Nhân viên", "/manage/manage-staff", <UserOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Report")
                                ? getItem("Phản hồi", "/manage/Manage-Report-Customer", <CoffeeOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Customer")
                                ? getItem(<div className={cx("label")}>Khách hàng</div>, "/manage/Manage-Customer", <UserOutlined className={cx("label")} />)
                                : "",
                  userManage.typeManager.some(
                      (item) =>
                          item.typeManagerName === "Manager Deposit Money" ||
                          item.typeManagerName === "Manager Withdraw Money" ||
                          item.typeManagerName === "Manager Money Create Jobs" ||
                          item.typeManagerName === "Manager Refund Money"
                  )
                      ? getItem(<div className={cx("label")}>Quản lý giao dịch</div>, "Wallet", <DollarOutlined className={cx("label")} />, [
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Deposit Money")
                                ? getItem(<div className={cx("label")}>Nạp tiền</div>, "/manage/DepositManagement", <DollarOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Withdraw Money")
                                ? getItem(<div className={cx("label")}>Rút tiền</div>, "/manage/MoneyWithDrawalManagement", <DollarOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Refund Money")
                                ? getItem(<div className={cx("label")}>Hoàn tiền</div>, "/manage/ManagerRefundMoney", <DollarOutlined className={cx("label")} />)
                                : "",
                            userManage.typeManager.some((item) => item.typeManagerName === "Manager Money Create Jobs")
                                ? getItem(<div className={cx("label")}>Tạo bài đăng mới</div>, "/manage/ManagementOfPostingPost", <DollarOutlined className={cx("label")} />)
                                : "",
                        ])
                      : "",
              ]
            : [
                  getItem(<div className={cx("label")}>Bảng điều khiển</div>, "/manage/dashboard", <PieChartOutlined className={cx("label")} />),
                  getItem(<div className={cx("label")}>Quản lý kỹ năng</div>, "skill", <BulbOutlined className={cx("label")} />, [
                      getItem(<div className={cx("label")}>Kỹ năng</div>, "/manage/manage-skill", <DesktopOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Thể loại kỹ năng</div>, "/manage/manage-category-skill", <DesktopOutlined className={cx("label")} />),
                  ]),
                  getItem(<div className={cx("label")}>Quản lý công việc</div>, "Job", <IdcardOutlined className={cx("label")} />, [
                      getItem(<div className={cx("label")}>Thể loại công việc</div>, "/manage/manage-category-job", <FileTextOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Công việc</div>, "/manage/manage-job", <FileTextOutlined className={cx("label")} />),
                  ]),
                      getItem(<div className={cx("label")}>Nhân viên</div>, "/manage/manage-staff", <UserOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Phản hồi</div>, "/manage/Manage-Report-Customer", <CoffeeOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Khách hàng</div>, "/manage/Manage-Customer", <UserOutlined className={cx("label")} />),
                  getItem(<div className={cx("label")}>Quản lý giao dịch</div>, "Wallet", <DollarOutlined className={cx("label")} />, [
                      getItem(<div className={cx("label")}>Nạp tiền</div>, "/manage/DepositManagement", <DollarOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Rút tiền</div>, "/manage/MoneyWithDrawalManagement", <DollarOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Hoàn tiền</div>, "/manage/ManagerRefundMoney", <DollarOutlined className={cx("label")} />),
                      getItem(<div className={cx("label")}>Tạo bài đăng mới</div>, "/manage/ManagementOfPostingPost", <DollarOutlined className={cx("label")} />),
                  ]),
              ];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const onClick = (e) => {
        navigate(e.key);
    };
    const signOut = () => {
        logoutManage();
    };
    const customStyle = {
        menuItem: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        icon: {
            marginRight: "10px",
        },
        link: {
            textDecoration: "none",
        },
    };
    const menu = (
        <Menu>
            <Menu.Item key="profile" style={customStyle.menuItem}>
                <Link to="/manage/profile-user" style={customStyle.link}>
                    <UserOutlined style={customStyle.icon} /> Thông tin cá nhân
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={signOut} style={customStyle.menuItem}>
                <LogoutOutlined style={customStyle.icon} /> Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            <Sider
                trigger={
                    <div className={cx("trigger-sider")}>
                        <LeftOutlined />
                    </div>
                }
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Menu className={cx("demo-logo-vertical")} onClick={onClick} theme="light" defaultSelectedKeys={["/manage/dashboard"]} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div className={cx("label-logo")}>VIECVAT247</div>
                    <div style={{ marginRight: 20 }}>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Avatar
                                style={{
                                    backgroundColor: "#02AA8A",
                                    cursor: "pointer",
                                    width: "40px",
                                    height: "40px",
                                }}
                                icon={
                                    <UserOutlined
                                        style={{
                                            fontSize: "25px",
                                            height: "100%",
                                            alignItems: "center",
                                        }}
                                    />
                                }
                            />
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: "0 16px",
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    ></Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        {/* Page content */}
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Viecvat247 ©2023 Created by FPT Students
                </Footer>
            </Layout>
        </Layout>
    );
};
export default ManageLayout;
