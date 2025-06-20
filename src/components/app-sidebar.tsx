"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useNavigationStore } from "@/store/navigationStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import SearchComponent from "./ui/filter-search/SearchComponent";

type SidebarItem = { title: string; url: string };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeSection = useNavigationStore((state) => state.activeSection);

  const getSidebarData = (): SidebarItem[] => {
    switch (activeSection) {
      case "School":
        return [
          { title: "Student Details", url: "/dashboard/school/students" },
          { title: "Geofence", url: "/dashboard/school/geofence" },
          { title: "Pickup And Drop", url: "/dashboard/school/pickup-drop" },
          { title: "Absent", url: "/dashboard/school/absent" },
          { title: "Present", url: "/dashboard/school/present" },
          { title: "Leave Request", url: "/dashboard/school/leave-request" },
          { title: "Status", url: "/dashboard/school/status" },
          {
            title: "Approved Request",
            url: "/dashboard/school/approved-request",
          },
          { title: "Denied Request", url: "/dashboard/school/denied-request" },
        ];
      case "Users":
        return [
          { title: "School Master", url: "/dashboard/users/school-master" },
          { title: "Branch Master", url: "/dashboard/users/branch-master" },
          { title: "Driver Approve", url: "/dashboard/users/driver-approve" },
          { title: "Student Approve", url: "/dashboard/users/student-approve" },
          {
            title: "Supervisor Approve",
            url: "/dashboard/users/supervisor-approve",
          },
          { title: "Add Device", url: "/dashboard/users/add-device" },
          { title: "Read Device", url: "/dashboard/users/read-device" },
          { title: "User Access", url: "/dashboard/users/user-access" },
          { title: "Notification", url: "/dashboard/users/notification" },
        ];
      case "Reports":
        return [
          { title: "Status Report", url: "/dashboard/reports/status-report" },
          {
            title: "Distance Report",
            url: "/dashboard/reports/distance-report",
          },
          { title: "History Report", url: "/dashboard/reports/history-report" },
          { title: "Stop Report", url: "/dashboard/reports/stop-report" },
          { title: "Travel Summary", url: "/dashboard/reports/travel-summary" },
          { title: "Trip Report", url: "/dashboard/reports/trip-report" },
          { title: "Idle Report", url: "/dashboard/reports/idle-report" },
          { title: "Alerts/Events", url: "/dashboard/reports/events" },
          {
            title: "Geofence Report",
            url: "/dashboard/reports/geofence-report",
          },
        ];
      default:
        return [{ title: "", url: "#" }];
    }
  };

  const sidebarItems: SidebarItem[] = getSidebarData();
  const [filteredItems, setFilteredItems] = React.useState<SidebarItem[]>(sidebarItems);

  React.useEffect(() => {
    setFilteredItems(sidebarItems);
  }, [activeSection]);

  // Adapter to ensure correct type for onResults
  const handleResults = (results: any[]) => {
    setFilteredItems(results as SidebarItem[]);
  };

  return (
    <Sidebar {...props} className="z-50  relative">
      <SidebarHeader  className="bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
                <SearchComponent
                data={sidebarItems}
                displayKey="title"
                onResults={handleResults}
                placeholder="Search menu..."
                className="mt-8 "
              />

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-primary text-2xl">
        <SidebarGroup>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>{item.title}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}