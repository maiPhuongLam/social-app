import { TypeOf, boolean, number, object, string } from "zod";

const params = object({
  id: string({
    required_error: "Id is required",
  }),
});
const createPostSchema = object({
  body: object({
    content: string({
      required_error: "Content is optional",
    }).optional(),
    image: string({
      required_error: "image is optional",
    }).optional(),
    imagePublicId: string({
      required_error: "imagePublicId is optional",
    }).optional(),
    link: string({
      required_error: "link is optional",
    }).optional(),
    location: string({
      required_error: "location is optional",
    }).optional(),
    published: string({
      required_error: "Published is required",
    }),
    authorId: string({
      required_error: "AuthorId is required",
    }),
  }),
});

const updatePostSchema = object({
  params,
  body: object({
    content: string({
      required_error: "Content is required",
    }).optional(),
    image: string({
      required_error: "image is optional",
    }).optional(),
    imagePublicId: string({
      required_error: "imagePublicId is optional",
    }).optional(),
    link: string({
      required_error: "link is optional",
    }).optional(),
    location: string({
      required_error: "location is optional",
    }).optional(),
    published: string({
      required_error: "Published is required",
    }).optional(),
  }),
});

const getPostSchema = object({ params });

type CreatPostDto = TypeOf<typeof createPostSchema>;
type UpdatePostDto = TypeOf<typeof updatePostSchema>;
type GetPostSchema = TypeOf<typeof getPostSchema>;
export {
  createPostSchema,
  CreatPostDto,
  updatePostSchema,
  UpdatePostDto,
  getPostSchema,
  GetPostSchema,
};
