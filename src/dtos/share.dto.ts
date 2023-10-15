import { TypeOf, object, string } from "zod";

const shareSchema = object({
  params: object({
    postId: string({
      required_error: "PostId is required",
    }),
  }),
});

export { shareSchema };
