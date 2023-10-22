import { TypeOf, object, string } from "zod";

const createCommentSchema = object({
  params: object({
    postId: string({
      required_error: "PostId is required",
    }),
  }),
  body: object({
    content: string({
      required_error: "Content is required",
    }),
  }),
});

const deleteCommentSchema = object({
  params: object({
    commentId: string({
      required_error: "CommentId is required",
    }),
  }),
});

type CreateCommentDto = TypeOf<typeof createCommentSchema>;
type DeleteCommentDto = TypeOf<typeof deleteCommentSchema>;

export {
  createCommentSchema,
  CreateCommentDto,
  deleteCommentSchema,
  DeleteCommentDto,
};
