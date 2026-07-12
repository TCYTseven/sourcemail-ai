import Link from "next/link";
import { env } from "@/env";
import { Logo } from "@/components/new-landing/common/Logo";
import { cn } from "@/utils";
import { BRAND_NAME } from "@/utils/branding";

interface FooterProps {
  className: string;
  variant?: "default" | "simple";
}

const footerLinks = [
  { name: "Pricing", href: "/pricing" },
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  {
    name: "Support",
    href: `mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`,
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className="border-t border-border/60">
      <div className={cn("px-6 py-10 lg:px-8", className)}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </div>
    </footer>
  );
}
