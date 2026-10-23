import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fdoRequestStatusOptions,
  fdoRequestWarehouseOptions,
} from "@/data/mock/fdo-stock-requests";

function FilterSelect({ ariaLabel, options, value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel} className="w-full bg-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StockRequestFilters({ filters, onFilterChange }) {
  return (
    <div className="grid gap-3 border-b bg-white px-4 py-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_14rem_11rem]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder="Search by Request ID..."
          aria-label="Search by Request ID"
          className="bg-white pl-8"
        />
      </div>
      <FilterSelect
        ariaLabel="Filter by warehouse"
        options={fdoRequestWarehouseOptions}
        value={filters.warehouse}
        onValueChange={(value) => onFilterChange("warehouse", value)}
      />
      <FilterSelect
        ariaLabel="Filter by request status"
        options={fdoRequestStatusOptions}
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      />
    </div>
  );
}

export default StockRequestFilters;
