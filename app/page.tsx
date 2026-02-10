"use client"

import React, { useState, useRef, useEffect } from "react"
import { KanbanColumn } from "@/components/kanban-column"
import { FullscreenAIChat } from "@/components/fullscreen-ai-chat"
import { StreamingText, ThinkingIndicator } from "@/components/streaming-text"
import type { Customer } from "@/components/customer-card"

// Sample data
const initialCustomers: Record<string, Customer[]> = {
  "pre-test-drive": [
    {
      id: "1",
      name: "张先生",
      intentLevel: "高意向",
      lastFollowUp: "2025-06-28",
      status: "待邀约",
      tags: [
        { label: "三天锁单", type: "warning" },
        { label: "待跟进", type: "orange" },
        { label: "保存心愿单", type: "info" },
        { label: "对比问界M7", type: "default" },
        { label: "公户购车人", type: "info" },
        { label: "预算20~30万", type: "default" },
      ],
    },
    {
      id: "2",
      name: "李女士",
      intentLevel: "中意向",
      lastFollowUp: "2025-06-27",
      status: "待联系",
      tags: [
        { label: "首次到店", type: "info" },
        { label: "对比Model Y", type: "default" },
        { label: "预算30~40万", type: "default" },
      ],
    },
    {
      id: "3",
      name: "王先生",
      intentLevel: "高意向",
      lastFollowUp: "2025-06-26",
      status: "待回访",
      tags: [
        { label: "二次到店", type: "success" },
        { label: "意向L9", type: "info" },
        { label: "预算40~50万", type: "default" },
      ],
    },
  ],
  "post-test-drive": [
    {
      id: "4",
      name: "赵先生",
      intentLevel: "高意向",
      lastFollowUp: "2025-06-25",
      status: "待报价",
      tags: [
        { label: "试驾满意", type: "success" },
        { label: "意向L7", type: "info" },
        { label: "本周决策", type: "warning" },
      ],
    },
    {
      id: "5",
      name: "孙女士",
      intentLevel: "中意向",
      lastFollowUp: "2025-06-24",
      status: "待二试",
      tags: [
        { label: "家人参与", type: "info" },
        { label: "对比蔚来", type: "default" },
      ],
    },
  ],
  owner: [
    {
      id: "6",
      name: "周先生",
      intentLevel: "高意向",
      lastFollowUp: "2025-06-20",
      status: "已交付",
      tags: [
        { label: "L9 Max", type: "success" },
        { label: "推荐潜力", type: "warning" },
        { label: "满意度高", type: "success" },
      ],
    },
  ],
  lost: [
    {
      id: "7",
      name: "吴先生",
      intentLevel: "低意向",
      lastFollowUp: "2025-06-15",
      status: "已战败",
      tags: [
        { label: "选择问界", type: "default" },
        { label: "价格因素", type: "default" },
      ],
    },
  ],
}

const columnConfig = [
  { id: "pre-test-drive", title: "试驾前", accentColor: "bg-blue-500" },
  { id: "post-test-drive", title: "试驾后", accentColor: "bg-amber-500" },
  { id: "owner", title: "车主", accentColor: "bg-green-500" },
  { id: "lost", title: "战败", accentColor: "bg-gray-400" },
]

const taskTabs = [
  { id: "today", label: "今日任务", current: 1, total: 57 },
  { id: "overdue", label: "逾期任务", count: 289 },
  { id: "future", label: "未来任务", count: 173 },
]

const navMenuItems = [
  { id: "workbench", label: "工作台", icon: "home", active: true },
  { id: "dashboard", label: "诊断看板", icon: "chart" },
  { id: "tasks", label: "任务列表", icon: "list" },
  { id: "customers", label: "客户列表", icon: "users" },
  { id: "content", label: "内容库", icon: "folder" },
  { id: "tools", label: "工具箱", icon: "tool" },
  { id: "profile", label: "个人头像", icon: "user" },
  { id: "settings", label: "设置", icon: "settings" },
]

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case "chart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      )
    case "list":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7h10" />
          <path d="M7 12h10" />
          <path d="M7 17h10" />
        </svg>
      )
    case "users":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case "folder":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <rect width="6" height="5" x="9" y="14" rx="1" />
        </svg>
      )
    case "tool":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    case "user":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      )
    case "settings":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    default:
      return null
  }
}

