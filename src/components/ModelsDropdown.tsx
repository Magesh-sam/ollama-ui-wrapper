"use client"

import * as React from "react"

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

export function ModelsDropdown({ models }: { models: string[] }) {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            {" "}
            Models{" "}
            <ChevronDown className="ml-2 h-4 w-4" data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>AI Models </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            {models.map((model: string) => (
              <DropdownMenuRadioItem
                className="focus:bg-primary/10"
                key={model}
                value={model}
              >
                {model}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
