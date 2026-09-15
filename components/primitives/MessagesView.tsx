"use client";

import { useState, useEffect, Fragment } from "react";
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
        className={`shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 ${className}`}
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
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <g clipPath="url(#outlook-clip)">
        <mask id="outlook-mask" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="13" height="13">
          <path d="M13 0H0V13H13V0Z" fill="white" />
        </mask>
        <g mask="url(#outlook-mask)">
          <path d="M8.79403 1.64838L1.1958 6.46462L0.542358 5.43373V4.54544C0.542358 4.22203 0.706093 3.9206 0.977401 3.74455L5.39425 0.87853C6.06717 0.441878 6.93397 0.441811 7.60697 0.878361L8.79403 1.64838Z" fill="url(#outlook-p0)" />
          <path d="M7.53872 0.836243C7.56158 0.849829 7.58424 0.863899 7.60668 0.878456L11.0537 3.11445L2.50684 8.53204L1.19531 6.46294L7.46791 2.47928C8.06205 2.10194 8.08807 1.2531 7.53872 0.836243Z" fill="url(#outlook-p1)" />
          <path d="M7.53872 0.836243C7.56158 0.849829 7.58424 0.863899 7.60668 0.878456L11.0537 3.11445L2.50684 8.53204L1.19531 6.46294L7.46791 2.47928C8.06205 2.10194 8.08807 1.2531 7.53872 0.836243Z" fill="url(#outlook-p2)" fillOpacity="0.2" />
          <path d="M5.91695 9.56653L2.50696 8.53209L9.75699 3.93639C10.3676 3.54935 10.366 2.65795 9.75403 2.27309L9.72138 2.25256L9.81538 2.31106L12.0219 3.74238C12.2933 3.91841 12.4571 4.21987 12.4571 4.54334V5.40309L5.91695 9.56653Z" fill="url(#outlook-p3)" />
          <path d="M5.91695 9.56653L2.50696 8.53209L9.75699 3.93639C10.3676 3.54935 10.366 2.65795 9.75403 2.27309L9.72138 2.25256L9.81538 2.31106L12.0219 3.74238C12.2933 3.91841 12.4571 4.21987 12.4571 4.54334V5.40309L5.91695 9.56653Z" fill="url(#outlook-p4)" fillOpacity="0.2" />
          <path d="M7.60697 0.878361C6.93397 0.441811 6.06719 0.441878 5.39425 0.87853L0.977401 3.74455C0.706093 3.9206 0.542358 4.22203 0.542358 4.54544V4.5889C0.553009 4.91353 0.723863 5.21279 0.999809 5.38676L6.49176 8.84912L11.9975 5.39203C12.2834 5.21248 12.457 4.89857 12.457 4.56095V5.40316L12.4571 4.54334C12.4571 4.21987 12.2933 3.91841 12.0219 3.74238L7.60697 0.878361Z" fill="url(#outlook-p5)" />
          <path d="M5.52336 12.4585H10.4587C11.562 12.4585 12.4564 11.5641 12.4564 10.4608V4.56085C12.4564 4.89847 12.2829 5.21238 11.9969 5.39193L4.76149 9.93512C4.3712 10.1802 4.1343 10.6087 4.13434 11.0696C4.13441 11.8367 4.75627 12.4585 5.52336 12.4585Z" fill="url(#outlook-p6)" />
          <path d="M5.52336 12.4585H10.4587C11.562 12.4585 12.4564 11.5641 12.4564 10.4608V4.56085C12.4564 4.89847 12.2829 5.21238 11.9969 5.39193L4.76149 9.93512C4.3712 10.1802 4.1343 10.6087 4.13434 11.0696C4.13441 11.8367 4.75627 12.4585 5.52336 12.4585Z" fill="url(#outlook-p7)" fillOpacity="0.4" />
          <path d="M5.52336 12.4585H10.4587C11.562 12.4585 12.4564 11.5641 12.4564 10.4608V4.56085C12.4564 4.89847 12.2829 5.21238 11.9969 5.39193L4.76149 9.93512C4.3712 10.1802 4.1343 10.6087 4.13434 11.0696C4.13441 11.8367 4.75627 12.4585 5.52336 12.4585Z" fill="url(#outlook-p8)" fillOpacity="0.5" />
          <path d="M7.5011 12.4581H2.53897C1.43566 12.4581 0.54126 11.5637 0.54126 10.4604V4.55661C0.54126 4.89359 0.714172 5.20702 0.999239 5.38673L8.22751 9.94377C8.62324 10.1932 8.86324 10.6283 8.8632 11.0961C8.86313 11.8484 8.25331 12.4581 7.5011 12.4581Z" fill="url(#outlook-p9)" />
          <path d="M7.5011 12.4581H2.53897C1.43566 12.4581 0.54126 11.5637 0.54126 10.4604V4.55661C0.54126 4.89359 0.714172 5.20702 0.999239 5.38673L8.22751 9.94377C8.62324 10.1932 8.86324 10.6283 8.8632 11.0961C8.86313 11.8484 8.25331 12.4581 7.5011 12.4581Z" fill="url(#outlook-p10)" />
          <path d="M4.33333 5.95834H1.08333C0.485025 5.95834 0 6.44337 0 7.04168V10.2917C0 10.89 0.485025 11.375 1.08333 11.375H4.33333C4.93164 11.375 5.41667 10.89 5.41667 10.2917V7.04168C5.41667 6.44337 4.93164 5.95834 4.33333 5.95834Z" fill="url(#outlook-p11)" />
          <path d="M4.33333 5.95834H1.08333C0.485025 5.95834 0 6.44337 0 7.04168V10.2917C0 10.89 0.485025 11.375 1.08333 11.375H4.33333C4.93164 11.375 5.41667 10.89 5.41667 10.2917V7.04168C5.41667 6.44337 4.93164 5.95834 4.33333 5.95834Z" fill="url(#outlook-p12)" fillOpacity="0.5" />
          <path d="M2.6937 10.3187C2.21856 10.3187 1.82849 10.1701 1.52349 9.87282C1.21848 9.57554 1.06598 9.1876 1.06598 8.709C1.06598 8.20364 1.22078 7.7949 1.53039 7.48276C1.83999 7.17062 2.24539 7.01456 2.74658 7.01456C3.22018 7.01456 3.60565 7.16393 3.90299 7.46269C4.20187 7.76145 4.35131 8.15533 4.35131 8.64435C4.35131 9.14673 4.19651 9.55176 3.88691 9.85944C3.57883 10.1656 3.1811 10.3187 2.6937 10.3187ZM2.7075 9.68776C2.96652 9.68776 3.17497 9.59932 3.33284 9.42245C3.4907 9.24557 3.56964 8.99959 3.56964 8.68447C3.56964 8.35599 3.49299 8.10034 3.33973 7.91752C3.18646 7.7347 2.98185 7.64328 2.72589 7.64328C2.46227 7.64328 2.24999 7.73767 2.08905 7.92644C1.92812 8.11372 1.84765 8.36194 1.84765 8.6711C1.84765 8.98472 1.92812 9.23294 2.08905 9.41577C2.24999 9.5971 2.45614 9.68776 2.7075 9.68776Z" fill="white" />
        </g>
      </g>
      <defs>
        <linearGradient id="outlook-p0" x1="1.86215" y1="5.95841" x2="8.79403" y2="1.65893" gradientUnits="userSpaceOnUse"><stop stopColor="#20A7FA" /><stop offset="0.4" stopColor="#3BD5FF" /><stop offset="1" stopColor="#C4B0FF" /></linearGradient>
        <linearGradient id="outlook-p1" x1="4.24773" y1="7.42458" x2="8.1067" y2="1.2455" gradientUnits="userSpaceOnUse"><stop stopColor="#165AD9" /><stop offset="0.5008" stopColor="#1880E5" /><stop offset="1" stopColor="#8587FF" /></linearGradient>
        <linearGradient id="outlook-p2" x1="7.06222" y1="7.50863" x2="2.77787" y2="4.01768" gradientUnits="userSpaceOnUse"><stop offset="0.236946" stopColor="#448AFF" stopOpacity="0" /><stop offset="0.792113" stopColor="#0032B1" /></linearGradient>
        <linearGradient id="outlook-p3" x1="6.51709" y1="8.85293" x2="13.2879" y2="4.5196" gradientUnits="userSpaceOnUse"><stop stopColor="#1A43A6" /><stop offset="0.492267" stopColor="#2052CB" /><stop offset="1" stopColor="#5F20CB" /></linearGradient>
        <linearGradient id="outlook-p4" x1="8.42843" y1="8.5939" x2="4.31409" y2="5.03363" gradientUnits="userSpaceOnUse"><stop stopColor="#0045B9" stopOpacity="0" /><stop offset="0.669859" stopColor="#0D1F69" /></linearGradient>
        <radialGradient id="outlook-p5" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.50017 0.812571) rotate(-90) scale(8.9375 9.67348)"><stop offset="0.568182" stopColor="#275FF0" stopOpacity="0" /><stop offset="0.992424" stopColor="#002177" /></radialGradient>
        <linearGradient id="outlook-p6" x1="12.4564" y1="8.46663" x2="6.45025" y2="8.46663" gradientUnits="userSpaceOnUse"><stop stopColor="#4DC4FF" /><stop offset="0.196145" stopColor="#0FAFFF" /></linearGradient>
        <radialGradient id="outlook-p7" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7.854 11.1041) rotate(-45) scale(3.83017)"><stop offset="0.259477" stopColor="#0060D1" /><stop offset="0.908166" stopColor="#0383F1" stopOpacity="0" /></radialGradient>
        <radialGradient id="outlook-p8" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.07452 13.9375) rotate(-52.6577) scale(13.0016 11.7568)"><stop offset="0.732317" stopColor="#F4A7F7" stopOpacity="0" /><stop offset="1" stopColor="#F4A7F7" /></radialGradient>
        <radialGradient id="outlook-p9" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.70227 7.66862) rotate(123.339) scale(6.85994 17.8024)"><stop stopColor="#49DEFF" /><stop offset="0.724349" stopColor="#29C3FF" /></radialGradient>
        <linearGradient id="outlook-p10" x1="-0.299997" y1="11.0911" x2="5.48283" y2="11.0869" gradientUnits="userSpaceOnUse"><stop offset="0.205882" stopColor="#6CE0FF" /><stop offset="0.535" stopColor="#50D5FF" stopOpacity="0" /></linearGradient>
        <radialGradient id="outlook-p11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-0.0193277 6.16668) rotate(46.9242) scale(7.13031)"><stop offset="0.038877" stopColor="#0091FF" /><stop offset="0.919119" stopColor="#183DAD" /></radialGradient>
        <radialGradient id="outlook-p12" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.70833 9.25707) rotate(90) scale(3.79167 4.37357)"><stop offset="0.557796" stopColor="#0FA5F7" stopOpacity="0" /><stop offset="1" stopColor="#74C6FF" /></radialGradient>
        <clipPath id="outlook-clip"><rect width="13" height="13" fill="white" /></clipPath>
      </defs>
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
      <div className="relative shrink-0 self-start mt-0.5">
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
        <div className="self-start mt-1 shrink-0 size-2.5 rounded-full bg-accent" />
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
      {displayed.split("\n").map((line, idx, arr) => (
        <Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </Fragment>
      ))}
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
    <div className="flex h-full w-full shrink-0 flex-col rounded-[14px] border-l border-line bg-page sm:w-[360px]" style={{ animation: "fade-in 200ms ease both" }}>
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

          {/* AI response with streaming — only show after composing animation */}
          {!showTyping && (
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
          )}
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
  onGenerateDraft?: () => void;
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
            <span className="font-medium">Reply-To:</span> <span className="font-mono">{conversation.name.toLowerCase().replace(" ", ".")}@hospital.org</span>
          </div>
        </div>
        <div className="shrink-0 text-[11px] text-ink-3 font-mono">Today, 9:00 AM</div>
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
  onGenerateDraft?: () => void;
  selectedConversation?: Conversation;
}

