import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

//db functions
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  //if a user tried to switch his url manually without finishing the onboarding process
  if (!userInfo?.onboarded) redirect("/onboarding");

  //fetch all communities
  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* search bar */}
      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities found</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path="communities"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
};

export default Page;
