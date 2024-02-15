import { Image } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import images from "~/assets/images";
import request from "~/utils/request";

const ConfirmMail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [confirmationStatus, setConfirmationStatus] = useState("");

    useEffect(() => {
        const idParam = searchParams.get("id");
        const codeParam = searchParams.get("code");
        if (idParam && codeParam) {
            const confirmMail = async () => {
                try {
                    const response = await request.get(`Authen/ConfirmMail/${idParam}/${codeParam}`);

                    if (response.data.message === "email_confirmation_complete") {
                        setConfirmationStatus("Xác nhận email của bản thành công.");
                    } else if (response.data.message === "email_confirmation_failed") {
                        setConfirmationStatus("Xác nhận email thất bại, vui lòng quay lại hệ thống để đăng ký.");
                    } else {
                        setConfirmationStatus("Xác nhận email thất bại, vui lòng quay lại hệ thống để đăng ký");
                    }
                } catch (error) {
                    console.error("Đã xảy ra lỗi:", error);
                    setConfirmationStatus("Xác nhận email thất bại, vui lòng quay lại hệ thống để đăng ký");
                }
            };
            confirmMail();
        }
    }, []);

    const [linkText, setLinkText] = useState("Quay lại để đăng ký");
    const [linkPath, setLinkPath] = useState("/signup");
    useEffect(() => {
        if (confirmationStatus === "Xác nhận email của bản thành công.") {
            setLinkText("Quay lại để đăng nhập");
            setLinkPath("/login");
        } else {
            setLinkText("Quay lại để đăng ký");
            setLinkPath("/signup");
        }
    }, [confirmationStatus]);

    return (
        <div>
            <title></title>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html: "\n        #outlook a {\n            padding: 0;\n        }\n\n        .ReadMsgBody {\n            width: 100%;\n        }\n\n        .ExternalClass {\n            width: 100%;\n        }\n\n        .ExternalClass * {\n            line-height: 100%;\n        }\n\n        body {\n            margin: 0;\n            padding: 0;\n            -webkit-text-size-adjust: 100%;\n            -ms-text-size-adjust: 100%;\n        }\n\n        table,\n        td {\n            border-collapse: collapse;\n            mso-table-lspace: 0pt;\n            mso-table-rspace: 0pt;\n        }\n\n        img {\n            border: 0;\n            height: auto;\n            line-height: 100%;\n            outline: none;\n            text-decoration: none;\n            -ms-interpolation-mode: bicubic;\n        }\n\n        p {\n            display: block;\n            margin: 13px 0;\n        }\n    ",
                }}
            />
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html: "\n        @media only screen and (max-width:480px) {\n            @-ms-viewport {\n                width: 320px;\n            }\n            @viewport {\n                width: 320px;\n            }\n        }\n    ",
                }}
            />
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html: "\n        @media only screen and (min-width:480px) {\n            .mj-column-per-100 {\n                width: 100% !important;\n            }\n        }\n    ",
                }}
            />
            <style type="text/css" dangerouslySetInnerHTML={{ __html: "\n    " }} />
            <div style={{ backgroundColor: "#f9f9f9" }}>
                <div style={{ background: "#f9f9f9", backgroundColor: "#f9f9f9", margin: "0px auto", maxWidth: "600px" }}>
                    <table align="center" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={{ background: "#f9f9f9", backgroundColor: "#f9f9f9", width: "100%" }}>
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        borderBottom: "#333957 solid 5px",
                                        direction: "ltr",
                                        fontSize: "0px",
                                        padding: "20px 0",
                                        textAlign: "center",
                                        verticalAlign: "top",
                                    }}
                                ></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ background: "#fff", backgroundColor: "#fff", margin: "0px auto", maxWidth: "600px" }}>
                    <table align="center" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={{ background: "#fff", backgroundColor: "#fff", width: "100%" }}>
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        border: "#dddddd solid 1px",
                                        borderTop: "0px",
                                        direction: "ltr",
                                        fontSize: "0px",
                                        padding: "20px 0",
                                        textAlign: "center",
                                        verticalAlign: "top",
                                    }}
                                >
                                    <div
                                        className="mj-column-per-100 outlook-group-fix"
                                        style={{
                                            fontSize: "13px",
                                            textAlign: "left",
                                            direction: "ltr",
                                            display: "inline-block",
                                            verticalAlign: "bottom",
                                            width: "100%",
                                        }}
                                    >
                                        <table border={0} cellPadding={0} cellSpacing={0} role="presentation" style={{ verticalAlign: "bottom" }} width="100%">
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <table
                                                            align="center"
                                                            border={0}
                                                            cellPadding={0}
                                                            cellSpacing={0}
                                                            role="presentation"
                                                            style={{ borderCollapse: "collapse", borderSpacing: "0px" }}
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: "100px" }}>
                                                                        <Image
                                                                            height="auto"
                                                                            src={images.logo.default}
                                                                            style={{
                                                                                border: 0,
                                                                                display: "block",
                                                                                outline: "none",
                                                                                textDecoration: "none",
                                                                                width: "100px",
                                                                            }}
                                                                            width={64}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            paddingBottom: "40px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                fontSize: "32px",
                                                                fontWeight: "bold",
                                                                lineHeight: 1,
                                                                textAlign: "center",
                                                                color: "#555",
                                                            }}
                                                        >
                                                            {confirmationStatus}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            paddingBottom: 0,
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                fontSize: "16px",
                                                                lineHeight: "22px",
                                                                textAlign: "center",
                                                                color: "#555",
                                                            }}
                                                        ></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                fontSize: "16px",
                                                                lineHeight: "22px",
                                                                textAlign: "center",
                                                                color: "#555",
                                                            }}
                                                        ></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            paddingTop: "30px",
                                                            paddingBottom: "40px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <table align="center" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: "separate", lineHeight: "100%" }}>
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        bgcolor="#02AA8A"
                                                                        role="presentation"
                                                                        style={{
                                                                            border: "none",
                                                                            borderRadius: "3px",
                                                                            color: "#ffffff",
                                                                            cursor: "auto",
                                                                            padding: "15px 25px",
                                                                        }}
                                                                        valign="middle"
                                                                    >
                                                                        <p
                                                                            style={{
                                                                                background: "#02AA8A",
                                                                                color: "#ffffff",
                                                                                fontSize: "15px",
                                                                                fontWeight: "normal",
                                                                                lineHeight: "120%",
                                                                                margin: 0,
                                                                                textDecoration: "none",
                                                                                textTransform: "none",
                                                                            }}
                                                                        >
                                                                            <Link
                                                                                to={linkPath}
                                                                                style={{
                                                                                    textDecoration: "none",
                                                                                    color: "#ffffff",
                                                                                }}
                                                                            >
                                                                                {linkText}
                                                                            </Link>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            paddingTop: "100px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                fontSize: "26px",
                                                                fontWeight: "bold",
                                                                lineHeight: 1,
                                                                textAlign: "center",
                                                                color: "#555",
                                                            }}
                                                        >
                                                            Cần hỗ trợ?
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: "0px",
                                                            padding: "10px 25px",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                fontSize: "14px",
                                                                lineHeight: "22px",
                                                                textAlign: "center",
                                                                color: "#555",
                                                            }}
                                                        >
                                                            Vui lòng gửi và phản hồi hoặc thông tin lỗi
                                                            <br /> đến{" "}
                                                            <a href="mailto:viecvat247@gmail.com" style={{ color: "#2F67F6" }}>
                                                                viecvat247@gmail.com
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ margin: "0px auto", maxWidth: "600px", marginTop: "410px" }}>
                    <table align="center" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        direction: "ltr",
                                        fontSize: "0px",
                                        padding: "20px 0",
                                        textAlign: "center",
                                        verticalAlign: "top",
                                    }}
                                >
                                    <div
                                        className="mj-column-per-100 outlook-group-fix"
                                        style={{
                                            fontSize: "13px",
                                            textAlign: "left",
                                            direction: "ltr",
                                            display: "inline-block",
                                            verticalAlign: "bottom",
                                            width: "100%",
                                        }}
                                    >
                                        <table border={0} cellPadding={0} cellSpacing={0} role="presentation" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: "bottom", padding: 0 }}>
                                                        <table border={0} cellPadding={0} cellSpacing={0} role="presentation" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style={{
                                                                            fontSize: "0px",
                                                                            padding: 0,
                                                                            wordBreak: "break-word",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                                fontSize: "12px",
                                                                                fontWeight: 300,
                                                                                lineHeight: 1,
                                                                                textAlign: "center",
                                                                                color: "#575757",
                                                                            }}
                                                                        >
                                                                            Some Firm Ltd, 35 Avenue. City 10115, USA
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style={{
                                                                            fontSize: "0px",
                                                                            padding: "10px",
                                                                            wordBreak: "break-word",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                                                                fontSize: "12px",
                                                                                fontWeight: 300,
                                                                                lineHeight: 1,
                                                                                textAlign: "center",
                                                                                color: "#575757",
                                                                            }}
                                                                        >
                                                                            <a href style={{ color: "#575757" }}>
                                                                                Unsubscribe
                                                                            </a>{" "}
                                                                            from our emails
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMail;
