"use-client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import queryString from "query-string";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { SearchIcon } from "lucide-react";

const SearchBox = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce({ value: search, delay: 500 });
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const categoryId = params.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: {
          title: debouncedValue,
          categoryId: categoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, categoryId, pathName, router]);

  return (
    <div className="relative">
      <SearchIcon className="h-4 w-4 text-slate-600 absolute top-3 left-3" />
      <Input
        className="w-full md:w-[250px] flex items-center bg-slate-100 rounded-full pl-9 focus-visible:ring-slate-300"
        placeholder="Search for a course"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
