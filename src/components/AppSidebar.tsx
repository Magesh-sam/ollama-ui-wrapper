import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction, // FUNCTIONALITY: Import the built-in action container
} from "@/components/ui/sidebar";
import { MessageSquare, SquarePen, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useModelStore } from "@/store/useModelStore";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  // FUNCTIONALITY: Hook into the Zustand store for chat history and selection
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const createChat = useChatStore((state) => state.createChat);
  const deleteChat = useChatStore((state) => state.deleteChat);

  // FUNCTIONALITY: Get currently active AI model to associate with new chats
  const model = useModelStore((state) => state.model);

  // FUNCTIONALITY: Convert chats map to an array sorted by creation date (newest first)
  const chatList = Object.values(chats).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Sidebar>
      <SidebarHeader className="text-lg font-semibold px-4 py-3">
        Chats
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* FUNCTIONALITY: Wire up "New Chat" button to create a new session in Zustand */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="hover:cursor-pointer" 
                onClick={() => createChat(model)}
              >
                <SquarePen className="size-4" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* FUNCTIONALITY: Render the real chat history from localStorage */}
            {chatList.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton 
                  className={cn(
                    "flex-1 hover:bg-primary/10",
                    chat.id === activeChatId && "bg-primary/10 font-medium"
                  )}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <MessageSquare className="size-4" />
                  <span className="truncate">{chat.title}</span>
                </SidebarMenuButton>
                
                {/* FUNCTIONALITY: Standard shadcn showOnHover action to delete the chat */}
                <SidebarMenuAction
                  showOnHover
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Delete Chat"
                >
                  <Trash2 className="size-3.5" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
