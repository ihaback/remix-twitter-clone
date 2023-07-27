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
        <p className="feed-padding border-t border-t-gray-200 pt-4">
          No tweets yet
        </p>
      ) : (
        <ul className="list-none pt-6">
          {tweetListItems?.map((tweet) => (
            <li key={tweet.id} className="border-t border-t-gray-200">
              <NavLink
                className={({ isActive }) =>
                  `block py-4 text-xl ${
                    isActive ? " bg-gray-50" : "hover:bg-gray-50"
                  }`
                }
                preventScrollReset
                to={
                  isProfile
                    ? `/profile/${tweet.userId}/tweets/${tweet.id}`
                    : tweet.id
                }
              >
                <div className="feed-padding sm:flex">
                  <div className="mb-4 flex-shrink-0 sm:mb-0">
                    <img
                      className="h-16 w-16 cursor-pointer rounded-full border-4 border-blue-400"
                      src={tweet?.user?.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="sm:pl-3">
                    <h4 className="text-lg font-bold hover:text-blue-500 hover:underline">
                      <Link to={`/profile/${tweet.userId}`}>
                        {tweet?.user?.email}
                      </Link>
                    </h4>
                    <p className="mt-1">{tweet.body}</p>
                  </div>
                </div>
              </NavLink>
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
        <li key={user.id} className="border-t border-t-gray-200">
          <NavLink
            className={({ isActive }) =>
              `block py-4 text-xl ${
                isActive ? " bg-gray-50" : "hover:bg-gray-50"
              }`
            }
            to={`/profile/${user.id}`}
          >
            <div className="feed-padding sm:flex">
              <div className="mb-4 flex-shrink-0 sm:mb-0">
                <img
                  className="h-16 w-16 cursor-pointer rounded-full border-4 border-blue-400"
                  src={user?.imageUrl}
                  alt=""
                />
              </div>
              <div className="sm:pl-3">
                <h4 className="text-lg font-bold hover:text-blue-500 hover:underline">
                  <span>{user?.email}</span>
                </h4>
                <p className="mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}