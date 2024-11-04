import axios from "axios";

function getToken() {
    return localStorage.getItem("token");
}

const AxiosConfig = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Implement ug request interceptor para automatic ang pag attach sa token as a header if mu require ug authorization ang endpoint
AxiosConfig.interceptors.request.use((config) => {
    if (getToken()) {
        config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
});

export default AxiosConfig;
