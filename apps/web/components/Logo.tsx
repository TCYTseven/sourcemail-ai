import Image from "next/image";
import { BRAND_ICON_URL, BRAND_LOGO_URL, BRAND_NAME } from "@/utils/branding";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const logoUrl = BRAND_LOGO_URL || BRAND_ICON_URL;

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`${BRAND_NAME} logo`}
        width={32}
        height={32}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <svg viewBox="0 0 209 25" fill="none" className={className}>
      <title>{BRAND_NAME}</title>
      <text
        x="0"
        y="20"
        fill="currentColor"
        fontSize="24"
        fontWeight="700"
        textLength="209"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-title), ui-sans-serif, system-ui, sans-serif"
      >
        {BRAND_NAME}
      </text>
    </svg>
  );
}
