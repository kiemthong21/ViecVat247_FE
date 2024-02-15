import Header from "../components/Header";

const HeaderOnly = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="content">{children}</div>
        </div>
    );
};

export default HeaderOnly;
