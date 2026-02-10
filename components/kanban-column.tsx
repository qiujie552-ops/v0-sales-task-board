"use client"

import React from "react"

import { Plus, MoreHorizontal } from "lucide-react"
import { CustomerCard, type Customer } from "./customer-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  count: number
  customers: Customer[]
  columnId: string
  accentColor?: string
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, columnId: string) => void
  onDragStart: (customerId: string, fromColumn: string) => void
  onDragEnd: () => void
  draggingCustomerId: string | null
  onAdvisorClick?: (customer: Customer) => void
}

export function KanbanColumn({
  title,
  count,
  customers,
  columnId,
  accentColor = "bg-primary",
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  draggingCustomerId,
  onAdvisorClick,
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col min-w-[260px] flex-1"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnId)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-1 h-4 rounded-full", accentColor)} />
          <h3 className="font-medium text-foreground text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <button className="p-1 hover:bg-muted rounded-md transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Add Button */}
      <button className="flex items-center justify-center gap-1 py-2 mb-2 text-xs text-muted-foreground hover:text-primary hover:bg-card border border-dashed border-border rounded-lg transition-colors">
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Cards Container */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1 pb-2 max-h-[calc(100vh-280px)]">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            isDragging={draggingCustomerId === customer.id}
            onDragStart={() => onDragStart(customer.id, columnId)}
            onDragEnd={onDragEnd}
            onAdvisorClick={onAdvisorClick}
          />
        ))}
      </div>
    </div>
  )
}
