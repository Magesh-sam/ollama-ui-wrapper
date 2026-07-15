import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/sonner" // FUNCTIONALITY: Import Sonner Toaster for notifications

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>

            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <ThemeProvider>

                    <main className="relative mx-auto flex max-h-screen w-screen flex-col">
                       <SidebarTrigger/>
                        {children}
                      
                    </main>
                    {/* FUNCTIONALITY: Render the Toaster component under the ThemeProvider */}
                    <Toaster />
                </ThemeProvider>
            </SidebarProvider>
        </TooltipProvider>
    )
}