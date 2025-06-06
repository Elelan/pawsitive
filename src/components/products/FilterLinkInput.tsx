
"use client";

import { cn } from "@/lib/utils";

interface FilterLinkInputProps {
  name: string;
  value: string;
  currentCategory: string | undefined;
  label: string;
  isAllCategories?: boolean;
}

export default function FilterLinkInput({ name, value, currentCategory, label, isAllCategories = false }: FilterLinkInputProps) {
  const isActive = isAllCategories ? (!currentCategory || currentCategory === "All") : currentCategory === value;
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Directly submit the form when a radio button is changed.
    event.target.form?.requestSubmit();
  };

  return (
    <label className={cn(
      "block text-sm cursor-pointer hover:text-primary transition-colors",
      isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
    )}>
      <input 
        type="radio" 
        name={name} 
        value={value} 
        defaultChecked={isActive} 
        className="sr-only" 
        onChange={handleChange} 
      />
      {label}
    </label>
  );
}
