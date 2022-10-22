import { Button, Form, Input } from "antd";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { ILogin } from "../common/validation/auth";

export default function index() {
  const onFinish = useCallback(async (data: ILogin) => {
    await signIn("credentials", { ...data, callbackUrl: "/payments" });
  }, []);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: false }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {},
  };
};
