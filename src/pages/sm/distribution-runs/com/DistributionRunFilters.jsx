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
  distributionRunFdoOptions,
  distributionRunStatusOptions,
  distributionRunWarehouseOptions,
} from "@/data/mock/distribution-runs";

function FilterSelect({ ariaLabel, options, value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel} className="w-full">
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

function DistributionRunFilters({ filters, onFilterChange }) {
  return (
    <div className="grid gap-2 border-b px-4 py-4 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1fr)_11rem_14rem_11rem]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder="Search Run ID..."
          aria-label="Search distribution runs"
          className="pl-8"
        />
      </div>
      <FilterSelect
        ariaLabel="Filter by status"
        options={distributionRunStatusOptions}
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      />
      <FilterSelect
        ariaLabel="Filter by warehouse"
        options={distributionRunWarehouseOptions}
        value={filters.warehouse}
        onValueChange={(value) => onFilterChange("warehouse", value)}
      />
      <FilterSelect
        ariaLabel="Filter by FDO"
        options={distributionRunFdoOptions}
        value={filters.fdo}
        onValueChange={(value) => onFilterChange("fdo", value)}
      />
    </div>
  );
}

export default DistributionRunFilters;
