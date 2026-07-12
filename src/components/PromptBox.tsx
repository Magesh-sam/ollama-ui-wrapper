import { useState, type SubmitEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { ModelsDropdown } from "./ModelsDropdown";
import ChatMessages from "./ChatMessages";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function PromptBox({ models }: { models: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptText.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: promptText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setPromptText("");

    await chatStream(updatedMessages);
  };

  const chatStream = async (messages: Message[]) => {
    try {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral",
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

            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantResponse,
              };

              return updated;
            });
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);

          assistantResponse += json.message?.content ?? "";

          setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantResponse,
            };

            return updated;
          });
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
      {/* Scrollable chat */}
      <div className=" overflow-y-auto pb-52">
        <ChatMessages messages={messages} />
      </div>

      {/* Fixed input */}
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