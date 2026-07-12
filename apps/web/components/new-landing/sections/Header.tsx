"use client";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { cn } from "@/utils";
import { Logo } from "@/components/new-landing/common/Logo";
import { Button } from "@/components/new-landing/common/Button";
import { HeaderLinks } from "@/components/new-landing/HeaderLinks";
import { landingPageAnalytics } from "@/hooks/useAnalytics";

interface HeaderProps {
  className: string;
}

export function Header({ className }: HeaderProps) {
  const posthog = usePostHog();

  return (
    <header
      className={cn(
        "mx-auto flex h-16 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      <Logo />
      <HeaderLinks />
      <div className="flex items-center gap-2">
        <Button variant="secondary" asChild>
          <Link
            href="/login"
            onClick={() => landingPageAnalytics.logInClicked(posthog)}
          >
            Log in
          </Link>
        </Button>
        <Button asChild>
          <Link
            href="/login"
            onClick={() => landingPageAnalytics.getStartedClicked(posthog)}
          >
            <span className="relative z-10">Get started</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
