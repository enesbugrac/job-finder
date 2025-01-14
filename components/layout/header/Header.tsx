import Link from "next/link";
import { HeaderActions } from "./HeaderActions";

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-1 md:px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="text-lg font-semibold text-primary">
            ACME
          </Link>
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
