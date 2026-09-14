"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import PromptBar from "@/components/primitives/PromptBar";
import LoadingState from "@/components/primitives/LoadingState";

/* ─────────────────────────────────────────────────────────
 * MESSAGES VIEW
 * Split-panel layout: inbox list on left, conversation
 * detail on right (shadcn mail style).
 * ───────────────────────────────────────────────────────── */

const AVATAR_IMAGES: Record<string, string> = {
  "Martin Johnson": "https://i.pravatar.cc/150?img=3",
  "Alex Chen": "https://i.pravatar.cc/150?img=7",
  "Laura Bennett": "https://i.pravatar.cc/150?img=9",
  "Maria Torres": "https://i.pravatar.cc/150?img=5",
  "David Park": "https://i.pravatar.cc/150?img=8",
  "Sophie Larsson": "https://i.pravatar.cc/150?img=10",
  "Fabian Miller": "https://i.pravatar.cc/150?img=12",
};

function Avatar({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  const src = AVATAR_IMAGES[name];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-tint text-white font-medium ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function GmailIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 193" aria-hidden="true">
      <path d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727Z" fill="#4285F4" />
      <path d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798v98.91Z" fill="#34A853" />
      <path d="m58.182 93.14-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504 58.182 93.14Z" fill="#EA4335" />
      <path d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218Z" fill="#FBBC04" />
      <path d="m0 49.504 26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23v23.273Z" fill="#C5221F" />
    </svg>
  );
}

function OutlookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="4" width="11" height="16" rx="2" fill="#0078D4" />
      <text x="6.5" y="15.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">O</text>
      <path d="M14 8.5h8a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H14V8.5Z" fill="#0078D4" opacity="0.3" />
      <path d="M14 4h8l-8 8V4Z" fill="#28A8EA" />
      <path d="M14 12l8 4-8 4V12Z" fill="#50D9FF" opacity="0.5" />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ArchiveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

function ArchiveXIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="m9.5 17 5-5" />
      <path d="m9.5 12 5 5" />
    </svg>
  );
}

function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ReplyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function ReplyAllIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 17 2 12 7 7" />
      <polyline points="12 17 7 12 12 7" />
      <path d="M22 18v-2a4 4 0 0 0-4-4H7" />
    </svg>
  );
}

function ForwardIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 17 20 12 15 7" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </svg>
  );
}

function MoreIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  status: { label: string; color: "accent" | "green" | "gray" | "orange" | "red" }[];
  unread: boolean;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "martin",
    name: "Martin Johnson",
    preview: "Thursday 3 PM works — I'll have the patient charts ready...",
    time: "9:44 AM",
    status: [
      { label: "Interested", color: "accent" },
      { label: "Meeting scheduled", color: "green" },
    ],
    unread: false,
  },
  {
    id: "alex",
    name: "Alex Chen",
    preview: "The MRI results look consistent with the initial assessment...",
    time: "9:20 AM",
    status: [{ label: "Interested", color: "accent" }],
    unread: false,
  },
  {
    id: "laura",
    name: "Laura Bennett",
    preview: "Can we discuss the medication adjustment before rounds?",
    time: "8:56 AM",
    status: [{ label: "No response", color: "gray" }],
    unread: true,
  },
  {
    id: "maria",
    name: "Maria Torres",
    preview: "The patient from cardiology is stable — discharge tomorrow...",
    time: "8:31 AM",
    status: [{ label: "Forwarded", color: "red" }],
    unread: true,
  },
  {
    id: "david",
    name: "David Park",
    preview: "Lab panel came back — CRP is elevated, let's reassess...",
    time: "Yesterday",
    status: [{ label: "Forwarded", color: "red" }],
    unread: true,
  },
  {
    id: "sophie",
    name: "Sophie Larsson",
    preview: "Post-op follow-up looks good — vitals are within normal range...",
    time: "Aug 20",
    status: [{ label: "No response", color: "gray" }],
    unread: true,
  },
  {
    id: "fabian",
    name: "Fabian Miller",
    preview: "Insurance pre-approval came through — we can proceed Friday...",
    time: "Aug 18",
    status: [{ label: "Wrong timing", color: "orange" }],
    unread: false,
  },
];

const STATUS_COLORS: Record<Conversation["status"][0]["color"], string> = {
  accent: "bg-accent-tint text-accent-ink",
  green: "bg-green-tint text-green",
  gray: "bg-inset text-ink-2",
  orange: "bg-orange-tint text-orange",
  red: "bg-red-tint text-red",
};

