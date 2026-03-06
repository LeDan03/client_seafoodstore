import axiosClient from "../api/axiosClient";

export const getCategories = () => {
    return axiosClient.get("/categories");
}

export const createCategory = (request) => {
    return axiosClient.post("/categories", request);
}
export const deleteCategoryById = (categoryId) => {
    return axiosClient.delete(`/categories/${categoryId}`);
}