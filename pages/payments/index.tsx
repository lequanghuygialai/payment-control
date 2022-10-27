import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Payment } from "@prisma/client";
import { Button, DatePicker, Space, Tag, Tooltip } from "antd";
import Table, { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import { Session } from "inspector";
import type { Moment } from "moment";
import moment from "moment";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authOptions } from "../../auth/auth";
import LayoutComponent from "../../components/Layout";
import PaymentModal from "../../components/payments/PaymentModal";
import Time from "../../components/Time";
import {
  createPayment,
  fetchPayments,
  updatePayment,
} from "../../data/frontend";
import { PaymentForm } from "../../data/models";
import { TableParams } from "../../models/TableDataType";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
type RangeValue = [Moment | null, Moment | null] | null;
export declare type FixedType = "left" | "right" | boolean;

export interface PaymentPageProps {
  session: Session;
}

function PaymentPage({ session }: PaymentPageProps) {
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
  const [paymentItemSelected, setPaymentItemSelected] =
    useState<Payment | null>(null);

  const columns = useMemo<ColumnsType<Payment>>(
    () => [
      {
        title: "Title",
        dataIndex: "title",
        width: 20,
        ellipsis: true,
      },
      {
        title: "Total",
        dataIndex: "total",
        width: 20,
        ellipsis: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        width: 20,
        ellipsis: true,
        render: (type: string) => {
          const color = type == "Expense" ? "volcano" : "geekblue";
          return <Tag color={color}>{type.toUpperCase()}</Tag>;
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        width: 30,
        ellipsis: true,
        render: (date: Date) => {
          return <Time date={date} />;
        },
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 15,
        ellipsis: true,
        render: (_: any, record: Payment) => (
          <Space size="middle">
            <Tooltip title="Edit">
              <Button
                type="default"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  setPaymentItemSelected(record);
                  setOpenPaymentModal(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Remove">
              <Button type="ghost" shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Space>
        ),
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
          scroll={{ x: 'calc(300px + 50%)' }}
        />
      </div>

      <PaymentModal
        isModalOpen={openPaymentModal}
        model={paymentItemSelected}
        onCancel={() => {
          setOpenPaymentModal(false);
        }}
        onSubmit={async (data: PaymentForm) => {
          if (data.id == null) {
            await createPayment(data);
          } else {
            await updatePayment(data);
          }

          setOpenPaymentModal(false);
          mutate();
        }}
      />
    </>
  );
}

PaymentPage.getLayout = (page: JSX.Element) => (
  <LayoutComponent>{page}</LayoutComponent>
);
PaymentPage.anonymous = false;

export default PaymentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
};
