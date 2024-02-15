import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import drilldown from "highcharts/modules/drilldown";
import { Card, Col, Row } from "antd";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { BulbOutlined, IdcardOutlined, MoneyCollectOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
exporting(Highcharts);
drilldown(Highcharts);

const ColumnChart = ({ data }) => {
    const chartData = data.chartDTOs
        ? data.chartDTOs.map((item) => ({
              name: `Tháng ${item.month}`,
              value1: item.numberJobAssgner,
              value2: item.numberJobSeeker,
          }))
        : [];

    const options = {
        chart: {
            type: "column",
        },
        title: {
            text: "Biểu đồ thống kê người dùng",
        },
        xAxis: {
            categories: chartData.map((item) => item.name),
        },
        yAxis: {
            title: {
                text: "Số lượng người tham gia",
            },
        },
        series: [
            {
                name: "Nhà tuyển dụng",
                data: chartData.map((item) => item.value1),
            },
            {
                name: "Người tìm việc",
                data: chartData.map((item) => item.value2),
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

const PieChart = ({ data }) => {
    const { numberJobWaitingApprover, numberJobApprover, numberJobWaitingEdit, numberJobReject, numberJobCompete } =
        data;

    const pieChartData = [
        { name: "Đang chờ duyệt", y: numberJobWaitingApprover },
        { name: "Đã được nhận", y: numberJobApprover },
        { name: "Đang chờ chỉnh sửa", y: numberJobWaitingEdit },
        { name: "Bị từ chối", y: numberJobReject },
        { name: "Đã hoàn thành", y: numberJobCompete },
    ];

    const options = {
        chart: {
            type: "pie",
        },
        title: {
            text: "Biểu đồ thống kê công việc",
        },
        series: [
            {
                name: "Số liệu",
                data: pieChartData,
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

const StatusChart = ({ data }) => {
    const { numberApplyJobPerson, numberRejectApplyJobPerson, numberWaittingApplyJobPerson, numberCompleteJobPerson } =
        data;

    const pieChartData = [
        { name: "Người trúng tuyển", y: numberApplyJobPerson },
        { name: "Người bị từ chối ứng tuyển", y: numberRejectApplyJobPerson },
        { name: "Người chờ trúng tuyển", y: numberWaittingApplyJobPerson },
        { name: "Người hoàn thành công việc", y: numberCompleteJobPerson },
    ];

    const options = {
        chart: {
            type: "pie",
        },
        title: {
            text: "Biểu đồ thống kê người tìm việc",
        },
        series: [
            {
                name: "Số liệu",
                data: pieChartData,
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

function DashBoard() {
    useEffect(() => {
        document.title = "Bảng điều khiển - Viecvat247";
    }, []);

    const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
    const [statisticsData, setStatisticsData] = useState({
        numberJobAssigner: 0,
        numberJobSeeker: 0,
        numberJobCategory: 0,
        numberSkill: 0,
        numberSkillCategory: 0,
        numberStaff: 0,
        numberJobWaitingApprover: 0,
        numberJobApprover: 0,
        numberJobWaitingEdit: 0,
        numberJobReject: 0,
        numberJobCompete: 0,
        numberApplyJobPerson: 0,
        numberRejectApplyJobPerson: 0,
        numberWaittingApplyJobPerson: 0,
        numberCompleteJobPerson: 0,
    });
    const [chartData, setChartData] = useState([]);
    const fetchData = async (year) => {
        console.log(year);
        try {
            const response = await fetch(`https://api.viecvat247.com/api/Dashboard/GetStatisticsDaskboard/${year}`);
            const data = await response.json();
            setStatisticsData(data);
            setChartData(data.chartDTOs);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    const onChange = (date, dateString) => {
        setSelectedYear(dateString);
        console.log(dateString);
    };
    const thisyear = moment();
    const disabledDate = (current) => {
        return current && current > thisyear.endOf("year");
    };
    return (
        <div style={{ backgroundColor: "#f1f5f9", padding: "20px" }}>
            <div>
                <Space direction="vertical">
                    <DatePicker onChange={onChange} picker="year" disabledDate={disabledDate} />
                </Space>
            </div>
            <Row
                gutter={16}
                style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <Col span={6}>
                    <Card
                        title={
                            <span>
                                <UserOutlined /> Người truy cập
                            </span>
                        }
                        extra={
                            <Link to="/manage/Manage-Customer" style={{ textDecoration: "none" }}>
                                Tìm hiểu thêm
                            </Link>
                        }
                        bordered={false}
                    >
                        <div style={{ fontSize: "16px" }}>
                            <p>
                                Tổng số người dùng: {statisticsData.numberJobSeeker + statisticsData.numberJobAssigner}
                            </p>
                            <p>Người nhận việc: {statisticsData.numberJobSeeker}</p>
                            <p>Người giao việc: {statisticsData.numberJobAssigner}</p>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        title={
                            <span>
                                <IdcardOutlined /> Công việc
                            </span>
                        }
                        extra={
                            <Link to="/manage/manage-job" style={{ textDecoration: "none" }}>
                                Tìm hiểu thêm
                            </Link>
                        }
                        bordered={false}
                    >
                        <div style={{ fontSize: "16px" }}>
                            <p>số lượng thể loại công việc: {statisticsData.numberJobCategory}</p>
                            <p>Số lượng công việc trực tuyến: {statisticsData.numberJobOnline}</p>
                            <p>số lượng công việc ngoại tuyến : {statisticsData.numberJobOffline}</p>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        title={
                            <span>
                                <BulbOutlined /> Kỹ năng
                            </span>
                        }
                        extra={
                            <Link to="/manage/manage-skill" style={{ textDecoration: "none" }}>
                                Tìm hiểu thêm
                            </Link>
                        }
                        style={{
                            height: 225,
                        }}
                        bordered={false}
                    >
                        <div style={{ fontSize: "16px" }}>
                            <p>Số lượng thể loại kỹ năng: {statisticsData.numberSkillCategory}</p>
                            <p>Số lượng kỹ năng: {statisticsData.numberSkill}</p>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        title={
                            <span>
                                <UserOutlined /> Nhân viên
                            </span>
                        }
                        extra={
                            <Link to="/manage/manage-staff" style={{ textDecoration: "none" }}>
                                Tìm hiểu thêm
                            </Link>
                        }
                        style={{
                            height: 225,
                        }}
                        bordered={false}
                    >
                        <div style={{ fontSize: "16px" }}>
                            <p>Số lượng nhân viên: {statisticsData.numberStaff}</p>
                        </div>
                    </Card>
                </Col>
            </Row>
            <div className="row">
                <div className="col-6">
                    <PieChart data={statisticsData} />
                </div>
                <div className="col-6">
                    <StatusChart data={statisticsData} />
                </div>
            </div>

            <div
                className="row"
                style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <h3>Doanh thu</h3>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            title={
                                <span>
                                    <MoneyCollectOutlined /> Số tiền nạp hệ thống
                                </span>
                            }
                            bordered={false}
                        >
                            <div style={{ textAlign: "center", paddingTop: "40px", fontSize: "32px" }}>
                                {statisticsData.numberEpointDeposit?.toLocaleString()} VNĐ
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title={
                                <span>
                                    <MoneyCollectOutlined /> Số tiền đã rút
                                </span>
                            }
                            bordered={false}
                        >
                            <div style={{ textAlign: "center", paddingTop: "40px", fontSize: "32px" }}>
                                {statisticsData.numberEpointWithDraw?.toLocaleString()} VNĐ
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title={
                                <span>
                                    <MoneyCollectOutlined /> Số tiền tạo bài đăng
                                </span>
                            }
                            bordered={false}
                        >
                            <div style={{ textAlign: "center", paddingTop: "40px", fontSize: "32px" }}>
                                {statisticsData.numberEpointCreatePost?.toLocaleString()} VNĐ
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div>
                <ColumnChart data={{ chartDTOs: chartData }} />
            </div>
        </div>
    );
}

export default DashBoard;
