import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Props = {
    messages: Message[];
};

// FUNCTIONALITY: Add CopyButton component to allow copying code block contents to clipboard
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 hover:text-zinc-200 transition-colors p-1 rounded text-zinc-400 cursor-pointer"
      title="Copy Code"
    >
      {copied ? (
        <>
          <Check className="size-3 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function ChatMessages({ messages }: Props) {
    return (
        <div className="px-6 py-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-5 py-4",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                                : "bg-muted text-foreground"
                            )}
                        >
                            {/* FUNCTIONALITY: Render user messages as raw pre-wrapped text, and assistant messages as Markdown with styled HTML tags & highlighted code blocks */}
                            {message.role === "user" ? (
                              message.content
                            ) : (
                              <div className="space-y-3 break-words text-sm md:text-base leading-relaxed">
                                <ReactMarkdown
                                  components={{
                                    p({ children }) {
                                      return <p className="leading-relaxed last:mb-0">{children}</p>;
                                    },
                                    h1({ children }) {
                                      return <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0">{children}</h1>;
                                    },
                                    h2({ children }) {
                                      return <h2 className="text-lg font-semibold mt-3 mb-2 first:mt-0">{children}</h2>;
                                    },
                                    h3({ children }) {
                                      return <h3 className="text-base font-semibold mt-2 mb-1 first:mt-0">{children}</h3>;
                                    },
                                    ul({ children }) {
                                      return <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>;
                                    },
                                    ol({ children }) {
                                      return <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>;
                                    },
                                    li({ children }) {
                                      return <li>{children}</li>;
                                    },
                                    a({ href, children }) {
                                      return (
                                        <a
                                          href={href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary underline hover:text-primary/80 transition-colors"
                                        >
                                          {children}
                                        </a>
                                      );
                                    },
                                    blockquote({ children }) {
                                      return (
                                        <blockquote className="border-l-4 border-zinc-500 pl-4 italic my-2 text-muted-foreground">
                                          {children}
                                        </blockquote>
                                      );
                                    },
                                    code({ className, children, ...props }) {
                                      const match = /language-(\w+)/.exec(className || "");
                                      const language = match ? match[1] : "";
                                      const codeString = String(children).replace(/\n$/, "");

                                      if (match) {
                                        return (
                                          <div className="my-3 overflow-hidden rounded-lg border border-border bg-zinc-950 shadow-md">
                                            <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 text-xs text-zinc-400 font-sans border-b border-border select-none">
                                              <span className="font-medium uppercase">{language}</span>
                                              <CopyButton text={codeString} />
                                            </div>
                                            <div className="text-xs md:text-sm overflow-x-auto p-4 font-mono leading-normal">
                                              <SyntaxHighlighter
                                                style={oneDark as any}
                                                language={language}
                                                PreTag="div"
                                                customStyle={{
                                                  margin: 0,
                                                  padding: 0,
                                                  background: "transparent",
                                                }}
                                              >
                                                {codeString}
                                              </SyntaxHighlighter>
                                            </div>
                                          </div>
                                        );
                                      }

                                    return (
                                      <code
                                        className={cn(
                                          "rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-zinc-200 border border-zinc-700/50",
                                          className
                                        )}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
