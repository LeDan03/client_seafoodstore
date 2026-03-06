import { create } from "zustand";
import { toast } from "react-toastify";

import {
  getProductTypes,
  createProductType
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
        productTypes: res.data
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
        productTypes: [...state.productTypes, res.data]
      }));

      toast.success("Tạo loại sản phẩm thành công");

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tạo loại sản phẩm thất bại");
    }
  },

}));

export default useProductStore;