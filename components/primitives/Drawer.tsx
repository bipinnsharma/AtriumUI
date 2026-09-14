"use client";

import * as React from "react";
import { Drawer } from "vaul";

/* ─────────────────────────────────────────────────────────
 * DRAWER — mobile-first sheet built on vaul.
 * Snap at 50% or 100%. Dismiss on velocity > 0.11.
 * Safe-area inset respected. Origin-aware entry from bottom.
 * ───────────────────────────────────────────────────────── */

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
  return (
    <Drawer.Trigger {...props}>
      {children}
    </Drawer.Trigger>
  );
}

function DrawerPortal({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Portal>) {
  return (
    <Drawer.Portal {...props}>{children}</Drawer.Portal>
  );
}

function DrawerClose({
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Close>) {
  return (
    <Drawer.Close {...props}>{children}</Drawer.Close>
  );
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Overlay>) {
  return (
    <Drawer.Overlay
      className={`fixed inset-0 z-50 bg-black/40 ${className ?? ""}`}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Drawer.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Drawer.Content
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[14px] bg-surface shadow-overlay outline-none ${
          className ?? ""
        }`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        {...props}
      >
        {/* drag handle */}
        <Drawer.Handle className="mx-auto mt-2.5 mb-1 flex h-1 w-10 shrink-0 items-center rounded-full bg-ink/15" />
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
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
};
