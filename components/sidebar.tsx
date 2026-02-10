"use client"

import React from "react"

import { useState } from "react"
import {
  Search,
  Home,
  FolderKanban,
  CheckSquare,
  BarChart3,
  LayoutGrid,
  Zap,
  Folder,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Bell,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  children?: { id: string; label: string; icon?: React.ReactNode; badge?: string }[]
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    id: "workbench",
    label: "工作台",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: "projects",
    label: "项目",
    icon: <FolderKanban className="w-4 h-4" />,
    children: [
      { id: "my-tasks", label: "我的任务", icon: <CheckSquare className="w-4 h-4" /> },
    ],
  },
  {
    id: "enterprise-stats",
    label: "企业统计",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "all",
    label: "全部",
    icon: <LayoutGrid className="w-4 h-4 px-0" />,
  },
  {
    id: "shortcuts",
    label: "捷径",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "project-sets",
    label: "项目集",
    icon: <Folder className="w-4 h-4" />,
  },
]

const viewItems = [
  { id: "all-tasks", label: "所有任务", icon: "bars", active: true },
  { id: "my-exec", label: "我执行的", icon: "grid", hidden: true },
  { id: "my-created", label: "我创建的", icon: "grid", hidden: true },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["projects"])
  const [activeItem, setActiveItem] = useState("projects")

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <aside className="w-[72px] bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">T</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <button className="w-full p-2 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors">
          <Search className="w-5 h-5 text-sidebar-foreground/70" />
        </button>
      </div>

      {/* Add Button */}
      <div className="px-3 pb-3">
        <button className="w-full p-2 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                setActiveItem(item.id)
                if (item.children) toggleExpand(item.id)
              }}
              className={cn(
                "w-full p-2 flex flex-col items-center justify-center rounded-lg transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                activeItem === item.id && "bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1 text-center leading-tight">{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-3 space-y-1 border-t border-sidebar-border">
        <button className="w-full p-2 flex flex-col items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-full p-1.5 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
            Li
          </div>
        </div>
      </div>
    </aside>
  )
}

export function SecondarySidebar() {
  return (
    <aside className="w-[220px] bg-card border-r border-border flex flex-col">
      {/* Project Header */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <button className="p-1 hover:bg-muted rounded-md">
          <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
        </button>
        <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-medium">Li</span>
        </div>
        <span className="font-medium text-sm text-foreground">li 的项目</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 h-10 border-b border-border text-sm">
        <button className="text-foreground font-medium border-b-2 border-primary pb-2 -mb-px">任务</button>
        <button className="text-muted-foreground hover:text-foreground">文档</button>
        <button className="text-muted-foreground hover:text-foreground">统计</button>
        <Plus className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索分组或视图 ..."
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Views Section */}
      <div className="flex-1 px-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">视图</span>
          <button className="p-0.5 hover:bg-muted rounded">
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-0.5">
          {viewItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {item.icon === "bars" ? (
                  <div className="flex flex-col gap-0.5">
                    <div className="w-3 h-0.5 bg-current rounded-full" />
                    <div className="w-3 h-0.5 bg-current rounded-full" />
                    <div className="w-3 h-0.5 bg-current rounded-full" />
                  </div>
                ) : (
                  <LayoutGrid className="w-3.5 h-3.5" />
                )}
              </div>
              <span>{item.label}</span>
              {item.hidden && (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
