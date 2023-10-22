import { TypeOf, object, string } from "zod";

const likeSchema = object({
  params: object({
    postId: string({
      required_error: "PostId is required",
    }),
  }),
});

type LikeDto = TypeOf<typeof likeSchema>;
export { likeSchema, LikeDto };
