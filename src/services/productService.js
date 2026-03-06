import axiosClient from "../api/axiosClient";

export const createProduct = async (productData) => {
    return axiosClient.post("/products", productData);
};
export const getProducts = async () => {
    return axiosClient.get("/products");
}
export const getProductById = async (id) => {
    return axiosClient.get(`/products/${id}`);
}
export const updateProduct = async (id, productData) => {
    return axiosClient.put(`/products/${id}`, productData);
}

export const createProductType = async (productTypeData) => {
    return axiosClient.post("/products/types", productTypeData);
}

export const getProductTypes = async () => {
    return axiosClient.get("/products/types");
}