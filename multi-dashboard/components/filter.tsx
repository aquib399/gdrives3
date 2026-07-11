"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, FilterIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  FieldDef,
  Operator,
  SchemaConfig
} from "@/types/filter-config";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";
import {
  Modal,
  useModal,
  ModalContent,
  ModalTrigger
} from "@/components/modal";

interface FilterBuilderProps {
  schema: SchemaConfig<any>;
  activeFilters: Filter[];
  onApply: (filters: Filter[]) => void;
}

const OPERATOR_LABELS: Record<Operator, string> = {
  equals: "Equals",
  not_equals: "Does not equal",
  in: "Is one of",
  nin: "Is not one of",
  contains: "Contains",
  icontains: "Contains (ignore case)",
  not_contains: "Does not contain",
  gt: "Greater than",
  lt: "Less than",
  gte: "Greater than or equal",
  lte: "Less than or equal",
  empty: "Is empty",
  not_empty: "Is not empty",
  between: "Is between",
  starts_with: "Starts with",
  ends_with: "Ends with",
  array_length: "Item count equals",
  object_keys_length: "Property count equals",
  regex: "Matches pattern"
};

const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function FilterModalInner({
  schema,
  activeFilters: initialFilters,
  onApply
}: FilterBuilderProps) {
  const { setOpen } = useModal();
  const [activeFilters, setActiveFilters] = useState<Filter[]>(initialFilters);

  const config = {
    ...schema.allowedFilters,
    ...schema.requiredFilters
  } as Record<string, FieldDef>;

  const fields = Object.keys(config);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveFilters(initialFilters);
  }, [initialFilters]);

  const addFilter = useCallback(() => {
    setActiveFilters([
      ...activeFilters,
      { field: "", operator: undefined as any, value: "" }
    ]);
  }, [activeFilters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeFilters.length === 0) addFilter();
  }, [activeFilters.length, addFilter]);

  const updateFilter = (index: number, key: keyof Filter, value: any) => {
    const newFilters = [...activeFilters];
    newFilters[index][key] = value as never;
    setActiveFilters(newFilters);
  };

  const handleFieldChange = (index: number, newField: string) => {
    const newFilters = [...activeFilters];
    const fieldDef = config[newField];
    newFilters[index] = {
      field: newField,
      operator: fieldDef.operators[0], // Reset operator to valid default
      value: "" // Clear value
    };
    setActiveFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    const validFilters = activeFilters.filter(
      (f) =>
        f.field !== "" &&
        (f.operator === "empty" ||
          f.operator === "not_empty" ||
          (f.value !== "" && f.value !== null && f.value !== undefined))
    );
    onApply(validFilters);
    setOpen(false);
  };
  const handleClearAll = () => {
    setActiveFilters([]);
    onApply([]);
    setOpen(false);
  };

  const renderValueInput = (filter: Filter, index: number) => {
    if (filter.operator === "empty" || filter.operator === "not_empty") {
      return null;
    }

    const fieldDef = config[filter.field];
    if (!fieldDef) return null;

    if (fieldDef.enum) {
      return (
        <Select
          value={String(filter.value || "")}
          onValueChange={(val) => updateFilter(index, "value", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {fieldDef.enum.map((e) => (
              <SelectItem key={String(e)} value={String(e)}>
                {formatLabel(String(e))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (fieldDef.dataType === "boolean") {
      return (
        <Select
          value={String(filter.value || "")}
          onValueChange={(val) => updateFilter(index, "value", val === "true")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Yes / No" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    const inputType =
      fieldDef.dataType === "number"
        ? "number"
        : fieldDef.dataType === "date"
          ? "date"
          : "text";

    const isArrayOperator =
      filter.operator === "in" ||
      filter.operator === "nin" ||
      filter.operator === "between";

    const placeholderText = isArrayOperator
      ? "e.g. item1, item2"
      : `Enter value...`;

    return (
      <Input
        type={inputType}
        value={filter.value || ""}
        onChange={(e) => updateFilter(index, "value", e.target.value)}
        placeholder={placeholderText}
        className="w-full"
        pattern={fieldDef.regex?.pattern.source}
        title={fieldDef.regex?.message}
      />
    );
  };

  return (
    <div className="flex max-h-[85vh] w-162.5 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="text-muted-foreground text-sm">
            Refine your view by adding specific conditions.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {activeFilters.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No filters applied yet.
            </div>
          ) : (
            activeFilters.map((filter, index) => (
              <div
                key={index}
                className="bg-card flex items-center gap-3 rounded-lg border p-2 shadow-sm"
              >
                {/* Field Selection */}
                <div className="w-[30%] shrink-0">
                  <Select
                    value={filter.field}
                    onValueChange={(val) => handleFieldChange(index, val)}
                  >
                    <SelectTrigger className="w-full border-none bg-transparent shadow-none focus:ring-0">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f} value={f}>
                          {formatLabel(f)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator Selection */}
                <div className="w-[30%] shrink-0 border-l pl-3">
                  <Select
                    value={filter.operator}
                    disabled={!filter.field}
                    onValueChange={(val) =>
                      updateFilter(index, "operator", val)
                    }
                  >
                    <SelectTrigger className="w-full border-none bg-transparent shadow-none focus:ring-0">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {config[filter.field]?.operators.map((op) => (
                        <SelectItem key={op} value={op}>
                          {OPERATOR_LABELS[op] || op.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Input */}
                <div className="flex-1 border-l pr-2 pl-3">
                  {renderValueInput(filter, index)}
                </div>

                {/* Delete Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}

          <Button
            variant="ghost"
            onClick={addFilter}
            className="text-primary hover:text-primary/80 mt-2 font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Filter
          </Button>
        </div>
      </div>

      <div className="bg-muted/10 flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
        <Button
          variant="ghost"
          onClick={handleClearAll}
          disabled={activeFilters.length === 0}
        >
          <TrashIcon className="size-3.5" />
          Clear All
        </Button>
        <Button onClick={handleApply} disabled={activeFilters.length === 0}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export function FilterBuilder(props: FilterBuilderProps) {
  const { activeFilters } = props;

  return (
    <Modal>
      <ModalTrigger>
        <Button variant="outline" className="relative shrink-0" size={"lg"}>
          {activeFilters.length > 0 ? (
            <span
              title={`${activeFilters.length} active filters`}
              className="bg-primary text-background absolute -top-2 -right-1 flex size-4 items-center justify-center rounded-full text-xs"
            >
              {activeFilters.length}
            </span>
          ) : (
            ""
          )}
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </ModalTrigger>
      <ModalContent className="p-0" anchor>
        <FilterModalInner {...props} />
      </ModalContent>
    </Modal>
  );
}
