import { TypeOf, object, string } from "zod";

const getAddressSchema = object({
  params: object({
    userId: string({
      required_error: "adddressId is required",
    }),
  }),
});

const createAddressSchema = object({
  body: object({
    city: string({
      required_error: "City is required",
    }),
    country: string({
      required_error: "Country is required",
    }),
  }),
});

const deleteAddressSchema = object({
  params: object({
    adddressId: string({
      required_error: "adddressId is required",
    }),
  }),
});

const updateAddressSchema = object({
  params: object({
    adddressId: string({
      required_error: "adddressId is required",
    }),
  }),
  body: object({
    city: string({
      required_error: "City is optional",
    }).optional(),
    country: string({
      required_error: "Country is optional",
    }).optional(),
  }),
});

type CreateAddressDto = TypeOf<typeof createAddressSchema>;
type UpdateAddressDto = TypeOf<typeof updateAddressSchema>;

type DelteAddressDto = TypeOf<typeof deleteAddressSchema>;

export {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
  getAddressSchema,
  CreateAddressDto,
  DelteAddressDto,
  UpdateAddressDto,
};
