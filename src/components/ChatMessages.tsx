type Message = {
  role: "user" | "assistant"
  content: string
}

type Props = {
  messages: Message[]
}

export default function ChatMessages({ messages }: Props) {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
