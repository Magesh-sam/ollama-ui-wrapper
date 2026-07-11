import { useEffect, useState } from "react"
import PromptBox from "./components/PromptBox"

export function App() {
  const [AIModels, setAIModels] = useState<string[]>([])
  useEffect(() => {
    const fetchModels = async () => {
      const res = await fetch("http://localhost:11434/api/tags")
      const tags = await res.json()
      const { models } = tags

      const modelsNames = models.map(
        (model: { name: string }) => model.name.split(":")[0]
      )
      setAIModels(modelsNames)
    }

    fetchModels()
  }, [])

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
      <img
        src="/ollama.png"
        alt="Ollama Logo"
        width={"75"}
        height={"75"}
        className="mx-auto block"
      />
      <h1 className="my-3 text-center text-3xl font-extrabold text-primary uppercase">
        Ollama UI Wrapper
      </h1>
      <PromptBox models={AIModels} />
    </main>
  )
}

export default App
