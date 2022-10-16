import { Button, Form, Input, InputNumber, Modal, Radio, Select } from "antd";

export interface PaymentModalProps {
  isModalOpen: boolean;
  onSubmitForm: (data: any) => void;
  onCancel: () => void;
}

export default function PaymentModal({
  isModalOpen,
  onSubmitForm,
  onCancel
}: PaymentModalProps) {
  const [form] = Form.useForm();
  const handleFormSubmit = (values: any) => {
    onSubmitForm(values);
  };

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
