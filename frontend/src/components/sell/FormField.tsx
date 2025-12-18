import React from "react";

export function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none",
        "focus:ring-2 focus:ring-sky-300 bg-white",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none",
        "focus:ring-2 focus:ring-sky-300 bg-white",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none",
        "focus:ring-2 focus:ring-sky-300 bg-white",
        props.className || "",
      ].join(" ")}
    />
  );
}
