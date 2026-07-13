import { useEffect, useState } from "react";
import PromptBox from "./components/PromptBox";
import { api } from "./lib/utils";

export function App() {
  const [AIModels, setAIModels] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await api.get("/tags");
      const { models } = res.data;

      setAIModels(
        models.map((model: { name: string }) => model)
      );
    };

    fetchModels();
  }, []);

  return (
    <main className="mx-auto flex max-h-screen w-full max-w-4xl flex-col">
      <div className="flex flex-1 flex-col">
        <img
          src="/ollama.png"
          alt="Ollama Logo"
          width={75}
          height={75}
          className="mx-auto mt-8"
        />

        <h1 className="my-3 text-center text-3xl font-extrabold uppercase text-primary">
          Ollama UI Wrapper
        </h1>

        <div className="">
          <PromptBox models={AIModels} />
        </div>
      </div>
    </main>
  );
}

export default App;