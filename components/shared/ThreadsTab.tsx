import { redirect } from "next/navigation";

//db actions
import { fetchUserThreads } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
  const result = await fetchUserThreads(accountId);
  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  id: result.id,
                  name: result.name,
                  image: result.image,
                }
              : {
                  id: thread.author.id,
                  name: thread.author.name,
                  image: thread.author.image,
                }
          } //check if we should get the data from the result directly or from the thread itseld
          community={thread.community} //later update to see if the current user is the one whos visiting the profile
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
