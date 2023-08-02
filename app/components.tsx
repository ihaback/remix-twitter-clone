import { Form, Link, NavLink, useLocation } from "@remix-run/react";
import { classNames, useOptionalUser } from "./utils";
import {
  HomeIcon,
  UsersIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

export function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to="/tweets">Tweets</Link>
      </h1>
      <p>{user?.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}

export function AppShell({
  main = null,
  outlet = null,
}: {
  main: React.ReactNode;
  outlet: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full grow lg:flex">
      <div className="flex-1 xl:flex">
        <div className="border-b border-gray-200 pt-0 xl:w-80 xl:shrink-0 xl:border-b-0 xl:border-r xl:pt-6">
          <Sidebar />
        </div>

        <div className="py-6 xl:flex-1">{main}</div>
      </div>

      <div className="relative shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-4/12 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
        <div className="sticky top-6">{outlet}</div>
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const user = useOptionalUser();

  const navigation = [
    { to: "/tweets", text: "Tweets", icon: HomeIcon },
    { to: `/profile/${user?.id}`, text: "Profile", icon: FaceSmileIcon },
    { to: `/users`, text: "Users", icon: UsersIcon },
  ];

  return (
    <nav className="flex flex-1 flex-col" aria-label="Sidebar">
      <ul>
        {navigation.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-gray-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-500",
                  "pointer group flex items-center gap-x-3  rounded-md px-4 py-6 align-middle text-sm font-semibold leading-6 lg:px-8  xl:px-4 xl:py-4"
                )
              }
            >
              <item.icon
                className={classNames(
                  location.pathname.includes(item.to)
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-blue-500",
                  "h-7 w-8 shrink-0"
                )}
                aria-hidden="true"
              />
              <span>{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function TweetList({
  tweetListItems,
  isProfile,
}: {
  tweetListItems: {
    id: string;
    body: string;
    userId: string;
    user?: {
      email: string;
      imageUrl: string;
    };
  }[];
  isProfile?: boolean;
}) {
  return (
    <>
      {tweetListItems.length === 0 ? (
        <p className="border-t border-t-gray-200 px-4 pt-4">No tweets yet</p>
      ) : (
        <ul className="list-none pt-6">
          {tweetListItems?.map((tweet) => (
            <li key={tweet.id} className="border-t border-t-gray-200 pl-4">
              <div className="block pt-4 sm:flex">
                <NavLink
                  className="mb-4 flex-shrink-0 sm:mb-0"
                  preventScrollReset
                  to={`/profile/${tweet.userId}`}
                >
                  <img
                    className="h-10 w-10 cursor-pointer rounded-full border-4 border-blue-400"
                    src={tweet?.user?.imageUrl}
                    alt=""
                  />
                </NavLink>
                <div className="block pt-2 sm:pl-4 sm:pt-0">
                  <NavLink
                    to={`/profile/${tweet.userId}`}
                    className="block text-base font-bold leading-none hover:text-blue-500 hover:underline"
                  >
                    {tweet?.user?.email}
                  </NavLink>
                  <NavLink
                    preventScrollReset
                    className="block pb-5 pr-4 pt-1 text-xl"
                    to={
                      isProfile
                        ? `/profile/${tweet.userId}/tweets/${tweet.id}`
                        : tweet.id
                    }
                  >
                    {tweet.body}
                  </NavLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export function UserList({
  userListItems,
}: {
  userListItems: { id: string; imageUrl: string; email: string }[];
}) {
  return (
    <ul className="-mt-6 list-none">
      {userListItems?.map((user) => (
        <li key={user.id} className="border-t border-t-gray-200 pl-4">
          <NavLink className="block pt-4 sm:flex" to={`/profile/${user.id}`}>
            <div className="mb-4 flex-shrink-0 sm:mb-0">
              <img
                className="h-10 w-10 cursor-pointer rounded-full border-4 border-blue-400"
                src={user?.imageUrl}
                alt=""
              />
            </div>
            <div className="block pt-2 sm:pl-4 sm:pt-0">
              <div className="block text-base font-bold leading-none hover:text-blue-500 hover:underline">
                {user?.email}
              </div>
              <div className="block pb-5 pr-4 pt-1 text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </div>
            </div>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
