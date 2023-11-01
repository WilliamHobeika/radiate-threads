"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useForm } from "react-hook-form"; //package that simplifies the work with forms
import { zodResolver } from "@hookform/resolvers/zod"; //another pakcage that simplifies the work forms
import * as z from "zod";

import { CommnetValidation } from "@/lib/validations/thread";

//db functions
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommnetValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommnetValidation>) => {
    await addCommentToThread({
      threadId: threadId,
      commentText: values.thread,
      userId: JSON.parse(currentUserId),
      path: pathname,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        {/*comment input */}
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <div className="flex relative h-16 w-16">
                  <Image
                    src={currentUserImg}
                    alt="profile photo"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* submit button */}
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
