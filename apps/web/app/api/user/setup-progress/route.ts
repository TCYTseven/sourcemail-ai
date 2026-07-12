import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { SafeError } from "@/utils/error";
import { withEmailAccount } from "@/utils/middleware";

export type GetSetupProgressResponse = Awaited<
  ReturnType<typeof getSetupProgress>
>;

export const GET = withEmailAccount("user/setup-progress", async (request) => {
  const { emailAccountId } = request.auth;

  try {
    const result = await getSetupProgress({ emailAccountId });
    return NextResponse.json(result);
  } catch (error) {
    request.logger.error("Error fetching setup progress", {
      error,
    });
    return NextResponse.json(
      { error: "Failed to fetch setup progress" },
      { status: 500 },
    );
  }
});

async function getSetupProgress({
  emailAccountId,
}: {
  emailAccountId: string;
}) {
  const emailAccount = await prisma.emailAccount.findUnique({
    where: { id: emailAccountId },
    select: {
      rules: { select: { id: true }, take: 1 },
      newsletters: {
        where: { status: { not: null } },
        take: 1,
      },
      user: { select: { dismissedHints: true } },
    },
  });

  if (!emailAccount) {
    throw new SafeError("Email account not found");
  }

  const aiAssistantDismissed = emailAccount.user.dismissedHints.includes(
    `setup:aiAssistant:${emailAccountId}`,
  );
  const bulkUnsubscribeDismissed = emailAccount.user.dismissedHints.includes(
    `setup:bulkUnsubscribe:${emailAccountId}`,
  );

  const steps = {
    aiAssistant: emailAccount.rules.length > 0 || aiAssistantDismissed,
    bulkUnsubscribe:
      emailAccount.newsletters.length > 0 || bulkUnsubscribeDismissed,
  };

  const visibleSetupSteps = [steps.aiAssistant, steps.bulkUnsubscribe];
  const completed = visibleSetupSteps.filter(Boolean).length;
  const total = visibleSetupSteps.length;

  return {
    steps,
    completed,
    total,
    isComplete: completed === total,
  };
}
