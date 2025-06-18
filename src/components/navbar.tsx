"use client";

import * as React from "react";
import Link from "next/link";
import { useNavigationStore } from "@/store/navigationStore";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogoutButton } from "./logout-button";

export function Navbar() {
  const setActiveSection = useNavigationStore(
    (state) => state.setActiveSection
  );
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {["Dashboard", "School", "Users", "Reports"].map((section) => (
          <NavigationMenuItem key={section}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              onClick={() => {
                if (section !== "Dashboard") {
                  setActiveSection(section);
                }
              }}
            >
              <Link href={section === "Dashboard" ? "/dashboard" : "#"}>
                {section}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <LogoutButton />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
