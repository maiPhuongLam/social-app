import { TypeOf, date, number, object, string, z } from "zod";
import { Gender } from "../../custom-type";

const getProfileSchema = object({
  params: object({
    id: string({
      required_error: "Id is required",
    }),
  }),
});

const updateProfileSchema = object({
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

type GetProfileDto = TypeOf<typeof getProfileSchema>;
type UpdateProfileDto = TypeOf<typeof updateProfileSchema>;
type UploadAvatarDto = TypeOf<typeof uploadAvatarSchema>;

export {
  getProfileSchema,
  updateProfileSchema,
  uploadAvatarSchema,
  GetProfileDto,
  UpdateProfileDto,
  UploadAvatarDto,
};
