import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuBottom from "~/components/MenuBottom";

const DefaultLayout = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <div className="layout">
                <div className="main-content">
                    <div className="container">{children}</div>
                </div>
            </div>
            <Footer />
            <MenuBottom />
        </Fragment>
    );
};

export default DefaultLayout;
