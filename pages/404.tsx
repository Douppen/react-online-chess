import Link from "next/link";

export default function Custom404() {
  return (
    <div className="space-y-6">
      <p className="text-3xl">404 - Page Not Found</p>
      <Link href="/">
        <button className="orangebutton px-4 py-3">Return to homepage</button>
      </Link>
    </div>
  );
}
