import axios from "axios";

function getToken() {
    return localStorage.getItem("token");
}

const AxiosConfig = axios.create({
    baseURL: "http://localhost:8080/api",
});

AxiosConfig.interceptors.request.use((config) => {
    if (getToken()) {
        config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
});

export default AxiosConfig;
