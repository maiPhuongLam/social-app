import { TypeOf, date, number, object, string, z } from "zod";
import { Gender } from "../custom-type";

const getUserSchema = object({
  params: object({
    id: string({
      required_error: "Id is required",
    }),
  }),
});

const updateUserSchema = object({
  params: object({
    id: string({
      required_error: "Id is required",
    }),
  }),
  body: object({
    email: string({
      required_error: "Email is required",
    }).optional(),
    password: string({
      required_error: "Password is required",
    })
      .min(5, "Password to short")
      .optional(),
    name: string({
      required_error: "Name is required",
    }).optional(),
    phone: string({
      required_error: "Phone is required",
    }).optional(),
    dateOfBirth: date({
      required_error: "DateOfBirth is required",
    }).optional(),
    gender: z.nativeEnum(Gender).optional(),
  }),
});

const uploadAvatarSchema = object({
  params: object({
    id: string({
      required_error: "Id is required",
    }),
  }),
});

type GetUserDto = TypeOf<typeof getUserSchema>;
type UpdateUserDto = TypeOf<typeof updateUserSchema>;
type UploadAvatarDto = TypeOf<typeof uploadAvatarSchema>;

export {
  getUserSchema,
  updateUserSchema,
  uploadAvatarSchema,
  GetUserDto,
  UpdateUserDto,
  UploadAvatarDto,
};
