import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AppShell, Header, UserList } from "~/components";

import { getUsers } from "~/models/user.server";

export const loader = async () => {
  const userListItems = await getUsers();

  return json({ userListItems });
};

export default function UsersPage() {
  const { userListItems } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <AppShell
        main={<UserList userListItems={userListItems} />}
        outlet={null}
      />
    </div>
  );
}
