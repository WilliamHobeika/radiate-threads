import { currentUser } from "@clerk/nextjs";

import UserCard from "../cards/UserCard";

//db actions
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUsers } from "@/lib/actions/user.actions";

const RightSidebar = async () => {
  const user = await currentUser();
  if (!user) return null;

  const suggUsers = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  });

  const suggCommunities = await fetchCommunities({
    pageSize: 4,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>

        <div className="mt-7 flex flex-col w-[300px] gap-9">
          {suggCommunities.communities.length > 0 ? (
            <>
              {suggCommunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType="Community"
                  isRightSidebar
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No communities yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className="mt-7 flex w-[300px] flex-col gap-10">
          {suggUsers.users.length > 0 ? (
            <>
              {suggUsers.users.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  username={user.username}
                  imgUrl={user.image}
                  personType="User"
                  isRightSidebar
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
