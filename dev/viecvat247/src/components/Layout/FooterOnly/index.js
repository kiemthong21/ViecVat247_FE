import Footer from "../components/Footer";

const FooterOnly = ({ children }) => {
    return (
        <div>
            <div style={{ marginBottom: "110px" }} className="content">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default FooterOnly;
