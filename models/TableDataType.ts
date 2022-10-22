import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";

export interface ListResponse<T> {
  total: number;
  items: T[];
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}
