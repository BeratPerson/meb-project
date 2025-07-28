import Logo from "@/components/core/brand/Logo";
import AuthForm from "@/components/core/forms/AuthForm";
import type { Metadata } from "next";
import styles from "../signin/page.module.scss";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "Firestarta.dev - Sign up",
  description:
    "Create a new account to get started with Firestarta.dev.",
};

export default function SignupPage() {
  return (
    <div className="container relative flex-col items-center justify-center h-dvh md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className={`relative justify-center flex-col hidden h-full p-10 text-white lg:flex ${styles.bgGrid}`}
      >
        <Link
          href="/"
          className="flex items-center"
          title="Firestarta - Next.js SaaS Boilerplate"
        >
          <Logo className="h-[120px] mr-2" />
        </Link>
      </div>
      <div className="flex items-center justify-center h-full p-10">
        <Button asChild className="absolute top-3 right-3" variant="ghost">
          <Link href="/">
            <Undo2 className="w-4 h-4 mr-2" /> Go back
          </Link>
        </Button>
        <AuthForm variant="signup" />
      </div>
    </div>
  );
} 