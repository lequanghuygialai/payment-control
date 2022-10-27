import { Payment } from "@prisma/client";
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from "antd";
import { useEffect } from "react";
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
  const [form] = Form.useForm<PaymentForm>();
  const handleFormSubmit = async (values: PaymentForm) => {
    await onSubmit(values);
    form.resetFields();
  };

  useEffect(() => {
    if (model != null) {
      form.setFieldsValue(model);
    }
  }, [form, model]);

  return (
    <Modal
      title="Add a new note"
      open={isModalOpen}
      onCancel={onCancel}
      footer={[
        <Button form="payment-form" key="submit" htmlType="submit">
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
          <Radio.Group>
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
          rules={[{ required: true, message: "Missing total" }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}
