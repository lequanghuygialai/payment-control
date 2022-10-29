import { Payment } from "@prisma/client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { PaymentForm } from "../../data/models";

export interface PaymentModalProps {
  isModalOpen: boolean;
  model: Payment | null;
  onSubmit: (data: PaymentForm) => void;
  onCancel: () => void;
}

export default function PaymentModal({
  isModalOpen,
  model,
  onSubmit,
  onCancel,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<PaymentForm>();
  const handleFormSubmit = async (value: PaymentForm) => {
    setLoading(true);
    await onSubmit({ ...value });
    setLoading(false);
    form.resetFields();
  };

  const handleModalCancel = useCallback(() => {
    onCancel();
    form.resetFields();
  }, []);

  useEffect(() => {
    if (model != null) {
      form.setFieldsValue(model);
    }
  }, [form, model]);

  return (
    <Modal
      title="Add a new note"
      open={isModalOpen}
      onCancel={handleModalCancel}
      footer={[
        <Button
          loading={loading}
          form="payment-form"
          key="submit"
          htmlType="submit"
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        id="payment-form"
        name="control-hooks"
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{ type: "Expense" }}
      >
        <Form.Item name="id" hidden></Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Missing type" }]}
        >
          <Radio.Group className="w-full">
            <Radio.Button value="Expense">Expense - Chi</Radio.Button>
            <Radio.Button value="Earning">Earning - Thu</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="title"
          label="Note"
          rules={[{ required: true, message: "Missing Note" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="total"
          label="Total"
          rules={[
            { type: "number", min: 0, message: "Cannot be less than 0" },
            { required: true, message: "Missing total" },
          ]}
        >
          <InputNumber
            className="w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          required
          getValueProps={(value) => ({ value: moment(value) })}
          initialValue={moment().format("YYYY-MM-DDTHH:mm:ssZ")}
          rules={[
            { type: "date" },
            { required: true, message: "Missing date" },
          ]}
        >
          <DatePicker className="w-full" showTime={{ format: "HH:mm" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
