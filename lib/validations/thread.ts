import * as z from "zod";

//specifying  some validation constraints for the thread form
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
  accountId: z.string(),
});

//specifying  some validation constraints for the comments form (treated as a thread since a comment is a thread on its own)
export const CommnetValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
