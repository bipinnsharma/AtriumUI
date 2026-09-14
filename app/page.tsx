import type { Metadata } from "next";
import AtriumLabs from "@/components/site/AtriumLabs";

export const metadata: Metadata = {
  title: "Clinical AI Harness — Atrium Labs",
  description:
    "An interactive clinical AI assistant built from Atrium UI primitives. Ask a question and watch the agent think, stream, and build the answer out of live components.",
};

export default function Home() {
  return <AtriumLabs />;
}
