import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <>
      <div className="border-b bg-background">
        <div className="container mx-auto pl-728">
          <Navbar />
        </div>
      </div>
      <SidebarProvider>
        <div className="flex">
          <AppSidebar />
          <div className="flex-1 p-4">{/* Page content here */}</div>
        </div>
      </SidebarProvider>
    </>
  );
}
