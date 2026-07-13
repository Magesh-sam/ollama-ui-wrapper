"use client"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown } from "lucide-react"

import { useModelStore } from "@/store/useModelStore"

interface ModelsDropdownProps {
  models: { name: string }[]
}


export function ModelsDropdown({ models }: ModelsDropdownProps) {


  const model = useModelStore((state) => state.model)
  const setModels = useModelStore((state) => state.setModel)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            {model ? model : "models"}
            <ChevronDown className="ml-2 h-4 w-4" data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>AI Models </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={model} onValueChange={setModels}>
            {models.map((model) => (
              <DropdownMenuRadioItem
                className="focus:bg-primary/10"
                key={model.name}
                value={model.name}
              >
                {model.name.split(":")[0]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
