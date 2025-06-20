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
      <NavigationMenuList className="flex items-center   gap-8">
        {["Dashboard", "School", "Users", "Reports"].map((section) => (
          <NavigationMenuItem key={section}>
            <NavigationMenuLink
            className="  hover:bg-[#FFE58A]"
              asChild
              onClick={() => {
                if (section !== "Dashboard") {
                  setActiveSection(section);
                }
              }}
            >
              <Link href={section === "Dashboard" ? "/dashboard" : "#"} className="bg-primary text-[110%]">
                {section}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink
          className="  hover:bg-[#FFE58A]"
            asChild
          >
            <LogoutButton/>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}