import axios from "axios";

// Setup axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/api", // Your backend API base URL
});

// Add authorization token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
