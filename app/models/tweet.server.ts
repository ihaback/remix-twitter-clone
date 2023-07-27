import type { User, Tweet } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTweet({ id }: Pick<Tweet, "id">) {
  return prisma.tweet.findFirst({
    select: {
      id: true,
      body: true,
      userId: true,
      user: { select: { email: true } },
    },
    where: { id },
  });
}

export function getTweetListItems({ userIds }: { userIds: User["id"][] }) {
  return prisma.tweet.findMany({
    where: { userId: { in: userIds } },
    select: {
      id: true,
      body: true,
      userId: true,
      user: {
        select: {
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getAllTweetListItems() {
  return prisma.tweet.findMany({
    select: {
      id: true,
      body: true,
      userId: true,
      user: {
        select: {
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTweet({
  body,
  userId,
}: Pick<Tweet, "body"> & {
  userId: User["id"];
}) {
  return prisma.tweet.create({
    data: {
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTweet({
  id,
  userId,
}: Pick<Tweet, "id"> & { userId: User["id"] }) {
  return prisma.tweet.deleteMany({
    where: { id, userId },
  });
}
