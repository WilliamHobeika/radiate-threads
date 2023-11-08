import { formatDateString } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

import DeleteThread from "../forms/DeleteThread";

export interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: ThreadCardProps) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7 mb-10" : "bg-dark-2 p-7 "
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex">
                <div className="flex rounded-full h-8 w-8 items-center justify-center hover:bg-gradient-to-r hover:from-secondary-400 hover:to-primary-400">
                  <Link href={`/thread/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={20}
                      height={20}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                </div>
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl
                    {comments.length > 1 || comments.length == 0 ? "ies" : "y"}{" "}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* deleting thread */}
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {/* displaying first 3 users' images and the number of replies */}
      {!isComment && comments.length > 0 ? (
        <Link href={`/thread/${id}`}>
          <div className="mt-3 flex items-center gap-2 bg-light-1 w-fit px-2 py-2 rounded-md">
            {comments.slice(0, 3).map((comment, index) => (
              <div className={`relative h-7 w-7 ${index !== 0 && "-ml-4"}`}>
                <Image
                  key={index}
                  src={comment.author.image}
                  alt={`user_${index}`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ))}

            <p className="text-subtle-medium text-dark-4">
              {comments.length} repl
              {comments.length > 1 || comments.length == 0 ? "ies" : "y"}{" "}
            </p>
          </div>
        </Link>
      ) : (
        <p className="mt-2 text-subtle-medium text-gray-1">Be the first to reply</p>
      )}

      {/* displaying community details if the thread belongs one */}
      {!isComment && community && (
        <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
          <p className="text-subtle-medium leading-none text-gray-1">
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>
          <div className="relative w-6 h-6 max-sm:hidden">
            <Image
              src={community.image}
              alt={community.name}
              fill
              className="ml-1 rounded-full object-cover"
            />
          </div>
        </Link>
      )}

      {!isComment && !community && (
        <div className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">{formatDateString(createdAt)}</p>
        </div>
      )}
    </article>
  );
};

export default ThreadCard;
