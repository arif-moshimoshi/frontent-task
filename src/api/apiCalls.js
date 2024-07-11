import axios from "axios";



export const postApi = (path, data) => {
    return axios.post(path, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
export const postFormDataApi = (path, formData) => {
    return axios.post(path, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const putFormDataApi = (path, formData) => {
    return axios.put(path, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const deleteApi = (path, data) => {
    return axios.delete(path, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const getApi = (path) => {
    return axios.get(path, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const putApi = (path, data) => {
    return axios.put(path, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};