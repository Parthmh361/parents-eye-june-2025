import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex bg-primary h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
            <div className="flex-1 flex justify-center mr-20">
              <Navbar />
            </div>
        </header>
        <main className="pt-16 pl-4 pr-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}