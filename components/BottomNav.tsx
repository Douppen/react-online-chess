import { Link } from "./Link";

const BottomNav = () => {
  return (
    <nav className="w-screen fixed bottom-0 left-0 flex items-center justify-around h-[72px] border-t-[1px] bg-darker border-slate-700 text-contrast text-[12px] px-2">
      <Link
        href={"/"}
        className="flex flex-col items-center justify-center w-1/4 py-3"
      >
        {({ isActive }) => (
          <>
            {isActive ? <PuzzleSolid /> : <PuzzleEmpty />}
            <p>Play</p>
          </>
        )}
      </Link>
      <Link
        href={"/train"}
        className="flex flex-col items-center justify-center w-1/4 py-3"
      >
        {({ isActive }) => (
          <>
            {isActive ? <AcademicSolid /> : <AcademicEmpty />}
            <p>Train</p>
          </>
        )}
      </Link>
      <Link
        href={"/news"}
        className="flex flex-col items-center justify-center w-1/4 py-3"
      >
        {({ isActive }) => (
          <>
            {isActive ? <NewsSolid /> : <NewsEmpty />}
            <p>News</p>
          </>
        )}
      </Link>
      <Link
        href={"/users"}
        className="flex flex-col items-center justify-center w-1/4 py-3"
      >
        {({ isActive }) => (
          <>
            {isActive ? <UserSolid /> : <UserEmpty />}
            <p>Profile</p>
          </>
        )}
      </Link>
    </nav>
  );
};
export default BottomNav;

function PuzzleEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    </svg>
  );
}

function PuzzleSolid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
    </svg>
  );
}

function NewsEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

function NewsSolid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
        clipRule="evenodd"
      />
      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
    </svg>
  );
}

function AcademicEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
      />
    </svg>
  );
}

function AcademicSolid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  );
}

function LoginEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
  );
}

function LoginSolid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function UserSolid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );
}
