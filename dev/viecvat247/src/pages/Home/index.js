import { Fragment, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import images from "~/assets/images";
import request from "~/utils/request";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import CardJob from "~/components/CardJob";
import LoadingIcon from "~/components/Loading";
import { Alert, Col, Row } from "antd";

function CarouselDark() {
    return (
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <img className="d-block w-100" src={images.Slide1.default} alt="First slide" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={images.Slide2.default} alt="Second slide" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={images.Slide3.default} alt="Third slide" />
            </Carousel.Item>
        </Carousel>
    );
}

function Home() {
    useEffect(() => {
        document.title = "Trang chủ - Viecvat247";
    }, []);
    // ------------------------------------------------------
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request.get("PostRecruitment/ListAllJobs", { params: { orderBy: "id desc", pageIndex: 1, pageSize: 10 } });
                setData(response.data.jobs.slice(0, 6));
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Fragment>
            <CarouselDark />
            <div className="d-flex justify-content-between align-items-center mt-5">
                <div className="fw-bold">
                    <h1>
                        <span>Quy trình</span> <span style={{ color: "#02aa8a" }}>đơn giản</span>
                    </h1>
                </div>
            </div>
            <div style={{ paddingTop: "8px", borderBottom: "1px solid #BCBFD6" }}></div>
            <div className="mt-3 mb-5">
                <div className="d-flex flex-column justify-content-center container" style={{ background: "whitesmoke", borderRadius: "10px", padding: "1em" }}>
                    <div className="row row-cols-1 row-cols-md-3 py-2">
                        <div className="d-flex flex-column align-items-center mb-5">
                            <div>
                                <img src={images.postjob.default} alt="" style={{ width: "100px" }} />
                            </div>
                            <h3>Đăng việc</h3>
                            <div style={{ textAlign: "center", fontWeight: "500" }}>Đăng việc dễ dàng bằng cách điền vào các trường bắt buộc</div>
                        </div>
                        <div className="d-flex flex-column align-items-center mb-5">
                            <h3 className="text-left">Cần phải</h3>
                            <h1 className="text-center" style={{ color: "#02aa8a" }}>
                                Hoàn thành
                            </h1>
                            <h3 className="text-end">nhiệm vụ</h3>
                        </div>
                        <div className="d-flex flex-column align-items-center mb-5">
                            <div>
                                <img src={images.safepayment.default} alt="" style={{ width: "100px" }} />
                            </div>
                            <h3>Thanh toán an toàn</h3>
                            <div style={{ textAlign: "center", fontWeight: "500" }}>Chỉ thanh toán khi công việc đã hoàn thành và bạn hài lòng 100% về chất lượng</div>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div>
                            <img src={images.choosejob.default} alt="" style={{ width: "100px" }} />
                        </div>
                        <h3>Chọn người cho công việc</h3>
                        <div style={{ textAlign: "center", fontWeight: "500" }}>Tìm kiếm công việc phù hợp với kỹ năng và sở thích của bạn</div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3" id="about-us">
                <div className="fw-bold">
                    <h1>
                        <span>Về </span> <span style={{ color: "#02aa8a" }}>chúng tôi</span>
                    </h1>
                </div>
            </div>
            <div style={{ paddingTop: "8px", borderBottom: "1px solid #BCBFD6" }}></div>
            <div style={{ background: "linear-gradient(to right, #02aa8a, #50d9bf)", color: "white", borderRadius: "10px" }} className="py-5 justify-content-center d-flex mt-3 mb-4">
                <div className="row row-cols-1 row-cols-md-2 container">
                    <div className="col mt-4 mb-4">
                        <div className="d-flex flex-column px-5">
                            <h1 style={{ color: "#F6AF2F" }}>Tại sao chọn</h1>
                            <h1>Viecvat247?</h1>
                            <span style={{ textAlign: "justify" }}>
                                Đây là một nền tảng thuận tiện và đáng tin cậy để tìm kiếm và tuyển dụng những cá nhân có kỹ năng cần thiết cho các nhiệm vụ nhỏ. Giao dịch được an toàn và linh hoạt,
                                với các tùy chọn thanh toán an toàn.
                            </span>
                        </div>
                    </div>
                    <div className="col mt-4 mb-4">
                        <div className="d-flex flex-column px-5">
                            <h2>Thuận tiện</h2>
                            <h2>Nền tảng đáng tin cậy</h2>
                            <h2>Cơ hội việc làm đa dạng</h2>
                            <h2>Thanh toán an toàn</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ paddingTop: "8px", borderBottom: "1px solid #BCBFD6" }}></div>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="fw-bold">
                    <h1>
                        <span>Cơ hội</span> <span style={{ color: "#02aa8a" }}>việc làm</span>
                    </h1>
                </div>
                <div>
                    <Link to="jobs">
                        <button type="button" className="btn btn-outline-success btn-sm align-items-center" style={{ minWidth: "136px" }}>
                            <ArrowForwardIcon /> <span style={{ fontWeight: "500" }}>Xem thêm việc</span>
                        </button>
                    </Link>
                </div>
            </div>
            <section className="py-2">
                <div className="mt-2 mb-5">
                    {loading ? (
                        <LoadingIcon />
                    ) : error ? (
                        <Alert message="Đã xảy ra lỗi khi tải dữ liệu từ API. Vui lòng thử lại sau." type="error" showIcon />
                    ) : (
                        <Fragment>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <div className="border border-1 rounded">
                                        {data.length > 0 ? (
                                            <>
                                                {data.map((item, index) => (
                                                    <CardJob key={index} job={item} />
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-center mt-4 mb-4 fs-6">Không có kết quả nào</div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Fragment>
                    )}
                </div>
            </section>
        </Fragment>
    );
}

export default Home;
