import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { AppShell, Header, TweetList } from "~/components";
import {
  createFollow,
  deleteFollow,
  getFollowers,
} from "~/models/follow.server";
import { getTweetListItems } from "~/models/tweet.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.profileId, "profileId not found");
  const profileUser = await getUserById(params?.profileId);

  if (!profileUser) {
    throw new Response("Not Found", { status: 404 });
  }

  const tweetListItems = await getTweetListItems({
    userIds: [profileUser?.id],
  });

  const following = await getFollowers({ followingId: params.profileId });

  const userId = await requireUserId(request);

  const isFollowing = following.some((x) => x.followerId === userId);

  return json({ profileUser, tweetListItems, isFollowing });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.profileId, "profileId not found");

  const followingId = params.profileId;

  const followerId = await requireUserId(request);

  const following = await getFollowers({ followingId: params.profileId });

  const isFollowing = following.some((x) => x.followerId === userId);

  if (isFollowing) {
    await deleteFollow({ followingId, followerId });
  } else {
    await createFollow({ followingId, followerId });
  }

  return redirect(`/profile/${followingId}`);
};

export default function ProfilePage() {
  const { profileUser, tweetListItems, isFollowing } =
    useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isUpdating = navigation.state === "submitting";

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <AppShell
        main={
          <>
            <div className="-mt-6  bg-blue-200 pt-24" />
            <div className="feed-padding flex items-center justify-between">
              <img
                className="-mt-16 h-32 w-32 cursor-pointer rounded-full border-4 border-blue-400"
                src={profileUser?.imageUrl}
                alt=""
              />
              <Form method="post">
                <button
                  className="relative top-9 rounded-full border border-gray-300 px-4 py-1.5 font-bold transition duration-150 ease-in-out hover:text-gray-400 disabled:text-gray-400"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </Form>
            </div>
            <div className="feed-padding my-1">
              <h2 className="text-xl font-bold tracking-tight">
                {profileUser.email}
              </h2>
              <span className="text-gray-500 dark:text-gray-400">
                {profileUser.id}
              </span>
            </div>
            <TweetList tweetListItems={tweetListItems} isProfile />
          </>
        }
        outlet={<Outlet />}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Tweet not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
