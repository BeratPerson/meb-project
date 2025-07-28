import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, UserRoundCog } from "lucide-react";
import Logo from "../brand/Logo";

// Utils
import { poppins } from "@/lib/utils/fonts";
import { getInitials } from "@/lib/utils/initials";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed top-0 z-40 flex w-full transition-all header-glass">
      <div className="container flex items-center justify-between h-14 max-w-screen-2xl">
        <nav className="flex items-center gap-3 text-sm md:gap-6">
          <Link
            href="/"
            className="flex items-center"
            title="PhD Program Finder"
          >
            <Logo className="h-[22px] mr-2" />
            <span className={`${poppins.className}`}>
              <b className="text-foreground">PhD Program Finder</b>
            </span>
          </Link>
        </nav>
        <div className="relative flex items-center justify-between gap-2 space-x-2 text-sm md:justify-end">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Sign In */}
          {!session && (
            <>
              <Button asChild size="sm">
                <Link href="/signin" className="m-0">
                  Get started
                </Link>
              </Button>
            </>
          )}

          {/* User Menu */}
          {session && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session?.user?.image as string} />
                <AvatarFallback className="uppercase">
                  {getInitials(session?.user?.name as string)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href="/account">
                    <UserRoundCog className="h-4 mr-1" /> Account
                  </Link>
                </Button>
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
