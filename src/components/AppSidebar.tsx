import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageSquare, SquarePen } from "lucide-react";

const chats = [
  { id: 1, title: "React interview prep" },
  { id: 2, title: "Tailwind questions" },
  { id: 3, title: "Ollama wrapper" },
  { id: 4, title: "Streaming responses" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="text-lg font-semibold px-4 py-3">
        Chats
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem >
              <SidebarMenuButton className="hover:cursor-default" >
                <SquarePen className="size-4" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton className="hover:bg-primary/10" >
                  <MessageSquare className="size-4" />
                  <span className="truncate">{chat.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}