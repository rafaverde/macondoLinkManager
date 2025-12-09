"use client";

import { useState } from "react";
import { Badge } from "./badge";
import { RiCloseLine } from "@remixicon/react";
import { Input } from "./input";

interface InputTagsProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

export function InputTags({
  value = [],
  onChange,
  placeholder,
}: InputTagsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();

      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove a última tag se apertar backspace no input vazio
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-background dark:bg-input/30 focus-within:ring-ring/50 focus-within:outline-destructive flex flex-wrap gap-1 rounded-md border p-2 transition-all duration-300 ease-in-out focus-within:ring-4 focus-within:ring-offset-0 focus-within:outline-1">
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-muted-foreground/10 gap-1 pr-1 text-sm font-normal"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:bg-muted-foreground/20 rounded-full p-0.5"
          >
            <RiCloseLine className="size-4" />
          </button>
        </Badge>
      ))}

      <Input
        className="h-auto min-w-[120px] flex-1 border-none bg-transparent! p-0 shadow-none focus-visible:ring-0"
        placeholder={value.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
