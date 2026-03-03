import { z } from "zod"

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Email không hợp lệ"),

    phone: z
      .string()
      .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),

    password: z
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự"),

    confirmPassword: z
      .string()
      .min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })