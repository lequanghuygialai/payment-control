import { SearchOutlined } from "@ant-design/icons";
import { Payment } from "@prisma/client";
import { Button, DatePicker } from "antd";
import { ColumnsType } from "antd/lib/table/interface";
import type { Moment } from "moment";
import { GetServerSideProps } from "next";
import { useState } from "react";
import BarChart from "../components/BarChart";
import TableComponent from "../components/Table";
import { PaymentTableData, TableParams } from "../models/TableDataType";

const { RangePicker } = DatePicker;
type RangeValue = [Moment | null, Moment | null] | null;

export default function index() {
  const columns: ColumnsType<PaymentTableData> = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: true,
      render: (title) => `${title}`,
      width: "20%",
    },
    {
      title: "Total",
      dataIndex: "total",
      // filters: [
      //   { text: "Male", value: "male" },
      //   { text: "Female", value: "female" },
      // ],
      width: "20%",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
  ];

  function fetchPayments(tableParams: TableParams) {
    return fetch("/api/Payments")
      .then((res) => res.json())
      .then((response: Payment[]) => {
        return {
          total: 2,
          items: response.map((payment) => {
            return {
              ...payment,
              key: payment.id.toString(),
            };
          }),
        };
      });
  }

  const [dateRangeFilterValue, setDateRangeFilterValue] = useState<RangeValue>([
    null,
    null,
  ]);

  return (
    <>
      <div className="flex flex-row justify-between my-2">
        <RangePicker onChange={setDateRangeFilterValue} />
        <Button type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
      </div>

      {/* <div className="my-2">
        <BarChart />
      </div> */}

      <div className="my-2">
        <TableComponent columns={columns} fetchData={fetchPayments} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {},
  };
};
