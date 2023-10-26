import { TypeOf, date, number, object, string, z } from "zod";
import { Gender } from "../../custom-type";

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
    }).email(),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
    name: string({
      required_error: "Name is required",
    }),
    phone: string({
      required_error: "Phone is required",
    }).regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
    dateOfBirth: string({
      required_error: "DateOfBirth is required",
    }),
    gender: z.nativeEnum(Gender),
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
