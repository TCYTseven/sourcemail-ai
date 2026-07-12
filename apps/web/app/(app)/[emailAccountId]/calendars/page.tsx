import { redirect } from "next/navigation";
import { prefixPath } from "@/utils/path";

export default async function CalendarsPage({
  params,
}: {
  params: Promise<{ emailAccountId: string }>;
}) {
  const { emailAccountId } = await params;
  redirect(prefixPath(emailAccountId, "/automation"));
}
