"use client";
import React, { useEffect } from "react";
import ProfilePhoto from "./shared/ProfilePhoto";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { IPostDocument } from "@/models/post.model";
import PostContent from "./PostContent";
import SocialOptions from "./SocialOptions";
import { deletePostAction, handleFollowing } from "@/lib/serveractions";
import { formatDistanceToNowStrict } from "date-fns";
import { useAppSelector } from "@/lib/hooks";

const Post = ({
  post,
  userInfo,
  isFollowing,
  setIsFollowing,
  index,
}: {
  post: IPostDocument;
  userInfo: any;
  isFollowing: string[];
  setIsFollowing: React.Dispatch<React.SetStateAction<string[]>>;
  index: number;
}) => {
  useEffect(() => {
    if (userInfo?.following?.includes(post.user.userId)) {
      setIsFollowing((prev) =>
        prev.includes(post.user.userId) ? prev : [...prev, post.user.userId]
      );
    }
  }, [userInfo,post.user.userId]);

  const { user } = useUser();
  const fullName = post?.user?.firstName + " " + post?.user?.lastName;
  const loggedInUser = user?.id === post?.user?.userId;
  const timeago = formatDistanceToNowStrict(new Date(post.createdAt), {
    addSuffix: true,
  });
  const issearching = useAppSelector((state) => state.counter.isSearching);
  const handleFolow = async (userId: string) => {
    if (isFollowing.includes(userId)) {
      const newFollowing = isFollowing.filter((id) => id !== userId);
      setIsFollowing(newFollowing);
    } else {
      setIsFollowing([...isFollowing, userId]);
    }
    await handleFollowing(userId);
  };
  return (
    <div className="bg-white my-2 mx-2 md:mx-0 rounded-lg border border-gray-300">
      <div className=" flex gap-2 p-4">
        <ProfilePhoto src={post?.user?.profilePhoto!} />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-sm font-bold">
              {fullName}{" "}
              <Badge variant={"secondary"} className="ml-2">
                You
              </Badge>
            </h1>
            <p className="text-xs text-gray-500">
              @{user ? user?.username : "username"}
            </p>

            <p className="text-xs text-gray-500">{timeago}</p>
          </div>
          {!loggedInUser && (
            <div
              className="text-blue-500 flex items-center justify-between gap-3 hover:cursor-pointer"
              onClick={() => handleFolow(post.user.userId)}
            >
              {isFollowing?.includes(post.user.userId) ? (
                <>
                  <Check size={27} />
                  <p>Following</p>
                </>
              ) : (
                <>
                  <Plus />
                  <p>Follow</p>
                </>
              )}
            </div>
          )}
        </div>
        <div>
          {loggedInUser && (
            <Button
              onClick={() => {
                const res = deletePostAction(post._id);
              }}
              size={"icon"}
              className="rounded-full"
              variant={"outline"}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      <PostContent post={post} />
      <SocialOptions post={post} />
    </div>
  );
};

export default Post;
