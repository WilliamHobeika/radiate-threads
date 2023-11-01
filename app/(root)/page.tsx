import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";

//db function
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  //if a user tried to switch his url manually without finishing the onboarding process
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchThreads(1, 30);

  return (
    <>
      {/* <UserButton afterSignOutUrl="/" /> */}
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          <>
            {result.posts.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
