import { Payment } from "@prisma/client";
import { Button, DatePicker } from "antd";
import Table, { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import type { Moment } from "moment";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import PaymentModal from "../../components/payments/PaymentModal";
import Time from "../../components/Time";
import { fetchPayments } from "../../data/frontend";
import { TableParams } from "../../models/TableDataType";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
type RangeValue = [Moment | null, Moment | null] | null;

export default function index() {
  const { mutate } = useSWRConfig();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState<RangeValue>([
    moment("2022/10/01", dateFormat),
    moment("2022/10/31", dateFormat),
  ]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Total",
        dataIndex: "total",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Date",
        dataIndex: "date",
        render: (date: Date) => {
          return <Time date={date} />;
        },
      },
    ],
    []
  );

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<Payment> | SorterResult<Payment>[]
    ) => {
      setTableParams((prev) => ({
        pagination: {
          ...prev.pagination,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      }));
    },
    []
  );

  const { data, isLoading } = fetchPayments(
    dateRangeValue?.[0]?.format("YYYY-MM-DD"),
    dateRangeValue?.[1]?.format("YYYY-MM-DD"),
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize
  );

  return (
    <>
      <div className="flex flex-row justify-between my-2">
        <RangePicker
          defaultValue={dateRangeValue}
          onCalendarChange={(val) => setDateRangeValue(val)}
        />
        <Button type="primary" onClick={() => setOpenPaymentModal(true)}>
          Create
        </Button>
      </div>

      <div className="my-2">
        <Table
          loading={isLoading}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </div>

      <PaymentModal
        isModalOpen={openPaymentModal}
        onCancel={() => {
          setOpenPaymentModal(false);
        }}
        onSubmitForm={async (data) => {
          await fetch("/api/Payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setOpenPaymentModal(false);
          mutate("/api/Payments");
        }}
      />
    </>
  );
}
