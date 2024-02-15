import axios from "axios";

const request = axios.create({
    baseURL: "https://api.viecvat247.com/api/",
});

export default request;
