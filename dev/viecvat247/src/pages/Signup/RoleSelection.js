import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RoleSelection({ setSelectedRole }) {
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState("");

    const handleRoleChange = (e) => {
        const roleId = parseInt(e.target.value);
        setSelectedValue(roleId);
    };

    const handleSubmit = () => {
        setSelectedRole(selectedValue);
        navigate("/signup");
    };

    return (
        <Fragment>
            <div className="container d-flex justify-content-center align-items-center flex-column py-5 w-100">
                <div className="h3 mb-2">Bạn muốn tham gia với tư cách</div>
                <div className="row row-cols-1 row-cols-md-3 row-cols-xl-3 justify-content-center w-100 my-5">
                    <div className="col mb-2">
                        <label
                            htmlFor="seeker"
                            className="card h-100 m-0 p-4 p-md-5"
                            style={{ backgroundColor: `${selectedValue === 1 ? "#02aa8a" : ""}`, color: `${selectedValue === 1 ? "white" : ""}`, cursor: "pointer" }}
                        >
                            <div className="card-body d-flex align-items-center radio">
                                <input className="me-2" type="radio" id="seeker" value="1" checked={selectedValue === 1} onChange={handleRoleChange} />
                                <span className="fw-bold">Tôi muốn tuyển dụng</span>
                            </div>
                        </label>
                    </div>
                    <div className="col mb-2">
                        <label
                            htmlFor="assigner"
                            className="card h-100 m-0 p-4 p-md-5"
                            style={{ backgroundColor: `${selectedValue === 2 ? "#02aa8a" : ""}`, color: `${selectedValue === 2 ? "white" : ""}`, cursor: "pointer" }}
                        >
                            <div className="card-body d-flex align-items-center radio">
                                <input className="me-2" type="radio" id="assigner" value="2" checked={selectedValue === 2} onChange={handleRoleChange} />
                                <span className="fw-bold">Tôi muốn tìm việc</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="w-50 mb-5">
                    <button className="btn btn-success w-100 fw-bold rounded-5" onClick={handleSubmit}>
                        {selectedValue ? (selectedValue === 1 ? "Tham gia với tư cách là nhà tuyển dụng" : "Đăng ký trở thành ứng viên") : "Tạo tài khoản"}
                    </button>
                </div>
                <div className="mb-3">
                    Đã có tài khoản?
                    <Link to="/login" className="text-decoration-none">
                        {" "}
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </Fragment>
    );
}

export default RoleSelection;
