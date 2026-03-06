import { create } from "zustand";
import { toast } from "react-toastify";

import {
  getCategories,
  createCategory,
  deleteCategoryById
} from "../src/services/categoryService"

const useCategoriesStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  // fetch categories
  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getCategories();

      set({
        categories: res.data,
      });

    } catch (err) {
      console.error(err);
      set({ error: "Fetch categories failed" });
      toast.error("Không thể tải danh mục");
    } finally {
      set({ loading: false });
    }
  },

  // create category
  addCategory: async (categoryRequest) => {
    try {
      const res = await createCategory(categoryRequest);

      set((state) => ({
        categories: [...state.categories, res.data],
      }));

      toast.success("Tạo danh mục thành công");

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tạo danh mục thất bại");
    }
  },

  // delete category
  removeCategory: async (id) => {
    try {
      await deleteCategoryById(id);

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));

      toast.success("Xóa danh mục thành công");

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Xóa danh mục thất bại");
    }
  },
}));

export default useCategoriesStore;