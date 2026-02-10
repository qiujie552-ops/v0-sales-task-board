"use client"

import React, { useState, useRef, useEffect } from "react"
import { StreamingText, ThinkingIndicator } from "@/components/streaming-text"

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
}

interface FullscreenAIChatProps {
  isOpen: boolean
  onClose: () => void
  initialMessages: ChatMessage[]
  selectedCustomerName?: string
}

const aiQuickActions = [
  { id: "insight", label: "客户洞察", desc: "基于客户详情页的信息，深度洞察用户" },
  { id: "explore", label: "探需技巧", desc: "基于客户画像的完善度，推荐探需技巧" },
  { id: "followup", label: "跟进技巧", desc: "推荐跟进建议" },
  { id: "close", label: "促单技巧", desc: "推荐促单方案及话术" },
]

const chatHistory = [
  { date: "今天", items: ["王先生L9购车咨询", "理想L8金融方案计算", "问界M9竞品对比分析"] },
  { date: "昨天", items: ["张女士L7试驾预约", "二手车置换评估流程", "家庭用户购车需求分析"] },
  { date: "本周", items: ["陈先生订单跟进话术", "理想L6新客户接待方案", "春节促销活动策划"] },
]

export function FullscreenAIChat({ isOpen, onClose, initialMessages, selectedCustomerName }: FullscreenAIChatProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false) // Declare isLoading here

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleQuickAction = (actionId: string) => {
    setIsThinking(true)
    
    setTimeout(() => {
      setIsThinking(false)
      const msgId = Date.now().toString()
      setStreamingMessageId(msgId)
      
      if (actionId === "followup") {
        const customerName = selectedCustomerName || "王先生"
        setMessages((prev) => [
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
        setMessages((prev) => [
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

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: inputValue,
      },
    ])
    setInputValue("")
    
    setIsThinking(true)
    setTimeout(() => {
      setIsThinking(false)
      const msgId = Date.now().toString()
      setStreamingMessageId(msgId)
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          type: "agent",
          content: "我理解您的需求。让我为您提供专业的建议和方案。",
          actions: ["查看详情", "生成方案", "继续咨询"],
        },
      ])
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="flex h-full w-full">
        {/* Left Sidebar */}
        <div 
          className={`${sidebarCollapsed ? 'w-16' : 'w-60'} h-full bg-white/35 backdrop-blur-xl border-r border-white/50 flex flex-col transition-all duration-300 shadow-sm`}
        >
          {/* Sidebar Header */}
          <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-b border-black/5 flex-shrink-0`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'flex-col gap-3' : 'justify-between'} mb-4`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center text-teal-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
                {!sidebarCollapsed && <span className="text-base font-semibold text-foreground">理想AI助手</span>}
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-50/60 hover:bg-teal-100/20 text-muted-foreground hover:text-teal-500 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 3V21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 10L11 13L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* New Chat Button */}
            <button 
              onClick={() => setMessages([])}
              className={`${sidebarCollapsed ? 'w-12 h-12 p-3' : 'w-full px-4 py-2.5'} bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:from-teal-600 hover:to-teal-500 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/25`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {!sidebarCollapsed && <span>开启新对话</span>}
            </button>
          </div>

          {/* History */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              {chatHistory.map((group) => (
                <div key={group.date} className="mb-5">
                  <div className="text-xs font-semibold text-muted-foreground px-1 pb-2">{group.date}</div>
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2.5 my-0.5 rounded-lg cursor-pointer text-sm text-muted-foreground hover:bg-teal-100/15 hover:text-teal-500 transition-colors truncate"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* User Profile */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-black/5 flex-shrink-0">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 cursor-pointer transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                  李
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold text-foreground truncate">李明</div>
                  <div className="text-xs text-muted-foreground truncate">152******52</div>
                </div>
              </div>
            </div>
          )}

          {/* Back to Task List Button */}
          <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-black/5 flex-shrink-0`}>
            <button
              onClick={onClose}
              className={`${sidebarCollapsed ? 'w-12 h-12 p-3' : 'w-full px-4 py-2.5'} bg-slate-100 hover:bg-slate-200 text-muted-foreground hover:text-foreground rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              {!sidebarCollapsed && <span>返回任务列表</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Chat Area */}
          <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-10">
            {messages.length === 0 ? (
              // Welcome View
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-16 h-16 mx-auto mb-6 text-primary">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4"/>
                    <path d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    <circle cx="32" cy="32" r="8" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-foreground mb-3">Hi 我是SalesAgent，我可以提供以下帮助!</h1>
                <p className="text-base text-muted-foreground mb-12">您的专属智能销售顾问，为任何销售场景提供专业支持</p>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-4 gap-5 mb-10">
                  {aiQuickActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="bg-white rounded-2xl p-8 border-2 border-slate-100 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-primary transition-all group relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center text-2xl ${
                        index === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-200' :
                        index === 1 ? 'bg-gradient-to-br from-purple-50 to-purple-200' :
                        index === 2 ? 'bg-gradient-to-br from-orange-50 to-orange-200' :
                        'bg-gradient-to-br from-green-50 to-green-200'
                      }`}>
                        {index === 0 ? '🔍' : index === 1 ? '💡' : index === 2 ? '📋' : '🎯'}
                      </div>
                      <div className="text-base font-semibold text-foreground mb-2">{action.label}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{action.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages View
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Thinking Indicator */}
                <ThinkingIndicator show={isThinking} />
                
                {messages.map((msg, msgIndex) => {
                  const isLatestMessage = msgIndex === messages.length - 1
                  const shouldStream = isLatestMessage && streamingMessageId === msg.id
                  
                  return (
                    <div key={msg.id} className="animate-fadeIn">
                      {/* Message Header */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                          msg.type === 'agent' ? 'bg-blue-50 text-primary' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {msg.type === 'agent' ? 'AI' : '我'}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{msg.type === 'agent' ? '理想助手' : '李明'}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {/* Message Body - No bubbles */}
                      <div className="ml-9 space-y-3">
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
                        
                        {msg.actions && !streamingMessageId && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.actions.map((action, idx) => (
                              <button
                                key={idx}
                                className="px-4 py-2 border border-border rounded-lg text-sm text-foreground font-medium hover:bg-muted transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="px-10 pb-8 pt-5">
            {/* Feature Buttons */}
            <div className="flex gap-3 justify-center mb-4 max-w-3xl mx-auto">
              {aiQuickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex-1 max-w-[200px] px-5 py-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl text-sm font-medium text-muted-foreground hover:bg-teal-100/25 hover:border-teal-500/30 hover:text-teal-500 hover:-translate-y-0.5 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Container */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl focus-within:border-teal-500/30 focus-within:shadow-lg focus-within:bg-white/60 transition-all">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-teal-100/20 hover:text-teal-500 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="发消息或按住说话..."
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-teal-100/20 hover:text-teal-500 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19V23M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-teal-100/20 hover:text-teal-500 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      
    </div>
  )
}
