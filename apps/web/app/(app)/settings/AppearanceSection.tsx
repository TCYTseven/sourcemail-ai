"use client";

import { Switch } from "@/components/ui/switch";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export function AppearanceSection() {
  return (
    <Item size="sm">
      <ItemContent>
        <ItemTitle>Dark mode</ItemTitle>
        <ItemDescription>
          LassoMail now uses a dark interface across the whole app.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Switch aria-label="Dark mode enabled" checked disabled />
      </ItemActions>
    </Item>
  );
}
