"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

//db actions
import { deleteThread } from "@/lib/actions/thread.actions";

interface DeleteThreadProps {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

const DeleteThread = ({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: DeleteThreadProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={24}
      height={24}
      className="cursor-pointer object-contain transition hover:scale-125 ease-in-out"
      onClick={async () => {
        await deleteThread(JSON.parse(threadId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    />
  );
};

export default DeleteThread;
