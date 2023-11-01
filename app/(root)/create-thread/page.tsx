import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";

//db actions
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  //if a user tried to switch his url manually without finishing the onboarding process
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Radiate a Thread</h1>

      <PostThread userId={userInfo._id.toString()} />
    </>
  );
}

export default Page;
