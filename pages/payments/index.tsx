import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Payment } from "@prisma/client";
import {
  Button,
  DatePicker,
  Modal,
  Skeleton,
  Space,
  Statistic,
  Tag,
} from "antd";
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
  deletePayment,
  fetchPayments,
  fetchTotalPayment,
  updatePayment,
} from "../../data/frontend";
import { PaymentForm } from "../../data/models";
import { TableParams } from "../../models/TableDataType";

const { confirm } = Modal;
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
    moment(moment().startOf("month"), dateFormat),
    moment(moment().endOf("month"), dateFormat),
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
        width: 30,
        render: (_: any, record: Payment) => {
          const color = record.type == "Expense" ? "volcano" : "geekblue";
          const letterSign = record.type == "Expense" ? "Chi" : "Thu";
          return (
            <span>
              <Tag className="mr-[5px]" color={color}>{letterSign.toUpperCase()}</Tag>
              {record.title}
            </span>
          );
        },
      },
      {
        title: "Total",
        dataIndex: "total",
        width: 15,
        render: (total: number) => {
          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>;
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        width: 15,
        ellipsis: true,
        render: (date: Date) => {
          return <Time date={date} />;
        },
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 13,
        ellipsis: true,
        render: (_: any, record: Payment) => (
          <Space size="middle">
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setPaymentItemSelected(record);
                setOpenPaymentModal(true);
              }}
            />
            <Button
              type="ghost"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(record);
              }}
            />
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

  const { data: paymentTotalYesterday, mutate: mutatePaymentTotalYesterday } =
    fetchTotalPayment(
      moment().subtract(1, "days").format(dateFormat),
      moment().subtract(1, "days").format(dateFormat)
    );

  const { data: paymentTotalToday, mutate: mutatePaymentTotalToday } =
    fetchTotalPayment(moment().format(dateFormat), moment().format(dateFormat));

  const { data: paymentTotalThisMonth, mutate: mutatePaymentTotalThisMonth } =
    fetchTotalPayment(
      moment().startOf("month").format(dateFormat),
      moment().endOf("month").format(dateFormat)
    );

  const showDeleteConfirm = useCallback((payment: Payment) => {
    confirm({
      title: `Are you sure delete ${payment.title} - ${payment.total}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await deletePayment(payment.id);
        mutateAll();
      },
    });
  }, []);

  const statisticItemRender = useCallback(
    (
      title: string,
      value: number,
      color: string,
      icon: JSX.Element,
      suffix: string
    ) => (
      <div className="border-solid border border-grey rounded bg-white">
        <Statistic
          className="p-2"
          title={title}
          value={value}
          precision={0}
          valueStyle={{ color }}
          prefix={icon}
          suffix={suffix}
        />
      </div>
    ),
    []
  );

  const statisticByDayRender = useCallback(() => {
    if (paymentTotalYesterday != undefined && paymentTotalToday != undefined) {
      const isUp = paymentTotalToday > paymentTotalYesterday;

      return (
        <>
          {statisticItemRender(
            "Today",
            paymentTotalToday ?? 0,
            isUp ? "#3f8600" : "#cf1322",
            isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
            "vnd"
          )}
          {statisticItemRender(
            "Yesterday",
            paymentTotalYesterday ?? 0,
            "grey",
            <></>,
            "vnd"
          )}
          {statisticItemRender(
            "This month",
            paymentTotalThisMonth ?? 0,
            "grey",
            <></>,
            "vnd"
          )}
        </>
      );
    }
    return <Skeleton />;
  }, [paymentTotalYesterday, paymentTotalToday]);

  const mutateAll = useCallback(() => {
    mutate();
    mutatePaymentTotalYesterday();
    mutatePaymentTotalToday();
    mutatePaymentTotalThisMonth();
  }, []);

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
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        {statisticByDayRender()}
      </div>

      <div className="block bg-white">
        <div className="flex flex-row justify-between p-2">
          <RangePicker
            defaultValue={dateRangeValue}
            onCalendarChange={(val) => setDateRangeValue(val)}
          />
          <Button type="primary" onClick={() => setOpenPaymentModal(true)}>
            Create
          </Button>
        </div>

        <div className="p-2">
          <Table
            loading={isLoading}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data?.items}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            scroll={{ x: "calc(450px + 50%)" }}
          />
        </div>
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
          mutateAll();
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
