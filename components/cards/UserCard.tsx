"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
  isRightSidebar?: boolean;
}

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  personType,
  isRightSidebar,
}: UserCardProps) => {
  const router = useRouter();

  const isCommunity = personType === "Community";

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="flex relative h-14 w-14">
          <Image
            src={imgUrl}
            alt="profile photo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className={`user-card_btn ${
          isRightSidebar
            ? "bg-dark-4"
            : "bg-gradient-to-r from-secondary-500 to-primary-500"
        } hover:bg-gradient-to-r hover:from-secondary-400 hover:to-primary-400`}
        onClick={() => {
          if (isCommunity) {
            router.push(`/communities/${id}`);
          } else {
            router.push(`/profile/${id}`);
          }
        }}
      >
        {isRightSidebar ? (
          <Image src="/assets/view.svg" alt="view profile" width={18} height={18} />
        ) : (
          <p>View</p>
        )}
      </Button>
    </article>
  );
};

export default UserCard;
