"use client"

import { Bot, MessageSquare, Send, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CustomerTag {
  label: string
  type?: "warning" | "info" | "success" | "default" | "orange"
}

export interface Customer {
  id: string
  name: string
  intentLevel: "高意向" | "中意向" | "低意向"
  lastFollowUp: string
  status: string
  tags: CustomerTag[]
}

interface CustomerCardProps {
  customer: Customer
  isDragging?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  onAdvisorClick?: (customer: Customer) => void
}

const intentColors = {
  高意向: "bg-gradient-to-r from-orange-400 to-orange-500 text-white",
  中意向: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
  低意向: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700",
}

const tagColors = {
  warning: "bg-orange-100 text-orange-600 border-orange-200",
  info: "bg-blue-100 text-blue-600 border-blue-200",
  success: "bg-green-100 text-green-600 border-green-200",
  orange: "bg-orange-50 text-orange-500 border-orange-200",
  default: "bg-gray-100 text-gray-600 border-gray-200",
}

export function CustomerCard({
  customer,
  isDragging,
  onDragStart,
  onDragEnd,
  onAdvisorClick,
}: CustomerCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "bg-card rounded-lg p-3.5 shadow-sm border border-border cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group",
        isDragging && "opacity-50 shadow-lg scale-[1.02]"
      )}
    >
      {/* Header: Name and Intent */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <span className="font-medium text-card-foreground text-sm">
          {customer.name}
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            intentColors[customer.intentLevel]
          )}
        >
          {customer.intentLevel}
        </span>
      </div>

      {/* Last Follow-up */}
      <div className="text-xs text-muted-foreground mb-2.5">
        上次跟进时间：{customer.lastFollowUp} | {customer.status}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {customer.tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "px-2 py-0.5 rounded-full text-xs border",
              tagColors[tag.type || "default"]
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-border">
        <button 
          onClick={() => onAdvisorClick?.(customer)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors border border-border"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>顾问助手</span>
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors border border-border">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>写跟进</span>
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors border border-border">
          <Send className="w-3.5 h-3.5" />
          <span>发企微</span>
        </button>
      </div>
    </div>
  )
}
