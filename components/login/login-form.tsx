"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithGoogle,
  signInWithMagicLink,
} from "@/app/actions/login-actions";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("redirect", "/workspace");

      const result = await signInWithMagicLink(
        {
          email,
          redirect: "/workspace",
        },
        formData
      );

      if (result.error) {
        alert(result.error);
      } else if (result.success) {
        alert(result.success);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen  relative w-screen mx-6 box-border mt-8">
      <Link href="/">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-0 left-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
      </Link>
      <h1 className="text-7xl font-bold mb-5 mt-16">💽</h1>

      <div className="w-80 flex flex-col items-stretch ">
        <div className="flex flex-col w-full text-center px-6">
          <div className="mb-5">
            <h2 className=" mb-1.5 text-xl font-semibold">Log in or sign up</h2>
          </div>

          <Button
            variant="outline"
            className="h-11 px-4 rounded-xl hover:scale-[1.02] transition-all"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const result = await signInWithGoogle();
                if (result.error) {
                  alert(result.error);
                } else if (result.url) {
                  window.location.href = result.url;
                }
              } catch (error) {
                console.error("Error signing in with Google:", error);
                alert("Failed to sign in with Google. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2" />
            )}
            Continue with Google
          </Button>

          <div className="my-3 w-full flex flex-row items-center px-1">
            <div className="bg-border h-px w-full" />
            <div className="bg-white mx-4 text-sm text-muted-foreground">
              or
            </div>
            <div className="bg-border h-px w-full" />
          </div>

          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-medium border border-input rounded-xl px-4 p-2 h-11 focus:outline-none placeholder:text-muted-foreground  pl-3"
              required
            />
            <Button
              className="h-11 px-4 rounded-xl hover:scale-[1.02] transition-all"
              type="submit"
              variant={"contrast"}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Continue with email"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Google icon component
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24.1001 9.98281H23.1335V9.93301H12.3335V14.733H19.1153C18.1259 17.5272 15.4673 19.533 12.3335 19.533C8.3573 19.533 5.1335 16.3092 5.1335 12.333C5.1335 8.35681 8.3573 5.13301 12.3335 5.13301C14.1689 5.13301 15.8387 5.82541 17.1101 6.95641L20.5043 3.56221C18.3611 1.56481 15.4943 0.333008 12.3335 0.333008C5.7065 0.333008 0.333496 5.70601 0.333496 12.333C0.333496 18.96 5.7065 24.333 12.3335 24.333C18.9605 24.333 24.3335 18.96 24.3335 12.333C24.3335 11.5284 24.2507 10.743 24.1001 9.98281Z"
        fill="#fbbc05"
      />
      <path
        d="M1.71729 6.74761L5.65988 9.63901C6.72668 6.99781 9.31028 5.13301 12.3337 5.13301C14.1691 5.13301 15.8389 5.82541 17.1103 6.95641L20.5045 3.56221C18.3613 1.56481 15.4945 0.333008 12.3337 0.333008C7.72448 0.333008 3.72728 2.93521 1.71729 6.74761Z"
        fill="#ea4335"
      />
      <path
        d="M12.3329 24.3332C15.4325 24.3332 18.2489 23.147 20.3783 21.218L16.6643 18.0752C15.4595 18.9878 13.9619 19.5332 12.3329 19.5332C9.2117 19.5332 6.5615 17.543 5.5631 14.7656L1.6499 17.7806C3.6359 21.6668 7.6691 24.3332 12.3329 24.3332Z"
        fill="#34a853"
      />
      <path
        d="M24.1001 9.98339H23.1335V9.93359H12.3335V14.7336H19.1153C18.6401 16.0758 17.7767 17.2332 16.6631 18.0762C16.6637 18.0756 16.6643 18.0756 16.6649 18.075L20.3789 21.2178C20.1161 21.4566 24.3335 18.3336 24.3335 12.3336C24.3335 11.529 24.2507 10.7436 24.1001 9.98339Z"
        fill="#4285f4"
      />
    </svg>
  );
}