const aiQuickActions = [
  { id: "insight", label: "客户洞察", desc: "基于客户详情页的信息，深度洞察用户" },
  { id: "explore", label: "探需技巧", desc: "基于客户画像的完善度，推荐探需技巧" },
  { id: "followup", label: "跟进技巧", desc: "推荐跟进建议" },
  { id: "close", label: "促单技巧", desc: "推荐促单方案及话术" },
]

interface ChatMessage {
  id: string
  type: "user" | "agent"
  content: string
  strategy?: {
    title: string
    points: string[]
  }
  sampleMessage?: string
  actions?: string[]
  options?: { id: string; label: string }[]
  image?: {
    src: string
    alt: string
    showActions?: boolean
  }
  showUpload?: boolean
}

// Image URLs
const L9_SHOWROOM_IMAGE = "/images/l9-showroom.jpg"
const L9_CUTE_IMAGE = "/images/l9-cute.jpg"

export default function WorkbenchPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [draggingCustomerId, setDraggingCustomerId] = useState<string | null>(null)
  const [dragFromColumn, setDragFromColumn] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("today")
  const [highIntentOnly, setHighIntentOnly] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [aiFullscreen, setAiFullscreen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle option click (for multi-step marketing flow)
  const handleOptionClick = (optionId: string) => {
    setIsThinking(true)
    const customerName = selectedCustomer?.name || "王先生"
    
    setTimeout(() => {
      setIsThinking(false)
      const msgId = Date.now().toString()
      setStreamingMessageId(msgId)
      
      switch (optionId) {
        case "image-material":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: "图片素材" },
            {
              id: msgId,
              type: "agent",
              content: "那么下一步创作哪个方向的营销内容呢",
              options: [
                { id: "zhongcao", label: "种草图片" },
                { id: "highlight", label: "新车型亮点宣传" },
                { id: "promo", label: "促销政策" },
              ],
            },
          ])
          break
        case "video-material":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: "短视频素材" },
            {
              id: msgId,
              type: "agent",
              content: "短视频素材功能正在开发中，敬请期待...",
            },
          ])
          break
        case "zhongcao":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: "种草图片" },
            {
              id: msgId,
              type: "agent",
              content: "已为您检索到L9的素材库图片，是否直接使用",
              image: { src: L9_SHOWROOM_IMAGE, alt: "理想L9展厅图片" },
              options: [
                { id: "use-directly", label: "好的" },
                { id: "create-new", label: "不，新创建生成" },
              ],
            },
          ])
          break
        case "highlight":
        case "promo":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: optionId === "highlight" ? "新车型亮点宣传" : "促销政策" },
            {
              id: msgId,
              type: "agent",
              content: "该功能正在开发中，敬请期待...",
            },
          ])
          break
        case "use-directly":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: "好的" },
            {
              id: msgId,
              type: "agent",
              content: "已为您选择该素材，您可以直接分享给客户。",
              image: { src: L9_SHOWROOM_IMAGE, alt: "理想L9展厅图片", showActions: true },
            },
          ])
          break
        case "create-new":
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString() + "-user", type: "user", content: "不，新创建生成" },
            {
              id: msgId,
              type: "agent",
              content: "请上传一张图片作为创作参考：",
              showUpload: true,
            },
          ])
          break
        default:
          break
      }
    }, 800)
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsThinking(true)
    const customerName = selectedCustomer?.name || "王先生"
    
    setTimeout(() => {
      setIsThinking(false)
      const msgId = Date.now().toString()
      setStreamingMessageId(msgId)
      
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "-user", type: "user", content: "[已上传图片]" },
        {
          id: msgId,
          type: "agent",
          content: `根据您提供的${customerName}的信息结合家庭属性，考虑已成为二胎家庭，充满童趣~可爱的氛围有助于拉近彼此感情`,
          image: { src: L9_CUTE_IMAGE, alt: "理想L9童趣版营销图片", showActions: true },
        },
      ])
    }, 1500)
  }

  // Handle action button click
  const handleActionClick = (action: string) => {
    if (action === "生成营销素材") {
      setIsThinking(true)
      const customerName = selectedCustomer?.name || "王先生"
      
      setTimeout(() => {
        setIsThinking(false)
        const msgId = Date.now().toString()
        setStreamingMessageId(msgId)
        
        setChatMessages((prev) => [
          ...prev,
          {
            id: msgId,
            type: "agent",
            content: `您希望我为${customerName}创作哪种类型的营销素材呢`,
            options: [
              { id: "image-material", label: "图片素材" },
              { id: "video-material", label: "短视频素材" },
            ],
          },
        ])
      }, 800)
    }
  }

  // Handle advisor button click from customer card
  const handleAdvisorClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsThinking(true)
    setChatMessages([])
    
    // Simulate thinking delay
    setTimeout(() => {
      const msgId = Date.now().toString()
      setIsThinking(false)
      setStreamingMessageId(msgId)
      setChatMessages([
        {
          id: msgId,
          type: "agent",
          content: `已加载客户「${customer.name}」的信息，我可以帮您分析这位客户并提供跟进建议。请选择您需要的帮助：`,
        },
      ])
    }, 800)
  }

  // Handle quick action click
  const handleQuickAction = (actionId: string) => {
    setIsThinking(true)
    
    setTimeout(() => {
      setIsThinking(false)
      const msgId = Date.now().toString()
      setStreamingMessageId(msgId)
      
      if (actionId === "followup") {
        const customerName = selectedCustomer?.name || "王先生"
        setChatMessages((prev) => [
          ...prev,
          {
            id: msgId,
            type: "agent",
            content: "",
            strategy: {
              title: "【行动策略】",
              points: [
                "策略：精准打击停车焦虑（解决顾虑）",
                "动作：主动提出针对泊车的上门演示或邀约。",
                "话术逻辑：不谈参数，只谈场景。",
              ],
            },
            sampleMessage: `${customerName}，我看您最近在关注L9的智能驾驶。L9虽然尺寸比较大，但最新的OTA升级后，断头路和狭窄车位泊入比老司机还稳。如果您方便，我今天或是明天把车开到您家楼下（或者您太太常去的商场），咱们专门试一下您最担心的那个车位，您亲自体验一下到底好不好停，怎么样？`,
            actions: ["一键发送至企微", "生成营销素材", "编辑"],
          },
        ])
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: msgId,
            type: "agent",
            content: `正在为您分析「${aiQuickActions.find((a) => a.id === actionId)?.label}」...`,
          },
        ])
      }
    }, 800)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDragStart = (customerId: string, fromColumn: string) => {
    setDraggingCustomerId(customerId)
    setDragFromColumn(fromColumn)
  }

  const handleDragEnd = () => {
    setDraggingCustomerId(null)
    setDragFromColumn(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault()
    if (!draggingCustomerId || !dragFromColumn || dragFromColumn === toColumn) {
      return
    }

    setCustomers((prev) => {
      const newCustomers = { ...prev }
      const customerIndex = newCustomers[dragFromColumn].findIndex(
        (c) => c.id === draggingCustomerId
      )
      if (customerIndex === -1) return prev

      const [customer] = newCustomers[dragFromColumn].splice(customerIndex, 1)
      newCustomers[toColumn] = [...newCustomers[toColumn], customer]
      return newCustomers
    })

    handleDragEnd()
  }

  // Render fullscreen AI chat if in fullscreen mode
  if (aiFullscreen) {
    return (
      <div className="h-screen w-screen max-w-[1194px] max-h-[834px] mx-auto overflow-hidden border border-border rounded-lg shadow-xl">
        <FullscreenAIChat
          isOpen={true}
          onClose={() => setAiFullscreen(false)}
          initialMessages={chatMessages}
          selectedCustomerName={selectedCustomer?.name}
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen max-w-[1194px] max-h-[834px] mx-auto flex bg-background overflow-hidden border border-border rounded-lg shadow-xl relative">
      {/* Main Content - Full Width */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Filter Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          {/* Left - Nav Button + Task Tabs */}
          <div className="flex items-center gap-3">
            {/* Nav Dropdown Button */}
            <div className="relative" ref={navRef}>
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 transition-colors"
              >
                {/* Li Auto Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h4v12H4V6z" fill="white" />
                  <path d="M10 6h4v8h6v4H10V6z" fill="white" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {navOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {navMenuItems.map((item) => (
                      <button
                        key={item.id}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-colors ${
                          item.active
                            ? "bg-teal-50 text-teal-700"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <NavIcon icon={item.icon} />
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Task Tabs */}
            <div className="flex items-center gap-1">
              {taskTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5">
                    {tab.current !== undefined
                      ? `${tab.current}/${tab.total}`
                      : tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Filter Buttons + AI Button */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              筛选
            </button>
            <button
              onClick={() => setHighIntentOnly(!highIntentOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                highIntentOnly
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={highIntentOnly ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              仅看高意向
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="flex gap-4 h-full">
            {columnConfig.map((column) => (
              <KanbanColumn
                key={column.id}
                columnId={column.id}
                title={column.title}
                count={customers[column.id]?.length || 0}
                customers={customers[column.id] || []}
                accentColor={column.accentColor}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggingCustomerId={draggingCustomerId}
                onAdvisorClick={handleAdvisorClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* AI Chat Panel - Fixed */}
      <div className={`${aiFullscreen ? 'absolute inset-0 w-full' : 'w-[375px]'} h-full bg-card border-l border-border flex flex-col transition-all duration-300`}>
        {/* Panel Header */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={() => setAiFullscreen(!aiFullscreen)}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            {aiFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            )}
          </button>
        </div>

        {/* Chat Content Area */}
        <div className={`flex-1 flex flex-col overflow-hidden px-6 ${aiFullscreen ? 'max-w-2xl mx-auto w-full' : ''}`}>
          {chatMessages.length === 0 ? (
            // Initial State - Show Avatar and Quick Actions
            <div className="flex-1 flex flex-col items-center pt-8">
              <div className="mb-4">
                {/* Robot mascot */}
                <div className="w-20 h-20 relative">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                    <line x1="50" y1="8" x2="50" y2="20" stroke="#0d9488" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="50" cy="6" r="4" fill="#0d9488"/>
                    <rect x="20" y="20" width="60" height="50" rx="12" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2"/>
                    <circle cx="38" cy="42" r="8" fill="#0d9488"/>
                    <circle cx="62" cy="42" r="8" fill="#0d9488"/>
                    <circle cx="40" cy="40" r="3" fill="white"/>
                    <circle cx="64" cy="40" r="3" fill="white"/>
                    <rect x="35" y="55" width="30" height="6" rx="3" fill="#0d9488"/>
                    <rect x="10" y="35" width="8" height="20" rx="3" fill="#0d9488"/>
                    <rect x="82" y="35" width="8" height="20" rx="3" fill="#0d9488"/>
                    <rect x="35" y="72" width="30" height="12" rx="4" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 text-center">Hi 我是SalesAgent，我可以提供以下帮助!</h3>

              {/* Quick Action Buttons - Vertical List */}
              <div className="w-full flex flex-col gap-3 mt-6">
                {aiQuickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-start gap-1 px-4 py-3 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                    <span className="text-xs text-muted-foreground">{action.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Thinking Indicator */}
              <ThinkingIndicator show={isThinking} />
              
              {chatMessages.map((msg, msgIndex) => {
                const isLatestMessage = msgIndex === chatMessages.length - 1
                const shouldStream = isLatestMessage && streamingMessageId === msg.id
                
                return (
                  <div key={msg.id} className="space-y-3">
                    {/* Simple text message */}
                    {msg.content && (
                      <p className="text-sm text-foreground leading-relaxed">
                        {shouldStream ? (
                          <StreamingText 
                            text={msg.content} 
                            speed={25}
                            onComplete={() => setStreamingMessageId(null)}
                          />
                        ) : (
                          msg.content
                        )}
                      </p>
                    )}
                    
                    {/* Strategy block */}
                    {msg.strategy && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          {shouldStream && !msg.content ? (
                            <StreamingText text={msg.strategy.title} speed={30} />
                          ) : (
                            msg.strategy.title
                          )}
                        </p>
                        <ul className="space-y-1">
                          {msg.strategy.points.map((point, idx) => (
                            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              {shouldStream ? (
                                <StreamingText text={point} speed={20} />
                              ) : (
                                point
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Sample message */}
                    {msg.sampleMessage && (
                      <p className="text-sm text-foreground leading-relaxed">
                        {shouldStream ? (
                          <StreamingText 
                            text={msg.sampleMessage} 
                            speed={15}
                            onComplete={() => setStreamingMessageId(null)}
                          />
                        ) : (
                          msg.sampleMessage
                        )}
                      </p>
                    )}
                    
                    {/* Action buttons */}
                    {msg.actions && !streamingMessageId && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {msg.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              
              {/* Quick Actions after messages */}
              {!isThinking && !streamingMessageId && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">继续选择：</p>
                  <div className="flex flex-wrap gap-2">
                    {aiQuickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="px-3 py-1.5 text-xs bg-muted/50 rounded-lg hover:bg-muted transition-colors text-foreground"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-full">
            <input
              type="text"
              placeholder="请输入或按住说话"
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-teal-600 hover:text-teal-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
