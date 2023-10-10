import { TypeOf, boolean, number, object, string } from "zod";

const params = object({
  id: string({
    required_error: "Id is required",
  }),
});
const createPostSchema = object({
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
    published: boolean({
      required_error: "Published is required",
    }),
    authorId: number({
      required_error: "AuthorId is required",
    }),
  }),
});

const updatePostSchema = object({
  params,
  body: object({
    title: string({
      required_error: "Title is required",
    }).optional(),
    content: string({
      required_error: "Content is required",
    }).optional(),
    published: boolean({
      required_error: "Published is required",
    }).optional(),
  }),
});

const getPostSchema = object({ params });

type CreatPostDto = TypeOf<typeof createPostSchema>;
type UpdatePostDto = TypeOf<typeof updatePostSchema>;

export {
  createPostSchema,
  CreatPostDto,
  updatePostSchema,
  UpdatePostDto,
  getPostSchema,
};
