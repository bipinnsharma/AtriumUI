"use client";

import * as React from "react";
import { Drawer } from "vaul";

/* ─────────────────────────────────────────────────────────
 * DRAWER — mobile-first sheet built on vaul.
 *
 * Emil principles applied:
 * - backdrop-blur-sm on overlay (masks imperfect transitions)
 * - origin-aware entry (bottom for sheet, left/right for side)
 * - transform + opacity only (GPU composited)
 * - duration <300ms via vaul's built-in spring
 * - velocity >0.11 dismiss threshold (vaul default)
 * ───────────────────────────────────────────────────────── */

type DrawerDirection = "bottom" | "left" | "right" | "top";

function DrawerRoot({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Root>) {
  return <Drawer.Root {...props}>{children}</Drawer.Root>;
}

function DrawerTrigger({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Trigger>) {
  return <Drawer.Trigger {...props}>{children}</Drawer.Trigger>;
}

function DrawerPortal({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Portal>) {
  return <Drawer.Portal {...props}>{children}</Drawer.Portal>;
}

function DrawerClose({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Close>) {
  return <Drawer.Close {...props}>{children}</Drawer.Close>;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Overlay>) {
  return (
    <Drawer.Overlay
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm ${className ?? ""}`}
      {...props}
    />
  );
}

/* Side variant: inset-y-0 left-0, rounded-r, no drag handle, width-based */
/* Bottom variant: inset-x-0 bottom-0, rounded-t, drag handle, height-based */

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Content>) {
  /* Derive direction from parent Drawer.Root via data attribute or default to bottom */
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Drawer.Content
        className={`fixed z-50 flex flex-col bg-surface shadow-overlay outline-none ${className ?? ""}`}
        {...props}
      >
        {children}
      </Drawer.Content>
    </DrawerPortal>
  );
}

/* ── Side panel variant (left/right) ── */

function DrawerSideContent({
  side = "left",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Content> & {
  side?: "left" | "right";
}) {
  const isLeft = side === "left";
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Drawer.Content
        className={`fixed inset-y-0 z-50 flex w-[min(300px,85vw)] flex-col bg-surface shadow-overlay outline-none ${
          isLeft ? "left-0 rounded-r-[14px]" : "right-0 rounded-l-[14px]"
        } ${className ?? ""}`}
        style={{
          paddingBottom: 0,
        }}
        {...props}
      >
        {children}
      </Drawer.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex shrink-0 items-center justify-between border-b border-line px-4 py-3 ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={`text-[15px] font-semibold text-ink ${className ?? ""}`}
      {...props}
    />
  );
}

function DrawerBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

export {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerSideContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
};
