import * as z from "zod";

//specifying  some validation constraints for the user form
export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
});
