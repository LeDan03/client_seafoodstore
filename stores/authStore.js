import { create } from "zustand"

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  accessToken: null,

  setAuth: (data) =>
    set({
      user: data.user,
      role: data.roleName,
      accessToken: data.accessToken,
    }),

  logout: () =>
    set({
      user: null,
      role: null,
      accessToken: null,
    }),
}))

export default useAuthStore