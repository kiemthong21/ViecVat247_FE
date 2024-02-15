import { Breadcrumb, Col, Divider, Input, Radio, Row, Select, Tabs } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardJobManage from "~/components/CardJobManage";
import LoadingIcon from "~/components/Loading";
import request from "~/utils/request";

import { Pagination } from "antd";
import { useAuth } from "~/utils/AuthContext";
import useAuthorization from "~/utils/useAuthorization";

const ManageJobs = () => {
    const { user, isInitialized, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isInitialized) {
            if (!user) {
                navigate("/login");
            }
        }
    }, [isInitialized]);
    useAuthorization([1], "/");

    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(1);
    const [categoryId, setCategoryId] = useState(null);
    const [stringSearch, setStringSearch] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [sortKey, setSortKey] = useState("id desc");
    const [typeJob, setTypeJob] = useState(null);

    const [jobCategories, setJobCategories] = useState([]);

    const handlePagination = (page) => {
        setCurrentPage(page);
    };

    const handleChangeSort = (value) => {
        setSortKey(value);
        setCurrentPage(1);
    };

    const handleChangeCategories = (value) => {
        setCategoryId(value);
        setCurrentPage(1);
    };

    const { Search } = Input;
    const submitSearch = (value) => {
        setLoadingSearch(true);
        setStringSearch(value);
        setCurrentPage(1);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoading(true);
                const token = localStorage.getItem("token");
                const responseData = await request.get("PostRecruitment/ListAllJobsByCustomer", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: { status: status, cid: categoryId, searchValue: stringSearch, pageIndex: currentPage, pageSize: 10, orderBy: sortKey, typesJobs: typeJob },
                });
                setData(responseData.data.jobs);
                setTotalPage(responseData.data.totalItems);

                const responseJobsCategory = await request.get("JobsCategory/GetAll");
                setJobCategories(responseJobsCategory.data.jobsCategory);

                // setLoading(false);
                setLoadingSearch(false);
            } catch (error) {
                if (error.response.status === 401) {
                    logout();
                }
            }
        };
        fetchData();
    }, [status, categoryId, stringSearch, currentPage, sortKey, typeJob, logout]);

    const handleTabChange = (key) => {
        setStatus(key);
    };
    const items = [
        {
            key: "",
            label: "Tất cả",
        },
        {
            key: "0",
            label: "Đang đợi duyệt",
        },
        {
            key: "1",
            label: "Đã được duyệt",
        },
        {
            key: "2",
            label: "Yêu cầu chỉnh sửa",
        },
        {
            key: "3",
            label: "Bị từ chối",
        },
        {
            key: "4",
            label: "Đã hoàn thành",
        },
        {
            key: "5",
            label: "Bản nháp",
        },
        {
            key: "6",
            label: "Đã đóng",
        },
    ];
    return (
        <Fragment>
            <Breadcrumb
                className="mt-4"
                items={[
                    {
                        title: <a href="/">Trang chủ</a>,
                    },
                    {
                        title: "Quản lý công việc",
                    },
                ]}
            />
            <Fragment>
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-between mt-5 mb-3 align-items-center">
                    <div className="col">
                        <span className="fs-3 fw-bold">Danh sách công việc</span>
                    </div>
                    <div className="col">
                        <Search placeholder="Nhập từ khóa" onSearch={submitSearch} enterButton size="large" loading={loadingSearch} />
                    </div>
                </div>
                <Divider />
                <div className="row row-cols-1 row-cols-md-1 row-cols-xl-2 justify-content-between mt-3">
                    <div className="col d-flex align-items-center mb-2">
                        <div>
                            <Radio.Group defaultValue={""} buttonStyle="solid" size="middle" onChange={(e) => setTypeJob(e.target.value)}>
                                <Radio.Button value="">Tất cả</Radio.Button>
                                <Radio.Button value="ONLINE">Trực tuyến</Radio.Button>
                                <Radio.Button value="OFFLINE">Trực tiếp</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="col d-flex justify-content-end align-items-center flex-wrap">
                        <div className="mb-2">
                            <span className="fs-6 fw-bold me-2">Danh mục:</span>
                            <Select
                                id="categories"
                                defaultValue=""
                                style={{
                                    width: 180,
                                }}
                                onChange={handleChangeCategories}
                                options={[{ value: "", label: "Tất cả" }, ...jobCategories.map((category) => ({ value: category.jobCategoryId.toString(), label: category.jobCategoryName }))]}
                            />
                        </div>
                        <div className="mb-2">
                            <span className="fs-6 fw-bold me-2 ms-2">Sắp xếp:</span>
                            <Select
                                id="orderBy"
                                defaultValue="id desc"
                                style={{
                                    width: 120,
                                }}
                                onChange={handleChangeSort}
                                options={[
                                    {
                                        value: "id desc",
                                        label: "Mới nhất",
                                    },
                                    {
                                        value: "id",
                                        label: "Cũ nhất",
                                    },
                                    {
                                        value: "title",
                                        label: "Tên việc A-Z",
                                    },
                                    {
                                        value: "title desc",
                                        label: "Tên việc Z-A",
                                    },
                                    {
                                        value: "address",
                                        label: "Địa chỉ A-Z",
                                    },
                                    {
                                        value: "address desc",
                                        label: "Địa chỉ Z-A",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} className="mt-3" />
                <section className="mb-3">
                    <Row gutter={16}>
                        <Col span={24}>
                            {loading ? (
                                <LoadingIcon />
                            ) : (
                                <Fragment>
                                    <div className="border border-1 rounded">
                                        <div className="p-3 py-3 rounded-top fw-bold d-flex justify-content-end align-items-center" style={{ background: "#f2f2f2" }}>
                                            <div></div>
                                        </div>
                                        {data.length > 0 ? (
                                            <>
                                                {data.map((item, index) => (
                                                    <CardJobManage key={index} job={item} />
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-center mt-4 fs-6">Không có kết quả nào</div>
                                        )}
                                        <div className="p-2 py-3 text-center rounded-bottom">
                                            {data.length && totalPage > 0 ? <Pagination current={currentPage} onChange={handlePagination} total={totalPage} /> : null}
                                        </div>
                                    </div>
                                </Fragment>
                            )}
                        </Col>
                    </Row>
                </section>
            </Fragment>
        </Fragment>
    );
};

export default ManageJobs;