export default function MessagesView({
  onGenerateDraft,
  selectedConversation
}: MessagesViewProps) {
  const [selectedId, setSelectedId] = useState<string>("martin");
  const selected = selectedConversation || CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="flex h-full rounded-[14px] bg-page">
      {/* Left Panel — Inbox */}
      <div className="flex w-full shrink-0 flex-col border-r border-line sm:w-[380px]">
        {/* Header */}
        <div className="shrink-0 border-b border-line px-5 py-3">
          <h1 className="text-[13px] font-semibold text-ink">Messages</h1>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="xs" className="shadow-btn">
              <GmailIcon size={13} />
              <span>Gmail</span>
            </Button>
            <Button variant="secondary" size="xs" className="shadow-btn">
              <OutlookIcon size={13} />
              <span>Outlook</span>
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" size="xs" className="!h-7 !w-7 !rounded-[4px] !p-0 shadow-btn"><SearchIcon size={15} /></Button>
            <Button variant="secondary" size="xs" className="!h-7 !w-7 !rounded-[4px] !p-0 shadow-btn"><FilterIcon size={15} /></Button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="min-h-0 flex-1 overflow-y-auto scroll-hover">
          {CONVERSATIONS.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => setSelectedId(conversation.id)}
            />
          ))}
        </div>
      </div>

      {/* Right Panel — Detail */}
      <div className="min-w-0 flex-1 flex">
        {selected ? (
          <ConversationDetail
            conversation={selected}
            onGenerateDraft={onGenerateDraft}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
