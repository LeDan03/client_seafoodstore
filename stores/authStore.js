import { create } from "zustand"

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  accessToken: null,

  setAuth: (data) =>
    set({
      user: data.user,
      role: data.user.roleName,
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