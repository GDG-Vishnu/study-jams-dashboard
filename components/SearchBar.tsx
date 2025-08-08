"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search for labs...",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-5 w-5" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-5 text-lg text-black border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors duration-200"
      />
    </div>
  );
}
