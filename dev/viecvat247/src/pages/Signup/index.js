import React, { useState, Fragment, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import AccountRegistration from "./AccountRegistration";

function Signup() {
    useEffect(() => {
        document.title = "Đăng ký - Viecvat247";
    }, []);
    // ------------------------------------------------------
    const [selectedRole, setSelectedRole] = useState(null);
    return <Fragment>{selectedRole ? <AccountRegistration selectedRole={selectedRole} /> : <RoleSelection setSelectedRole={setSelectedRole} />}</Fragment>;
}

export default Signup;
