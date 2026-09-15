"use client";

import { useState } from "react";
import posthog from "posthog-js";
import ApprovalCard from "@/components/primitives/ApprovalCard";
import ChatComposer from "@/components/primitives/ChatComposer";
import CodeBlock from "@/components/primitives/CodeBlock";
import ContextCards from "@/components/primitives/ContextCards";
import {
  DrawerRoot,
  DrawerContent,
  DrawerSideContent,
  DrawerHeader,
  DrawerBody,
  DrawerClose,
} from "@/components/primitives/Drawer";
import DiffTable from "@/components/primitives/DiffTable";
import FilterTable from "@/components/primitives/FilterTable";
import FineTuneCard from "@/components/primitives/FineTuneCard";
import InsightCards from "@/components/primitives/InsightCards";
import LoadingState from "@/components/primitives/LoadingState";
import RecommendationCard from "@/components/primitives/RecommendationCard";
import RecordsTable from "@/components/primitives/RecordsTable";
import SearchList from "@/components/primitives/SearchList";
import SidebarNav from "@/components/primitives/SidebarNav";
import StreamingText from "@/components/primitives/StreamingText";
import TaskRows from "@/components/primitives/TaskRows";
import ThinkingState from "@/components/primitives/ThinkingState";
import ToolChips from "@/components/primitives/ToolChips";

