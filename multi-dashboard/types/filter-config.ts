export type Operator =
  | "equals"
  | "not_equals"
  | "in"
  | "nin"
  | "contains"
  | "icontains"
  | "not_contains"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "empty"
  | "not_empty"
  | "between"
  | "starts_with"
  | "ends_with"
  | "array_length"
  | "object_keys_length"
  | "regex";

export type DataType = "string" | "number" | "boolean" | "objectId" | "date";

export type AutocompleteString<T> = Extract<keyof T, string>;

export interface FieldDef {
  operators: Operator[];
  dataType: DataType;
  enum?: Array<string | number>;
  formatter?: (value: string) => string;
  regex?: {
    pattern: RegExp;
    message?: string;
  };
}
export interface LookupDef {
  from: string; // Target collection name (e.g., "customers")
  localField: string; // Field in the current document (e.g., "customerId")
  foreignField: string; // Field in the target collection (usually "_id")
  alias?: string; // What to name the output field (defaults to the key)
  isArray?: boolean; // If false, the engine will automatically add an $unwind stage
  pipeline?: any[];
}

export interface SchemaConfig<T> {
  search: AutocompleteString<T>[];
  allowedSorts: AutocompleteString<T>[];
  allowedPopulate: Record<string, LookupDef[]>;
  allowedFilters: Partial<
    Record<AutocompleteString<T> | (string & {}), FieldDef>
  >;
  defaultSort?: { field: AutocompleteString<T>; order: "asc" | "desc" };
  requiredFilters: Partial<Record<AutocompleteString<T>, FieldDef>>;
}

export type Filter = {
  field: string;
  operator?: Operator;
  value: any;
};
