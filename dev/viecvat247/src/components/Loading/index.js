import { Fragment } from "react";
import images from "~/assets/images";

const LoadingIcon = () => {
    return (
        // <div
        //     style={{
        //         textAlign: "center",
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //     }}
        // >
        //     <img src={images.loading} alt="Loading..." style={{ width: "8%" }} />
        // </div>

        <Fragment>
            <div className="loading-overlay"></div>
            <div className="loading-overlay-image-container">
                <img src={images.loading} className="loading-overlay-img" alt="" />
            </div>
        </Fragment>
    );
};

export default LoadingIcon;
