import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
      <Image
        src={"/logos/logo.png"}
        alt="TaskOrbit Logo"
        width={511}
        height={375}
        className="object-contain h-10 w-auto"
        priority
      />
    </Link>
  );
};
