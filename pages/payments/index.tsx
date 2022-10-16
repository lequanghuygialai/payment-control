import { SearchOutlined } from "@ant-design/icons";
import { Payment } from "@prisma/client";
import { Button, DatePicker } from "antd";
import { ColumnsType } from "antd/lib/table";
import type { Moment } from "moment";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import PaymentModal from "../../components/payments/PaymentModal";
import TableComponent from "../../components/Table";
import Time from "../../components/Time";
import { PaymentTableData, TableParams } from "../../models/TableDataType";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
type RangeValue = [Moment | null, Moment | null] | null;

export default function index() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dataSource, setDataSource] = useState<PaymentTableData[]>([]);
  const [dateRangeValue, setDateRangeValue] = useState<RangeValue>([
    moment("2022/10/01", dateFormat),
    moment("2022/10/31", dateFormat),
  ]);

  const columns: ColumnsType<PaymentTableData> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title) => `${title}`,
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
      render: (date) => {
        return <Time date={date} />;
      },
    },
  ];

  const fetchDataSource = useCallback(
    (tableParams: TableParams) => {
      var query = new URLSearchParams();

      if (dateRangeValue != null && dateRangeValue.length > 0) {
        if (dateRangeValue[0]) {
          query.append("fromDate", dateRangeValue[0].format("YYYY-MM-DD"));
        }

        if (dateRangeValue[1]) {
          query.append("toDate", dateRangeValue[1].format("YYYY-MM-DD"));
        }
      }

      return fetch("/api/Payments?" + query.toString())
        .then((res) => res.json())
        .then((response: Payment[]) => {
          return {
            total: response.length,
            items: response.map((payment) => {
              return {
                ...payment,
                key: payment.id.toString(),
              };
            }),
          };
        });
    },
    [dateRangeValue]
  );

  const handleSearch = useCallback(async () => {
    await fetchDataSource({});
  }, [dateRangeValue]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataSource({});
      setDataSource(data.items);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <div className="flex flex-row-reverse">
        <Button type="primary" onClick={() => setOpenPaymentModal(true)}>
          Create
        </Button>
      </div>

      <div className="flex flex-row justify-between my-2">
        <RangePicker
          defaultValue={dateRangeValue}
          onChange={(val) => setDateRangeValue(val)}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="my-2">
        <TableComponent columns={columns} dataSource={dataSource} />
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
        }}
      />
    </>
  );
}
