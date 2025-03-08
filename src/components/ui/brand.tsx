"use client"

import { FC } from "react"
import { ELWSVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <ELWSVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="text-4xl font-bold tracking-wide">Chatbot UI</div>
    </div>
  )
}
