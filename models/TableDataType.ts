import { Payment } from "@prisma/client";
import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";

export interface ListResponse<T> {
  total: number;
  items: T[];
}

export interface TableDataSource {
  key: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

export interface PaymentTableData extends TableDataSource, Payment {}
