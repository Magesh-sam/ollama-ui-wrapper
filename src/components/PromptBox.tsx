import { useState, type SubmitEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { ModelsDropdown } from "./ModelsDropdown";
import ChatMessages from "./ChatMessages";
import { useModelStore } from "@/store/useModelStore";
import { useChatStore } from "@/store/useChatStore"; // FUNCTIONALITY: Import the new chat store

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface PromptBoxProps {
  models: { name: string }[]
}

function PromptBox({ models }: PromptBoxProps) {
  // FUNCTIONALITY: Extract chat data and actions from the Zustand chat store
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const createChat = useChatStore((state) => state.createChat);

  // FUNCTIONALITY: Get messages list for the currently active chat
  const activeChat = activeChatId ? chats[activeChatId] : null;
  const messages = activeChat?.messages || [];

  const [promptText, setPromptText] = useState("");
  const model = useModelStore((state)=>state.model);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptText.trim()) return;

    // FUNCTIONALITY: Fallback to auto-select the first model if none is active
    let currentModel = model;
    if (!currentModel && models.length > 0) {
      currentModel = models[0].name;
      useModelStore.getState().setModel(currentModel);
    }

    // FUNCTIONALITY: If there is no active chat session, create one first
    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = createChat(currentModel);
    }

    const userMessage: Message = {
      role: "user",
      content: promptText,
    };

    // FUNCTIONALITY: Store user message in Zustand (persisting to localStorage)
    addMessage(currentChatId, userMessage);
    setPromptText("");

    // FUNCTIONALITY: Run the streaming response with the updated messages array
    const updatedChat = useChatStore.getState().chats[currentChatId];
    if (updatedChat) {
      await chatStream(currentChatId, updatedChat.messages, currentModel);
    }
  };

  const chatStream = async (chatId: string, messages: Message[], selectedModel: string) => {
    try {
      // FUNCTIONALITY: Initialize empty assistant message in Zustand
      addMessage(chatId, {
        role: "assistant",
        content: "",
      });

      const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          stream: true,
        }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let assistantResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line);

            const chunk = json.message?.content ?? "";

            assistantResponse += chunk;

            // FUNCTIONALITY: Stream text updates directly into the Zustand store
            updateLastMessage(chatId, assistantResponse);
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);

          assistantResponse += json.message?.content ?? "";

          // FUNCTIONALITY: Stream remaining buffer into the Zustand store
          updateLastMessage(chatId, assistantResponse);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="relative max-h-screen bg-background">
      <div className=" overflow-y-auto pb-52">
        <ChatMessages messages={messages} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 border-t bg-background/95 px-6 py-6 backdrop-blur"
      >
        <div className="relative mx-auto max-w-2xl">
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-28 w-full resize-none p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:shadow-[0_8px_30px_var(--color-primary)]/35"
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <ModelsDropdown models={models} />

            <Button type="submit" size="icon">
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PromptBox;