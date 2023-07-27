import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deleteTweet,
  getTweet,
  getTweetListItems,
} from "~/models/tweet.server";
import { logout, requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.tweetId, "tweetId not found");

  const tweet = await getTweet({ id: params.tweetId });
  if (!tweet) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ tweet });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.tweetId, "tweetId not found");

  const tweetListItems = await getTweetListItems({ userIds: [userId] });

  const isTweetOwner = tweetListItems.some((x) => x.id === params.tweetId);

  if (!isTweetOwner) {
    throw await logout(request);
  }

  await deleteTweet({ id: params.tweetId, userId });

  return redirect("/tweets");
};

export default function TweetDetailsPage() {
  const { tweet } = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <div>
      <h3 className="text-2xl font-bold">{tweet.user.email}</h3>
      <p className="py-6">{tweet.body}</p>
      {user?.id === tweet.userId && (
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
      )}
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
