import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
}

interface ChatStore {
  chats: Record<string, ChatSession>
  activeChatId: string | null
  createChat: (model: string) => string
  addMessage: (chatId: string, message: Message) => void
  updateLastMessage: (chatId: string, content: string) => void
  setActiveChatId: (id: string | null) => void
  deleteChat: (id: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: {},
      activeChatId: null,

      createChat: (model) => {
        const id = crypto.randomUUID()
        const newChat: ChatSession = {
          id,
          title: "New Chat",
          messages: [],
          model,
          createdAt: Date.now(),
        }
        set((state) => ({
          chats: { ...state.chats, [id]: newChat },
          activeChatId: id,
        }))
        return id
      },

      addMessage: (chatId, message) =>
        set((state) => {
          const chat = state.chats[chatId]
          if (!chat) return state

          const updatedMessages = [...chat.messages, message]

          // Auto-generate title from the first user message
          let title = chat.title
          if (chat.title === "New Chat" && message.role === "user") {
            title =
              message.content.slice(0, 30) +
              (message.content.length > 30 ? "..." : "")
          }

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: updatedMessages,
                title,
              },
            },
          }
        }),

      updateLastMessage: (chatId, content) =>
        set((state) => {
          const chat = state.chats[chatId]
          if (!chat || chat.messages.length === 0) return state

          const updatedMessages = [...chat.messages]
          const lastMsg = updatedMessages[updatedMessages.length - 1]
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMsg,
            content,
          }

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: updatedMessages,
              },
            },
          }
        }),

      setActiveChatId: (id) => set({ activeChatId: id }),

      deleteChat: (id) =>
        set((state) => {
          const newChats = { ...state.chats }
          delete newChats[id]
          return {
            chats: newChats,
            activeChatId: state.activeChatId === id ? null : state.activeChatId,
          }
        }),
    }),
    {
      name: "ollama-ui-chats", // Storage key in localStorage
    }
  )
)
