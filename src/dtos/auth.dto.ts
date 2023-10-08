import { TypeOf, number, object, string, z } from "zod";

const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
  }),
});

const registerSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
    name: string({
      required_error: "Name is required",
    }),
  }),
});

const sendOtpSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
  }),
});

const checkOtpSchema = object({
  body: object({
    otp: number({
      required_error: "Otp is required",
    }),
  }),
});

const resetPasswordSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }),
  }),
  params: object({
    id: string({
      required_error: "UserId is required",
    }),
  }),
});

type LoginDto = TypeOf<typeof loginSchema>;
type RegisterDto = TypeOf<typeof registerSchema>;
type SendOtpDto = TypeOf<typeof sendOtpSchema>;
type CheckOtpDto = TypeOf<typeof checkOtpSchema>;
type ResetPasswordDto = TypeOf<typeof resetPasswordSchema>;

export {
  loginSchema,
  registerSchema,
  sendOtpSchema,
  checkOtpSchema,
  resetPasswordSchema,
  LoginDto,
  RegisterDto,
  SendOtpDto,
  CheckOtpDto,
  ResetPasswordDto,
};
