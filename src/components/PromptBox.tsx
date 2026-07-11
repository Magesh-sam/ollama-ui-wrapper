import { useState, type SubmitEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { ModelsDropdown } from "./ModelsDropdown";

function PromptBox({ models }: { models: string[] }) {
  const [promptText, setPromptText] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!promptText.trim()) return;

    setText("");

    await streamResponse(promptText);

    setPromptText("");
  };

  const streamResponse = async (prompt: string) => {
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral",
          prompt,
        }),
      });


      if (!res.body) {
        console.error("No response body");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("STREAM FINISHED");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        console.log("RAW CHUNK:", chunk);

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line);

            console.log("JSON:", json);

            setText(prev => {
              const next = prev + json.response;
              console.log("UPDATED:", next);
              return next;
            });
          } catch (err) {
            console.error("PARSE ERROR:", err);
            console.log("BAD LINE:", line);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);

          setText(prev => prev + json.response);
        } catch (err) { console.log(err) }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      {
        text &&
        <div className="mb-6 min-h-32 rounded border p-4 whitespace-pre-wrap">
          {text}
        </div>
      }

      <form
        className="relative mx-auto w-md max-w-md"
        onSubmit={handleSubmit}
      >
        <Textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="min-h-30 w-full resize-none p-5  shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:shadow-[0_8px_30px_var(--color-primary)]/35"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <ModelsDropdown models={models} />

          <Button type="submit" size="icon">
            <ArrowUpIcon />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PromptBox;