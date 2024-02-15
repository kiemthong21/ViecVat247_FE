import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Spin, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/utils/AuthContext";
import request from "~/utils/request";
import useAuthorization from "~/utils/useAuthorization";

const Report = () => {
    useEffect(() => {
        document.title = "Báo cáo - Viecvat247";
    }, []);

    //   ---------------------------------------
    const { user, isInitialized } = useAuth();
    const { checkExpires } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1, 2], "/");
    // ---------------------------------------------------------------------
    const [formReport] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        checkExpires();
        setLoading(true);
        const listImages = await handleUpload();
        var formData = {
            content: values.content,
            imageReport: listImages,
        };

        console.log(formData);
        try {
            const token = localStorage.getItem("token");
            request
                .post("Customer/SendReport", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    if (response.data.message === "send_successful.") {
                        message.success("Gửi báo cáo thành công", [1.5]);
                        setPreviewImages([]);
                        setSelectedFiles([]);
                        setLoading(false);
                        formReport.resetFields();
                    }
                });
        } catch (error) {
            setLoading(false);
        }
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...newFiles]);

        const newPreviewImages = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviewImages]);
    };

    const removeImage = (index) => {
        const newSelectedFiles = [...selectedFiles];
        const newPreviewImages = [...previewImages];

        newSelectedFiles.splice(index, 1);
        newPreviewImages.splice(index, 1);

        setSelectedFiles(newSelectedFiles);
        setPreviewImages(newPreviewImages);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append(`files`, file);
            });

            const response = await request.post("Other/upload-multiple", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.imageUrls;
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleButtonChooseImage = () => {
        document.querySelector("#file-input").click();
    };
    return (
        <div className="py-5">
            <div className="border mb-3 rounded-1">
                <div className="container">
                    <div className="text-center h3 mt-4 mb-4" style={{ color: "#02aa8a" }}>
                        BÁO CÁO
                    </div>
                    <Form form={formReport} name="recruitment-offline" onFinish={onFinish} layout="vertical" initialValues={{}}>
                        <Form.Item
                            name="content"
                            label="Nội dung"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Nội dung là bắt buộc",
                                },
                            ]}
                        >
                            <Input.TextArea size="large" showCount minLength={50} maxLength={500} rows={4} />
                        </Form.Item>

                        <Form.Item name="pictures">
                            <input type="file" id="file-input" multiple onChange={handleFileChange} className="d-none" accept="image/*" />
                            <Button icon={<UploadOutlined />} onClick={handleButtonChooseImage} className="mt-2">
                                Upload
                            </Button>
                            <div className="mt-3">
                                {previewImages.map((url, index) => (
                                    <div key={index} style={{ position: "relative", display: "inline-block", marginRight: "10px" }}>
                                        <div style={{ width: "200px", height: "100px" }}>
                                            <img src={url} alt={`Preview ${index}`} style={{ width: "100%", height: "100%" }} />
                                        </div>
                                        <button
                                            onClick={() => removeImage(index)}
                                            style={{
                                                position: "absolute",
                                                border: "1px solid transparent",
                                                top: 5,
                                                right: 5,
                                                background: "white",
                                                color: "red",
                                                width: "28px",
                                                height: "28px",
                                                cursor: "pointer",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* <button onClick={handleUpload}>Upload</button> */}
                        </Form.Item>

                        <Form.Item className="d-flex justify-content-end">
                            <Button style={{ backgroundColor: "#01b195" }} type="primary" htmlType="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spin className="me-2" />
                                        Gửi báo cáo
                                    </>
                                ) : (
                                    "Gửi báo cáo"
                                )}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Report;