function Spark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-ink text-surface shadow-hairline ${className}`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
      </svg>
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AssistantMessage({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`flex gap-3 ${className}`} style={{ animation: "fade-up 450ms cubic-bezier(0.23,1,0.32,1) both" }}>
      <Spark className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.09em] text-ink-3">{eyebrow}</span>
        {children}
      </div>
    </article>
  );
}

function SectionHeading({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      <span className="font-mono text-[10.5px] tabular-nums text-ink-3">{number}</span>
      <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      <span className="truncate text-[12px] text-ink-3">{detail}</span>
    </div>
  );
}

function ContextRail() {
  return (
    <aside className="hidden w-[304px] shrink-0 border-l border-line bg-canvas/45 px-5 py-6 2xl:block">
      <div className="sticky top-6 flex flex-col gap-7">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink">Workspace search</span>
            <kbd className="rounded-[5px] bg-field px-1.5 py-0.5 font-mono text-[10px] text-ink-3 shadow-hairline">⌘ K</kbd>
          </div>
          <SearchList />
        </div>

        <div>
          <SectionHeading number="01" title="Context" detail="3 sources" />
          <ContextCards />
        </div>

        <div>
          <SectionHeading number="02" title="Tune response" detail="live inspector" />
          <FineTuneCard />
        </div>
      </div>
    </aside>
  );
}

export default function ChatExperience() {
  const [runOpen, setRunOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-page p-3 text-ink sm:p-5 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-window bg-page shadow-overlay sm:min-h-[calc(100vh-2.5rem)] lg:min-h-[calc(100vh-3.5rem)]">
        {/* Desktop sidebar */}
        <div className="hidden shrink-0 border-r border-line bg-canvas/35 lg:block">
          <SidebarNav fill />
        </div>

        {/* Mobile sidebar — left-side half panel with blur */}
        <DrawerRoot open={sidebarOpen} onOpenChange={setSidebarOpen} direction="left">
          <DrawerSideContent side="left">
            <DrawerHeader>
              <button type="button" className="flex h-8 w-full items-center rounded-[8px] px-2 text-left transition-[background-color,transform] duration-100 hover:bg-hover-2 active:scale-[0.99]">
                <span className="flex size-6 shrink-0 items-center justify-center text-ink">
                  <img src="/Scape.svg" alt="" className="size-6" />
                </span>
                <span className="sidebar-copy ml-1.5 min-w-0 flex-1 truncate font-sans text-[14px] font-normal leading-5 text-ink-2">Atrium Labs</span>
              </button>
              <DrawerClose asChild>
                <button type="button" aria-label="Close navigation" className="flex size-10 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </DrawerClose>
            </DrawerHeader>
            <DrawerBody className="p-0">
              <SidebarNav fill mobile onPick={() => setSidebarOpen(false)} onNewChat={() => setSidebarOpen(false)} />
            </DrawerBody>
          </DrawerSideContent>
        </DrawerRoot>

        <section className="flex min-w-0 flex-1 flex-col bg-page">
          <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-4 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open workspace navigation"
                onClick={() => setSidebarOpen(true)}
                className="flex size-8 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink lg:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[14px] font-semibold text-ink">Patient consult</span>
                  <span className="rounded-full bg-green-tint px-2 py-0.5 text-[10.5px] font-medium text-green">Live</span>
                </div>
                <span className="block truncate text-[11.5px] text-ink-3">Ward 3B · updated moments ago</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" className="hidden h-8 items-center gap-1.5 rounded-control bg-field px-2.5 text-[12px] font-medium text-ink-2 shadow-btn transition-[background-color,color,transform] duration-150 hover:bg-hover hover:text-ink active:scale-[0.97] sm:flex">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3v18M3 12h18" /></svg>
                New chat
              </button>
              <button type="button" aria-label="Share conversation" className="flex size-8 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.9 7.5-4.6M8.2 13.1l7.5 4.6" /></svg>
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto max-w-[820px] px-4 py-8 pb-10 sm:px-8 sm:py-10 lg:px-12">
                <div className="mb-8 flex justify-end pl-10 sm:pl-24">
                  <div className="rounded-xl bg-field px-3.5 py-2 text-[13px] leading-relaxed text-ink shadow-hairline">
                    Review the medication plan for Bed 5A — are there any interactions I should flag before rounds?
                  </div>
                </div>

                <AssistantMessage eyebrow="Consult · analysis complete">
                  <p className="max-w-[620px] text-[14px] leading-[1.65] text-ink">
                    I cross-referenced the current med list against the latest lab panel. Bed 5A is on Metformin + Lisinopril — no direct interaction, but the elevated creatinine (1.4 mg/dL) means the Lisinopril dose should be reviewed. I'd also flag the pending culture results before adding any antibiotics.
                  </p>

                  <div className="mt-5 rounded-card bg-canvas/70 p-3 shadow-hairline sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="block text-[12px] font-semibold text-ink">Clinical run</span>
                        <span className="block text-[11px] text-ink-3">Drug interaction check + lab correlation</span>
                      </div>
                      <button type="button" aria-expanded={runOpen} onClick={() => setRunOpen((current) => !current)} className="flex h-7 items-center gap-1.5 rounded-control bg-surface px-2 text-[11.5px] font-medium text-ink-2 shadow-btn transition-[background-color,color,transform] duration-150 hover:bg-hover hover:text-ink active:scale-[0.97]">
                        {runOpen ? "Hide details" : "Show details"}
                        <Chevron open={runOpen} />
                      </button>
                    </div>
                    <div className="grid transition-[grid-template-rows,opacity] duration-400" style={{ gridTemplateRows: runOpen ? "1fr" : "0fr", opacity: runOpen ? 1 : 0 }}>
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-4 flex flex-col gap-5 border-t border-line pt-4">
                          <div>
                            <SectionHeading number="01" title="Thinking" detail="agent trace" />
                            <ThinkingState variant="Search" />
                          </div>
                          <div>
                            <SectionHeading number="02" title="Tools" detail="4 calls · 2 messages" />
                            <ToolChips />
                          </div>
                          <LoadingState label="Cross-referencing medications" variant="Dots" />
                        </div>
                      </div>
                    </div>
                  </div>
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · key signal" className="mt-12">
                  <div className="max-w-[630px]">
                    <StreamingText />
                  </div>
                  <div className="mt-5">
                    <SectionHeading number="03" title="Lab trends" detail="last 7 days" />
                    <InsightCards />
                  </div>
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · recommendation" className="mt-12">
                  <p className="mb-4 max-w-[600px] text-[13px] leading-relaxed text-ink-2">I'd recommend holding the Lisinopril until the nephrology consult comes back. The Metformin is fine to continue — just recheck eGFR in 48 hours.</p>
                  <RecommendationCard />
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · needs your call" className="mt-12">
                  <p className="mb-4 max-w-[600px] text-[13px] leading-relaxed text-ink-2">Before I update the order set, confirm whether to adjust the Lisinopril dose or switch to an alternative antihypertensive.</p>
                  <ApprovalCard />
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · preparing the change" className="mt-12">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="max-w-[480px] text-[13px] leading-relaxed text-ink-2">I’ll stage the medication adjustment, flag the pending cultures, and leave the proposed edits for your review.</p>
                    <span className="hidden rounded-full bg-accent-tint px-2 py-0.5 text-[10.5px] font-medium text-accent-ink sm:block">Draft</span>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div>
                      <SectionHeading number="04" title="Tasks" detail="agent checklist" />
                      <TaskRows />
                    </div>
                    <div>
                      <SectionHeading number="05" title="Proposed edits" detail="review before apply" />
                      <DiffTable />
                    </div>
                  </div>
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · patient records" className="mt-12">
                  <p className="mb-5 max-w-[600px] text-[13px] leading-relaxed text-ink-2">Here’s the current ward view. The filters are connected so you can narrow by department or status without leaving the thread.</p>
                  <div className="flex flex-col gap-7">
                    <div>
                      <SectionHeading number="06" title="Ward filter" detail="by department" />
                      <div className="overflow-x-auto pb-1"><FilterTable /></div>
                    </div>
                    <div>
                      <SectionHeading number="07" title="Patient records" detail="26 makers" />
                      <div className="overflow-x-auto pb-1"><RecordsTable /></div>
                    </div>
                  </div>
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · dosage calculation" className="mt-12">
                  <p className="mb-4 max-w-[600px] text-[13px] leading-relaxed text-ink-2">This is the adjusted dosage function I’ll use to stage the revised orders.</p>
                  <CodeBlock />
                </AssistantMessage>

                <AssistantMessage eyebrow="Consult · ready when you are" className="mt-12">
                  <p className="mb-4 max-w-[600px] text-[13px] leading-relaxed text-ink-2">Everything is staged as a reviewable draft. Ask for a change, or send a new instruction below to keep going.</p>
                  <ChatComposer onSend={() => posthog.capture("chat_composer_prompt_sent")} />
                </AssistantMessage>
              </div>
            </div>
            <ContextRail />
          </div>
        </section>
      </div>
    </main>
  );
}
