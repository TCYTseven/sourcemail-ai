import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "@/utils/__mocks__/prisma";

const { mockLogger } = vi.hoisted(() => ({
  mockLogger: {
    error: vi.fn(),
  },
}));

vi.mock("@/utils/prisma");

vi.mock("@/utils/middleware", () => ({
  withEmailAccount:
    (_name: string, handler: (request: any) => Promise<Response>) =>
    (request: NextRequest) =>
      handler(
        Object.assign(request, {
          auth: { emailAccountId: "email-account-1", userId: "user-1" },
          logger: mockLogger,
        }),
      ),
}));

import { GET } from "./route";

describe("GET /api/user/setup-progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("counts only the core assistant and inbox cleanup setup steps", async () => {
    prisma.emailAccount.findUnique.mockResolvedValue(
      createEmailAccount({
        rules: [],
        newsletters: [],
        dismissedHints: [],
      }),
    );

    const response = await GET(createRequest());
    const body = await response.json();

    expect(body).toMatchObject({
      steps: {
        aiAssistant: false,
        bulkUnsubscribe: false,
      },
      completed: 0,
      total: 2,
      isComplete: false,
    });
    expect(body.steps).not.toHaveProperty("calendarConnected");
    expect(body).not.toHaveProperty("teamInvite");
    expect(body).not.toHaveProperty("tabsExtensionCompleted");
  });

  it("uses rules and newsletter stats as setup completion signals", async () => {
    prisma.emailAccount.findUnique.mockResolvedValue(
      createEmailAccount({
        rules: [{ id: "rule-1" }],
        newsletters: [{ id: "newsletter-1" }],
        dismissedHints: [],
      }),
    );

    const response = await GET(createRequest());
    const body = await response.json();

    expect(body).toMatchObject({
      steps: {
        aiAssistant: true,
        bulkUnsubscribe: true,
      },
      completed: 2,
      total: 2,
      isComplete: true,
    });
  });
});

function createEmailAccount({
  rules,
  newsletters,
  dismissedHints,
}: {
  rules: { id: string }[];
  newsletters: { id: string }[];
  dismissedHints: string[];
}) {
  return {
    rules,
    newsletters,
    user: { dismissedHints },
  };
}

function createRequest() {
  return new NextRequest("http://localhost/api/user/setup-progress");
}
