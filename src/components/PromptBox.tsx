import { Textarea } from "@/components/ui/textarea"
import { ModelsDropdown } from "./ModelsDropdown"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "./ui/button"

function PromptBox({ models }: { models: string[] }) {
  return (
    <div className="relative mx-auto w-md max-w-md">
      <Textarea
        id="prompt"
        name="prompt"
        className="min-h-30 w-full resize-none p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:shadow-[0_8px_30px_var(--color-primary)]/35"
      />
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <ModelsDropdown models={models} />
        <Button
          variant="outline"
          className="transition hover:bg-primary hover:text-primary-foreground"
          size="icon"
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  )
}

export default PromptBox
