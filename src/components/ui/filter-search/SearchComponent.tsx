import React, { useState, useEffect } from "react";
import { Input } from "../input";
import { SearchIcon } from "lucide-react";

type DataItem = Record<string, any> | string | number;

interface SearchComponentProps {
  data?: DataItem[];
  placeholder?: string;
  displayKey?: string | string[];
  debounceDelay?: number;
  onResults?: (results: DataItem[]) => void;
  className?: string;
}

// ✅ Utility to handle nested access like "company.name"
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  data = [],
  placeholder = "Search...",
  displayKey = "name",
  debounceDelay = 300,
  className = "",
  onResults,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DataItem[]>(data);

  useEffect(() => {
    setResults(data);
  }, [data]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      let filtered: DataItem[];

      if (!query) {
        filtered = data;
      } else {
        filtered = data.filter((item) => {
          if (typeof item === "object" && item !== null) {
            if (Array.isArray(displayKey)) {
              // Handle array of keys, including nested ones like ["company.name", "user.email"]
              const combined = displayKey
                .map((key) => getNestedValue(item, key))
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
              return combined.includes(query.toLowerCase());
            } else {
              // Handle single key, including nested ones like "company.name"
              const value = getNestedValue(item, displayKey);
              return value?.toString().toLowerCase().includes(query.toLowerCase());
            }
          }
          return item?.toString().toLowerCase().includes(query.toLowerCase());
        });
      }

      setResults(filtered);
      if (onResults) onResults(filtered);
    }, debounceDelay);

    return () => clearTimeout(debounce);
  }, [query, data, displayKey, debounceDelay, onResults]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-3 py-2 bg-[#FFE58A]"
        icon={<SearchIcon />}
      />
      </div>
    </div>
  );
};

export default SearchComponent;