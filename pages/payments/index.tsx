import { Payment } from "@prisma/client";
import { Button, DatePicker } from "antd";
import Table, { TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import type { Moment } from "moment";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import PaymentModal from "../../components/payments/PaymentModal";
import Time from "../../components/Time";
import { createPayment, fetchPayments } from "../../data/frontend";
import { PaymentForm } from "../../data/models";
import { TableParams } from "../../models/TableDataType";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
type RangeValue = [Moment | null, Moment | null] | null;

export default function PaymentPage() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState<RangeValue>([
    moment("2022-10-01", dateFormat),
    moment("2022-10-31", dateFormat),
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

  const { data, isLoading, mutate } = fetchPayments(
    dateRangeValue?.[0]?.format(dateFormat),
    dateRangeValue?.[1]?.format(dateFormat),
    tableParams.pagination!.current! - 1,
    tableParams.pagination?.pageSize
  );

  useEffect(() => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total: data?.total,
      },
    }));
  }, [data]);

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
          dataSource={data?.items}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </div>

      <PaymentModal
        isModalOpen={openPaymentModal}
        onCancel={() => {
          setOpenPaymentModal(false);
        }}
        onSubmitForm={async (data: PaymentForm) => {
          await createPayment(data);
          setOpenPaymentModal(false);
          mutate();
        }}
      />
    </>
  );
}
