import Link from "next/link";

const Header = () => {
  return (
    <nav className="h-12 bg-blue-950 text-white px-3">
      <ul className="text-white flex gap-2 h-full items-center">
        <Link href="/app/home">Home</Link>
        <Link href="/app/settings">Settings</Link>
      </ul>
    </nav>
  );
};

export default Header;
