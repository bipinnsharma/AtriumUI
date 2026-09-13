"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * PATIENT RECORDS TABLE — CRM-style grid
 * Relationship-focused patient management with tags,
 * sorting, and CRM lifecycle statuses.
 * ───────────────────────────────────────────────────────── */

export type PatientRow = {
  uhid: string;
  name: string;
  ageGender: string;
  phone: string;
  department: string;
  bedNo: string;
  status: "new-lead" | "active" | "engaged" | "converted" | "at-risk" | "churned";
  action: string;
  lastVisit: string;
  tags: string[];
};

const ROWS: PatientRow[] = [
  { uhid: "UH-2024-001", name: "Rajesh Kumar", ageGender: "54/M", phone: "+91 98765 43210", department: "Cardiology", bedNo: "ICU-12", status: "active", action: "CT Angiography", lastVisit: "2 days ago", tags: ["VIP", "Post-Op"] },
  { uhid: "UH-2024-002", name: "Priya Sharma", ageGender: "38/F", phone: "+91 87654 32109", department: "Neurology", bedNo: "WARD-07", status: "engaged", action: "MRI Brain", lastVisit: "Today", tags: ["New Patient"] },
  { uhid: "UH-2024-003", name: "John Smith", ageGender: "62/M", phone: "+44 7911 123456", department: "Orthopedics", bedNo: "WARD-15", status: "converted", action: "Follow-up X-Ray", lastVisit: "1 week ago", tags: ["Insurance", "Follow-up"] },
  { uhid: "UH-2024-004", name: "Fatima Al-Hassan", ageGender: "45/F", phone: "+971 50 123 4567", department: "Oncology", bedNo: "ICU-03", status: "at-risk", action: "PET-CT Scan", lastVisit: "3 days ago", tags: ["Critical", "International"] },
  { uhid: "UH-2024-005", name: "Carlos Garcia", ageGender: "71/M", phone: "+52 55 1234 5678", department: "Pulmonology", bedNo: "WARD-22", status: "churned", action: "Chest X-Ray", lastVisit: "2 months ago", tags: ["No-show"] },
  { uhid: "UH-2024-006", name: "Yuki Tanaka", ageGender: "29/F", phone: "+81 90 1234 5678", department: "Radiology", bedNo: "WARD-03", status: "new-lead", action: "Ultrasound", lastVisit: "—", tags: ["Referral"] },
  { uhid: "UH-2024-007", name: "Olga Petrov", ageGender: "58/F", phone: "+7 916 123 4567", department: "Neurology", bedNo: "ICU-08", status: "active", action: "MRI Spine", lastVisit: "Today", tags: ["Chronic", "VIP"] },
  { uhid: "UH-2024-008", name: "Ahmed Khan", ageGender: "43/M", phone: "+92 300 1234567", department: "Cardiology", bedNo: "WARD-11", status: "engaged", action: "Echocardiogram", lastVisit: "Yesterday", tags: ["Insurance"] },
  { uhid: "UH-2024-009", name: "Maria Santos", ageGender: "33/F", phone: "+55 11 91234 5678", department: "Orthopedics", bedNo: "WARD-09", status: "converted", action: "X-Ray Left Knee", lastVisit: "5 days ago", tags: ["Post-Op", "Follow-up"] },
  { uhid: "UH-2024-010", name: "Lars Eriksson", ageGender: "67/M", phone: "+46 70 123 4567", department: "Oncology", bedNo: "ICU-05", status: "new-lead", action: "CT Chest", lastVisit: "—", tags: ["International", "Referral"] },
];

const STATUS: Record<PatientRow["status"], { label: string; color: string; icon: string }> = {
  "new-lead": { label: "New Lead", color: "var(--accent)", icon: "✦" },
  active: { label: "Active", color: "var(--green)", icon: "●" },
  engaged: { label: "Engaged", color: "oklch(0.671 0.118 219.351)", icon: "◐" },
  converted: { label: "Converted", color: "var(--green)", icon: "✓" },
  "at-risk": { label: "At Risk", color: "var(--orange)", icon: "▲" },
  churned: { label: "Churned", color: "var(--ink-3)", icon: "○" },
};

const DEPT_COLORS: Record<string, string> = {
  Cardiology: "oklch(0.757 0.153 66.401)",
  Neurology: "oklch(0.671 0.118 219.351)",
  Orthopedics: "oklch(0.652 0.131 162.865)",
  Oncology: "oklch(0.62 0.17 350)",
  Pulmonology: "oklch(0.7 0.12 280)",
  Radiology: "oklch(0.65 0.1 200)",
};

type SortKey = "name" | "department" | "status" | "lastVisit";

