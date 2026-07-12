import type { Metadata } from "next";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { CallToAction } from "@/components/new-landing/CallToAction";
import {
  PageHeading,
  Paragraph,
} from "@/components/new-landing/common/Typography";
import { Section } from "@/components/new-landing/common/Section";
import { Gmail } from "@/components/new-landing/icons/Gmail";
import { BRAND_NAME } from "@/utils/branding";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Landing() {
  return (
    <BasicLayout>
      <Section className="mt-16 md:mt-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <PageHeading>
            AI that drafts your
            <br />
            email replies
          </PageHeading>
          <Paragraph size="lg" className="mx-auto mt-6 max-w-[560px]">
            {BRAND_NAME} pre-drafts a reply to every email from a master prompt
            your team controls. You review and send — {BRAND_NAME} never sends
            on its own.
          </Paragraph>
          <div className="mt-10">
            <CallToAction text="Get started" showSalesButton={false} />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Paragraph color="light" size="sm">
              Works with
            </Paragraph>
            <Gmail />
          </div>
        </div>
      </Section>
    </BasicLayout>
  );
}
