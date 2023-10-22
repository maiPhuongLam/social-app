import { TypeOf, object, string } from "zod";

const followSchema = object({
  params: object({
    followedId: string({
      required_error: "followedId is required",
    }),
  }),
});

type FollowDto = TypeOf<typeof followSchema>;
export { followSchema, FollowDto };
