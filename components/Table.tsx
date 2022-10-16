import { TablePaginationConfig } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import { useEffect, useState } from "react";
import {
    TableDataSource,
    TableParams
} from "../models/TableDataType";

export interface TableComponentProps<T extends TableDataSource> {
  initTableParams?: TableParams;
  columns: ColumnsType<T>;
  dataSource: T[];
}

export default function TableComponent<T extends TableDataSource>({
  initTableParams,
  columns,
  dataSource,
}: TableComponentProps<T>) {
  const [tableParams, setTableParams] = useState<TableParams>(
    initTableParams ?? {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    }
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  useEffect(() => {}, [tableParams.pagination?.current]);

  return (
    <Table
      columns={columns}
      rowKey={(record: T) => record.key}
      dataSource={dataSource}
      pagination={tableParams.pagination}
      onChange={handleTableChange}
    />
  );
}
