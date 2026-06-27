"use client";

import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 w-full px-6 py-3 text-left transition-all duration-200 ${
        active
          ? "text-amber-500 bg-amber-500/10"
          : "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/5"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 shadow-[0_0_8px_#d97706]" />
      )}
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
