import React from "react";

export default function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
