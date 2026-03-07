import { create } from "zustand";
import { toast } from "react-toastify";

import {
  getProductTypes,
  createProductType,
  getProducts,
  createProduct,
  getProductById
} from "../src/services/productService";

const useProductStore = create((set, get) => ({
  products: [],
  productTypes: [],
  loading: false,
  error: null,

  // =============================
  // FETCH PRODUCT TYPES
  // =============================
  fetchProductTypes: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getProductTypes();

      set({
        productTypes: res.data.data
      });

    } catch (err) {
      console.error(err);
      set({ error: "Fetch product types failed" });
      toast.error("Không thể tải loại sản phẩm");
    } finally {
      set({ loading: false });
    }
  },

  // =============================
  // CREATE PRODUCT TYPE
  // =============================
  addProductType: async (productTypeRequest) => {
    try {
      const res = await createProductType(productTypeRequest);

      set((state) => ({
        productTypes: [...state.productTypes, res.data.data]
      }));

      toast.success("Tạo loại sản phẩm thành công");

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tạo loại sản phẩm thất bại");
    }
  },
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getProducts();
      set({ products: res.data.data })
    } catch (err) {
      toast.error("Không lấy được danh sách sản phẩm: " + err?.message)
      console.error("Fetch products failed", err)
      set({ error: "Không tải được danh sách sản phẩm" });
    } finally {
      set({ loading: false })
    }
  },

  addProduct: async (data) => {
    try {
      const res = await createProduct(data);

      set((state) => ({
        products: [res.data.data, ...state.products]
      }));

      toast.success("Tạo sản phẩm thành công");

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tạo sản phẩm thất bại");
    }
  }
}));

export default useProductStore;