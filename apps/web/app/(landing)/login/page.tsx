import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/app/(landing)/login/LoginForm";
import {
  getEmailAlreadyLinkedDescription,
  getRequiresReconsentDescription,
} from "@/app/(landing)/login/messages";
import { env } from "@/env";
import { auth } from "@/utils/auth";
import { isGoogleOauthEmulationEnabled } from "@/utils/google/oauth";
import { getEnabledLoginProviders } from "@/utils/oauth/login-providers";
import { AlertBasic } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { WELCOME_PATH } from "@/utils/config";
import { MutedText } from "@/components/Typography";
import { normalizeInternalPath } from "@/utils/path";
import {
  BRAND_NAME,
  SUPPORT_EMAIL,
  getBrandTitle,
  getPossessiveBrandName,
} from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Log in"),
  description: `Log in to ${BRAND_NAME}.`,
  alternates: { canonical: "/login" },
};

export default async function AuthenticationPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const nextPath = normalizeInternalPath(searchParams?.next);
  const isSelfHosted = env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS;

  if (session?.user && !searchParams?.error) {
    redirect(nextPath ?? WELCOME_PATH);
  }

  const enabledProviders = Array.from(getEnabledLoginProviders());

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="mb-8">
        <Link href="/">
          <Logo className="h-10 w-10" />
        </Link>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-title text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your inbox to {BRAND_NAME}.
          </p>
        </div>

        <Suspense>
          <LoginForm
            enabledProviders={enabledProviders}
            useGoogleOauthEmulator={isGoogleOauthEmulationEnabled()}
          />
        </Suspense>

        {searchParams?.error ? <ErrorAlert error={searchParams.error} /> : null}

        {!isSelfHosted ? (
          <MutedText className="text-center text-xs">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </MutedText>
        ) : null}

        <LoginFooter
          isSelfHosted={isSelfHosted}
          selfHostedLoginFooterText={
            env.NEXT_PUBLIC_SELF_HOSTED_LOGIN_FOOTER_TEXT || undefined
          }
        />
      </div>
    </div>
  );
}

function LoginFooter({
  isSelfHosted,
  selfHostedLoginFooterText,
}: {
  isSelfHosted?: boolean;
  selfHostedLoginFooterText?: string;
}) {
  if (isSelfHosted && selfHostedLoginFooterText !== undefined) {
    const trimmedFooterText = selfHostedLoginFooterText.trim();
    if (!trimmedFooterText || trimmedFooterText.toLowerCase() === "none") {
      return null;
    }

    return (
      <MutedText className="whitespace-pre-line text-center text-xs">
        {selfHostedLoginFooterText}
      </MutedText>
    );
  }

  return (
    <MutedText className="text-center text-xs">
      {getPossessiveBrandName()} use of Google APIs adheres to the{" "}
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy"
        className="underline underline-offset-4"
      >
        Google API Services User Data Policy
      </a>
      .
    </MutedText>
  );
}

function ErrorAlert({ error }: { error: string }) {
  if (error === "RequiresReconsent") {
    return (
      <AlertBasic
        variant="destructive"
        title="Permissions need to be refreshed"
        description={getRequiresReconsentDescription({
          includeSupportText: true,
        })}
      />
    );
  }

  if (error === "OAuthAccountNotLinked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Account already attached to another user"
        description={
          <>
            <span>You can merge accounts instead.</span>
            <Button asChild className="mt-2">
              <Link href="/accounts">Merge accounts</Link>
            </Button>
          </>
        }
      />
    );
  }

  if (error === "email_already_linked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Email Already Linked"
        description={getEmailAlreadyLinkedDescription({
          includeSupportText: true,
        })}
      />
    );
  }

  return (
    <AlertBasic
      variant="destructive"
      title="Error logging in"
      description={`There was an error logging in. Please try again. If this persists, contact ${SUPPORT_EMAIL}.`}
    />
  );
}