const SOURCE_BADGES: Record<string, { icon: React.ReactNode; color: string }> = {
  martin: { icon: <OutlookIcon size={10} />, color: "bg-[#0078D4] text-white" },
  alex: { icon: <OutlookIcon size={10} />, color: "bg-[#0078D4] text-white" },
  laura: { icon: <GmailIcon size={10} />, color: "bg-[#ea4335] text-white" },
  maria: { icon: <GmailIcon size={10} />, color: "bg-[#ea4335] text-white" },
  david: { icon: <OutlookIcon size={10} />, color: "bg-[#0078D4] text-white" },
  sophie: { icon: <GmailIcon size={10} />, color: "bg-[#00897b] text-white" },
  fabian: { icon: <GmailIcon size={10} />, color: "bg-[#ea4335] text-white" },
};

function ConversationRow({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const badge = SOURCE_BADGES[conversation.id];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${
        isSelected ? "bg-hover-2" : "hover:bg-hover"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar name={conversation.name} size={40} />
        {badge && (
          <div className={`absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full ${badge.color} ring-2 ring-page`}>
            {badge.icon}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[13px] truncate font-medium ${conversation.unread ? "text-ink" : "text-ink"}`}>
            {conversation.name}
          </span>
          <span className="shrink-0 text-[11px] text-ink-3 tabular-nums font-mono">{conversation.time}</span>
        </div>
        <p className="mt-0.5 text-[12px] text-ink-2 truncate">{conversation.preview}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {conversation.status.map((s) => (
            <span key={s.label} className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium uppercase font-mono ${STATUS_COLORS[s.color]}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
      {conversation.unread && (
        <div className="mt-1.5 shrink-0 size-2.5 rounded-full bg-accent" />
      )}
    </button>
  );
}

function StreamingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block size-[2px] animate-pulse bg-ink ml-0.5" />}
    </span>
  );
}

export function AiAssistantPanel({ conversation, onClose }: { conversation: Pick<Conversation, "id" | "name">; onClose: () => void }) {
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-l border-line bg-page" style={{ animation: "fade-in 200ms ease both" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-control bg-orange-tint text-orange">
            <span className="text-[13px]">✦</span>
          </div>
          <span className="text-[13px] font-semibold text-ink">AI Assistant</span>
        </div>
        <Button variant="quiet" size="xs" onClick={onClose}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-5">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[280px] rounded-card bg-field px-3.5 py-2 text-[13px] leading-relaxed text-ink shadow-hairline">
              Generate a reply to {conversation.name} about the patient referral
            </div>
          </div>

          {/* AI typing indicator */}
          {showTyping && (
            <div className="flex gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-tint text-orange">
                <span className="text-[11px]">✦</span>
              </div>
              <div className="rounded-card rounded-tl-[4px] bg-inset px-4 py-2.5 shadow-hairline">
                <LoadingState label="Composing" variant="Dots" />
              </div>
            </div>
          )}

          {/* AI response with streaming */}
          <div className="flex gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-tint text-orange">
              <span className="text-[11px]">✦</span>
            </div>
            <div className="min-w-0 max-w-[280px]">
              <div className="rounded-card rounded-tl-[4px] bg-inset px-4 py-3 text-[13px] leading-relaxed text-ink shadow-hairline">
                <StreamingText text={`Hi ${conversation.name.split(" ")[0]},\n\nThank you for the follow-up. I've reviewed the lab results and agree that a joint consultation is the right approach.\n\nThursday at 2 PM works well for me. I'll have the patient's imaging and history ready for review.\n\nBest,\nDr. Höller`} />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <Button variant="primary" size="xs">Use this draft</Button>
                <Button variant="secondary" size="xs">Regenerate</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-line px-4 py-3">
        <PromptBar
          demo={false}
          placeholder="Ask AI to adjust the draft..."
          hideModelPicker
        />
      </div>
    </div>
  );
}

function ConversationDetail({ conversation, onGenerateDraft }: {
  conversation: Conversation;
  onGenerateDraft: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-[14px] bg-page">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-0.5">
          <Button variant="quiet" size="xs" title="Archive"><ArchiveIcon size={16} /></Button>
          <Button variant="quiet" size="xs" title="Move to junk"><ArchiveXIcon size={16} /></Button>
          <Button variant="quiet" size="xs" title="Delete"><TrashIcon size={16} /></Button>
          <div className="mx-1 h-6 w-px shrink-0 bg-line" />
          <Button variant="quiet" size="xs" title="Snooze"><ClockIcon size={16} /></Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="quiet" size="xs" title="Reply"><ReplyIcon size={16} /></Button>
          <Button variant="quiet" size="xs" title="Reply all"><ReplyAllIcon size={16} /></Button>
          <Button variant="quiet" size="xs" title="Forward"><ForwardIcon size={16} /></Button>
          <div className="mx-1 h-6 w-px shrink-0 bg-line" />
          <Button variant="quiet" size="xs" title="More"><MoreIcon size={16} /></Button>
        </div>
      </div>

      {/* Message Header */}
      <div className="flex items-start gap-4 px-6 py-4">
        <Avatar name={conversation.name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-ink">{conversation.name}</div>
          <div className="mt-0.5 text-[12px] text-ink-3">Patient Referral Follow-Up</div>
          <div className="mt-0.5 text-[12px] text-ink-3">
            <span className="font-medium">Reply-To:</span> {conversation.name.toLowerCase().replace(" ", ".")}@hospital.org
          </div>
        </div>
        <div className="shrink-0 text-[11px] text-ink-3">Today, 9:00 AM</div>
      </div>

      <div className="h-px w-full bg-line" />

      {/* Message Body */}
      <div className="min-h-0 flex-1 whitespace-pre-wrap px-6 py-5 text-[13px] leading-relaxed text-ink">
        {conversation.preview.replace("Du: ", "")}

        {"\n\n"}Dr. {conversation.name.split(" ")[1]}, I wanted to follow up on the patient referral we discussed last week. I've reviewed the lab results and imaging, and I think a joint consultation would be the best approach.

        {"\n\n"}Can we schedule a quick case review this week? I have availability on Thursday afternoon or Friday morning. The patient is eager to get started, and I'd like to have a treatment plan in place before our next team meeting.

        {"\n\n"}Please let me know what works for you.

        {"\n\n"}Best regards, {conversation.name.split(" ")[0]}
      </div>

      <div className="h-px w-full bg-line" />

      {/* Reply Form */}
      <div className="px-6 py-4">
        <div className="rounded-control border border-line bg-field p-2.5 shadow-inset-field transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.025)]">
          <textarea
            placeholder={`Reply ${conversation.name}...`}
            className="min-h-[60px] w-full resize-none bg-transparent text-[13px] leading-[1.4] text-ink outline-none placeholder:text-ink-3"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button variant="accent" size="sm" onClick={onGenerateDraft}>
            <span>✦</span>
            <span>Generate draft</span>
          </Button>
          <Button variant="primary" size="sm">Send</Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-ink-3">
      <div className="text-[13px]">Select a conversation to read</div>
    </div>
  );
}

interface MessagesViewProps {
  showAiPanel?: boolean;
  onShowAiPanelChange?: (show: boolean) => void;
  selectedConversation?: Conversation;
}

export default function MessagesView({ 
  showAiPanel = false, 
  onShowAiPanelChange,
  selectedConversation 
}: MessagesViewProps) {
  const [selectedId, setSelectedId] = useState<string>("martin");
  const selected = selectedConversation || CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="flex h-full bg-page">
      {/* Left Panel — Inbox */}
      <div className="flex w-[380px] shrink-0 flex-col border-r border-line">
        {/* Header */}
        <div className="shrink-0 border-b border-line px-5 py-3">
          <h1 className="text-[13px] font-semibold text-ink">Messages</h1>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="xs" className="shadow-[#E0E2E5_0px_0px_0px_1px,#0000000A_0px_0px_4px]">
              <GmailIcon size={13} />
              <span>Gmail</span>
            </Button>
            <Button variant="secondary" size="xs" className="shadow-[#E0E2E5_0px_0px_0px_1px,#0000000A_0px_0px_4px]">
              <OutlookIcon size={13} />
              <span>Outlook</span>
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" size="xs" className="shadow-[#E0E2E5_0px_0px_0px_1px,#0000000A_0px_0px_4px]"><SearchIcon size={15} /></Button>
            <Button variant="secondary" size="xs" className="shadow-[#E0E2E5_0px_0px_0px_1px,#0000000A_0px_0px_4px]"><FilterIcon size={15} /></Button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="min-h-0 flex-1 overflow-y-auto scroll-hover">
          {CONVERSATIONS.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => {
                setSelectedId(conversation.id);
                onShowAiPanelChange?.(false);
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Panel — Detail */}
      <div className="min-w-0 flex-1 flex">
        {selected ? (
          <ConversationDetail
            conversation={selected}
            onGenerateDraft={() => onShowAiPanelChange?.(true)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
