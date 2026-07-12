"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRightIcon,
  CreditCardIcon,
  MailIcon,
  SparklesIcon,
  UserIcon,
  WebhookIcon,
} from "lucide-react";
import { ApiKeysSection } from "@/app/(app)/[emailAccountId]/settings/ApiKeysSection";
import { AppearanceSection } from "@/app/(app)/settings/AppearanceSection";
import { BillingSection } from "@/app/(app)/[emailAccountId]/settings/BillingSection";
import { CleanupDraftsSection } from "@/app/(app)/[emailAccountId]/settings/CleanupDraftsSection";
import { DeleteSection } from "@/app/(app)/[emailAccountId]/settings/DeleteSection";
import { ModelSection } from "@/app/(app)/[emailAccountId]/settings/ModelSection";
import { ResetAnalyticsSection } from "@/app/(app)/[emailAccountId]/settings/ResetAnalyticsSection";
import { WebhookSection } from "@/app/(app)/[emailAccountId]/settings/WebhookSection";
import { RuleImportExportSetting } from "@/app/(app)/[emailAccountId]/assistant/settings/RuleImportExportSetting";
import { ToggleAllRulesSection } from "@/app/(app)/[emailAccountId]/settings/ToggleAllRulesSection";
import type { GetEmailAccountsResponse } from "@/app/api/user/email-accounts/route";
import { LoadingContent } from "@/components/LoadingContent";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemCard,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { useAccounts } from "@/hooks/useAccounts";
import { useAccount } from "@/providers/EmailAccountProvider";
import { cn } from "@/utils";
import { env } from "@/env";

export default function SettingsPage() {
  const { emailAccountId: activeEmailAccountId } = useAccount();
  const { data, isLoading, error } = useAccounts();
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(
    null,
  );

  const emailAccounts = useMemo(() => {
    const accounts = data?.emailAccounts ?? [];
    return [...accounts].sort((a, b) => {
      if (a.id === activeEmailAccountId) return -1;
      if (b.id === activeEmailAccountId) return 1;
      return 0;
    });
  }, [activeEmailAccountId, data?.emailAccounts]);

  return (
    <div className="content-container pb-12">
      <div className="mx-auto max-w-5xl space-y-10 pt-4">
        <PageHeader title="Settings" />

        <SettingsGroup
          icon={<MailIcon className="size-5" />}
          title="Email Accounts"
        >
          <LoadingContent loading={isLoading} error={error}>
            {emailAccounts.length > 0 && (
              <div className="space-y-4">
                {emailAccounts.map((emailAccount) => (
                  <EmailAccountSettingsCard
                    key={emailAccount.id}
                    emailAccount={emailAccount}
                    allAccounts={emailAccounts}
                    expanded={expandedAccountId === emailAccount.id}
                    onToggle={() =>
                      setExpandedAccountId((current) =>
                        current === emailAccount.id ? null : emailAccount.id,
                      )
                    }
                  />
                ))}

                <Button asChild variant="outline">
                  <Link href="/accounts">
                    <MailIcon className="mr-2 size-4" />
                    Add Account
                  </Link>
                </Button>
              </div>
            )}
          </LoadingContent>
        </SettingsGroup>

        {!env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS && (
          <SettingsGroup
            icon={<CreditCardIcon className="size-5" />}
            title="Billing"
          >
            <ItemCard>
              <BillingSection />
            </ItemCard>
          </SettingsGroup>
        )}

        {!env.NEXT_PUBLIC_AI_MODEL_SETTINGS_DISABLED && (
          <SettingsGroup
            icon={<SparklesIcon className="size-5" />}
            title="AI Model"
          >
            <ItemCard className="p-4">
              <ModelSection />
            </ItemCard>
          </SettingsGroup>
        )}

        {(env.NEXT_PUBLIC_WEBHOOK_ACTION_ENABLED !== false ||
          env.NEXT_PUBLIC_EXTERNAL_API_ENABLED) && (
          <SettingsGroup
            icon={<WebhookIcon className="size-5" />}
            title="Developer"
          >
            <ItemCard>
              {env.NEXT_PUBLIC_WEBHOOK_ACTION_ENABLED !== false && (
                <WebhookSection />
              )}
              {env.NEXT_PUBLIC_WEBHOOK_ACTION_ENABLED !== false &&
                env.NEXT_PUBLIC_EXTERNAL_API_ENABLED && <ItemSeparator />}
              {env.NEXT_PUBLIC_EXTERNAL_API_ENABLED && <ApiKeysSection />}
            </ItemCard>
          </SettingsGroup>
        )}

        <SettingsGroup icon={<UserIcon className="size-5" />} title="Account">
          <ItemCard>
            <AppearanceSection />
            <ItemSeparator />
            <Item size="sm">
              <ItemContent>
                <ItemTitle>Beta Features</ItemTitle>
                <ItemDescription>
                  Try experimental features that are still in progress.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button asChild size="sm" variant="outline">
                  <Link href="/early-access">Open</Link>
                </Button>
              </ItemActions>
            </Item>
          </ItemCard>
          <ItemCard>
            <DeleteSection />
          </ItemCard>
        </SettingsGroup>
      </div>
    </div>
  );
}

function EmailAccountSettingsCard({
  emailAccount,
  allAccounts,
  expanded,
  onToggle,
}: {
  emailAccount: GetEmailAccountsResponse["emailAccounts"][number];
  allAccounts: GetEmailAccountsResponse["emailAccounts"];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <ItemCard>
      <div
        role="button"
        tabIndex={0}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <Avatar className="size-8 rounded-full">
          <AvatarImage
            src={emailAccount.image || ""}
            alt={emailAccount.name || emailAccount.email}
          />
          <AvatarFallback className="rounded-full text-xs">
            {emailAccount.name?.charAt(0) || emailAccount.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="flex-1 text-sm font-medium">{emailAccount.email}</span>
        {emailAccount.id === allAccounts[0]?.id && (
          <Badge variant="secondary" className="text-xs font-normal">
            Active inbox
          </Badge>
        )}
        <ChevronRightIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            expanded && "rotate-90",
          )}
        />
      </div>

      {expanded && (
        <>
          <ToggleAllRulesSection emailAccountId={emailAccount.id} />
          <RuleImportExportSetting emailAccountId={emailAccount.id} />
          <CleanupDraftsSection emailAccountId={emailAccount.id} />
          <ResetAnalyticsSection emailAccountId={emailAccount.id} />
        </>
      )}
    </ItemCard>
  );
}

function SettingsGroup({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      {title && (
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <h2 className="text-sm font-medium uppercase tracking-wide">
            {title}
          </h2>
        </div>
      )}
      {children}
    </section>
  );
}
