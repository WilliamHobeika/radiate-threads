import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//db function
import { fetchUser, getActivity } from "@/lib/actions/user.actions";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  //if a user tried to switch his url manually without finishing the onboarding process
  if (!userInfo?.onboarded) redirect("/onboarding");

  //get activities
  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((notification) => (
              <Link key={notification._id} href={`/thread/${notification.parentId}`}>
                <article className="activity-card">
                  <div className="flex relative rounded-full w-12 h-12 items-center justify-center">
                    <Image
                      src={notification.author.image}
                      alt="profile photo"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-400">
                      {notification.author.name}
                    </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-gray-1">You have no notifications</p>
        )}
      </section>
    </>
  );
};

export default Page;
