import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export function createFollow({
  followingId,
  followerId,
}: {
  followingId: User["id"];
  followerId: User["id"];
}) {
  return prisma.follows.create({
    data: {
      followingId,
      followerId,
    },
  });
}

export function deleteFollow({
  followingId,
  followerId,
}: {
  followingId: User["id"];
  followerId: User["id"];
}) {
  return prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

export function getFollowers({ followingId }: { followingId: User["id"] }) {
  return prisma.follows.findMany({
    where: { followingId },
    select: {
      followerId: true,
    },
  });
}

export function getFollows({ followerId }: { followerId: User["id"] }) {
  return prisma.follows.findMany({
    where: { followerId },
    select: {
      followingId: true,
    },
  });
}