export default function PatientRecordsTable({
  rows = ROWS,
}: {
  rows?: PatientRow[];
  variant?: string;
} = {}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sorted = [...rows].sort((a, b) => {
    const val = sort.key === "name"
      ? a.name.localeCompare(b.name)
      : sort.key === "department"
        ? a.department.localeCompare(b.department)
        : sort.key === "lastVisit"
          ? a.lastVisit.localeCompare(b.lastVisit)
          : a.status.localeCompare(b.status);
    return val * sort.dir;
  });

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  const toggleRow = (uhid: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(uhid) ? next.delete(uhid) : next.add(uhid);
      return next;
    });

  const allSelected = sorted.length > 0 && sorted.every((r) => selected.has(r.uhid));
  const partial = !allSelected && sorted.some((r) => selected.has(r.uhid));

  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      if (allSelected) sorted.forEach((r) => next.delete(r.uhid));
      else sorted.forEach((r) => next.add(r.uhid));
      return next;
    });

  const activeCount = rows.filter((r) => r.status === "active" || r.status === "engaged").length;
  const atRiskCount = rows.filter((r) => r.status === "at-risk").length;

  return (
    <div className="records-shell" style={{ maxWidth: 780 }}>
      <div className="records-toolbar">
        <div className="records-toolbar-left">
          <span className="text-[13px] font-medium text-ink">Patient Pipeline</span>
          <span className="rounded-[5px] bg-inset px-1.5 py-0.5 text-[11px] font-medium text-ink-3 tabular-nums">
            {rows.length}
          </span>
        </div>
        <div className="records-toolbar-right">
          <span className="text-[11.5px] text-ink-3">
            {activeCount} active{atRiskCount > 0 && <>, <span className="text-[var(--orange)]">{atRiskCount} at risk</span></>}
          </span>
        </div>
      </div>

      <div className="records-scroll" tabIndex={0} aria-label="Patient CRM pipeline">
        <table className="records-table" style={{ minWidth: 740 }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 145 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 115 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 95 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th className="records-header-cell">
                <label className="records-checkbox" title="Select all">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = partial; }}
                    onChange={toggleAll}
                    aria-label="Select all patients"
                  />
                  <span className={`records-checkbox-box ${allSelected || partial ? "is-active" : ""}`}>
                    {allSelected ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
                    ) : partial ? (
                      <span className="records-checkbox-dash" />
                    ) : null}
                  </span>
                </label>
              </th>
              <th className="records-header-cell">
                <button type="button" className="records-header-button" onClick={() => toggleSort("name")}>
                  <span className="truncate">Patient</span>
                  <span className={`records-sort ${sort.key === "name" ? "is-visible" : ""}`} style={{ transform: sort.key === "name" && sort.dir === -1 ? "rotate(180deg)" : undefined }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  </span>
                </button>
              </th>
              <th className="records-header-cell">
                <span className="text-[12px] font-medium text-ink-3 px-2">Contact</span>
              </th>
              <th className="records-header-cell">
                <button type="button" className="records-header-button" onClick={() => toggleSort("department")}>
                  <span className="truncate">Department</span>
                  <span className={`records-sort ${sort.key === "department" ? "is-visible" : ""}`} style={{ transform: sort.key === "department" && sort.dir === -1 ? "rotate(180deg)" : undefined }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  </span>
                </button>
              </th>
              <th className="records-header-cell">
                <span className="text-[12px] font-medium text-ink-3 px-2">Tags</span>
              </th>
              <th className="records-header-cell">
                <button type="button" className="records-header-button" onClick={() => toggleSort("status")}>
                  <span className="truncate">Status</span>
                  <span className={`records-sort ${sort.key === "status" ? "is-visible" : ""}`} style={{ transform: sort.key === "status" && sort.dir === -1 ? "rotate(180deg)" : undefined }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  </span>
                </button>
              </th>
              <th className="records-header-cell">
                <button type="button" className="records-header-button" onClick={() => toggleSort("lastVisit")}>
                  <span className="truncate">Last Visit</span>
                  <span className={`records-sort ${sort.key === "lastVisit" ? "is-visible" : ""}`} style={{ transform: sort.key === "lastVisit" && sort.dir === -1 ? "rotate(180deg)" : undefined }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  </span>
                </button>
              </th>
              <th className="records-header-cell">
                <span className="text-[12px] font-medium text-ink-3 px-2">Next Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const st = STATUS[row.status];
              const isSelected = selected.has(row.uhid);
              const deptColor = DEPT_COLORS[row.department] || "var(--ink-3)";
              return (
                <tr key={row.uhid} className={`records-row ${isSelected ? "is-selected" : ""}`}>
                  <td className="records-cell records-sticky-cell">
                    <label className="records-checkbox" title={`Select ${row.name}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row.uhid)}
                        aria-label={`Select ${row.name}`}
                      />
                      <span className={`records-checkbox-box ${isSelected ? "is-active" : ""}`}>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>}
                      </span>
                    </label>
                  </td>
                  <td className="records-cell">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="records-company-mark" style={{ background: deptColor }}>{row.name.charAt(0)}</span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-ink truncate">{row.name}</div>
                        <div className="text-[11px] text-ink-3 truncate">{row.uhid}</div>
                      </div>
                    </div>
                  </td>
                  <td className="records-cell">
                    <div className="min-w-0">
                      <div className="text-[12px] text-ink-2 truncate">{row.ageGender}</div>
                      <div className="text-[11px] text-ink-3 truncate tabular-nums">{row.phone}</div>
                    </div>
                  </td>
                  <td className="records-cell">
                    <span className="records-tag" style={{ "--tag-base": deptColor } as React.CSSProperties}>
                      {row.department}
                    </span>
                  </td>
                  <td className="records-cell">
                    <div className="flex flex-wrap gap-1">
                      {row.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-ink-3 bg-[var(--inset)] border border-[var(--line)] rounded-[4px] px-1.5 py-0.5 leading-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="records-cell">
                    <span
                      className="records-tag"
                      style={{ "--tag-base": st.color } as React.CSSProperties}
                    >
                      <span className="mr-1 text-[10px]">{st.icon}</span>
                      {st.label}
                    </span>
                  </td>
                  <td className="records-cell">
                    <span className="text-[12px] text-ink-2 tabular-nums">{row.lastVisit}</span>
                  </td>
                  <td className="records-cell">
                    <span className="text-[12px] text-ink">{row.action}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
