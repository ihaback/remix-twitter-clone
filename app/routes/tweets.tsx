import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { AppShell, Header, TweetList } from "~/components";
import { getFollows } from "~/models/follow.server";
import invariant from "tiny-invariant";

import { createTweet, getTweetListItems } from "~/models/tweet.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  invariant(userId, "userId not found");

  const follows = await getFollows({ followerId: userId });

  const followsIds = [userId, ...follows.map((x) => x.followingId)];

  const tweetListItems = await getTweetListItems({ userIds: followsIds });
  return json({ tweetListItems });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const body = formData.get("body");

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  await createTweet({ body, userId });

  return redirect(`/tweets`);
};

export default function TweetsPage() {
  const data = useLoaderData<typeof loader>();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  let isCreating = navigation.state === "submitting";

  useEffect(() => {
    if (!isCreating && formRef?.current) {
      formRef.current.reset();
    }
  }, [isCreating]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <AppShell
        main={
          <>
            <Form
              ref={formRef}
              method="post"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
              className="feed-padding"
            >
              <label className="flex w-full flex-col gap-1">
                <textarea
                  ref={bodyRef}
                  name="body"
                  rows={6}
                  className="w-full flex-1 rounded-md border-2 border-gray-200 px-3 py-2 text-lg leading-6 focus:border-blue-500"
                  aria-invalid={actionData?.errors?.body ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.body ? "body-error" : undefined
                  }
                />
              </label>
              {actionData?.errors?.body ? (
                <div className="pt-1 text-red-700" id="body-error">
                  {actionData.errors.body}
                </div>
              ) : null}

              <div className="text-right">
                <button
                  type="submit"
                  name="intent"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600  disabled:bg-blue-200"
                  disabled={isCreating}
                >
                  Post
                </button>
              </div>
            </Form>
            <TweetList tweetListItems={data?.tweetListItems} />
          </>
        }
        outlet={<Outlet />}
      />
    </div>
  );
}
