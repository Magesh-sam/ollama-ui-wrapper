import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./components/theme-provider"

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
                </ThemeProvider>
            </SidebarProvider>
        </TooltipProvider>
    )
}