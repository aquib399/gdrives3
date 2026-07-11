import { PipelineStage, Types } from "mongoose";

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
  from: string;
  localField: string;
  foreignField: string;
  alias?: string;
  isArray?: boolean;
  pipeline?: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[];
}

export type ObjectIdKeys<T> = {
  [K in keyof T]: Extract<T[K], Types.ObjectId | Types.ObjectId[]> extends never
    ? never
    : K;
}[keyof T] &
  string;

export interface SchemaConfig<T> {
  search: AutocompleteString<T>[];
  allowedSorts: AutocompleteString<T>[];
  allowedPopulate: Partial<Record<ObjectIdKeys<T>, LookupDef[]>>;

  allowedFilters: Partial<
    Record<AutocompleteString<T> | (string & {}), FieldDef>
  >;

  defaultSort?: {
    field: AutocompleteString<T>;
    order: "asc" | "desc";
  };

  requiredFilters: Partial<Record<AutocompleteString<T>, FieldDef>>;
}

export type Filter = {
  field: string;
  operator: Operator;
  value: any;
};
