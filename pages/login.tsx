import { Button, Form, Input } from "antd";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { ILogin } from "../common/validation/auth";

function LoginPage() {
  const { query } = useRouter();
  const { callbackUrl = "/payments", error } = query;
  const onFinish = useCallback(async (data: ILogin) => {
    await signIn("credentials", {
      ...data,
      callbackUrl: callbackUrl as string,
    });
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
        name="username"
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

LoginPage.anonymous = true;

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  // const session = await unstable_getServerSession(req, res, authOptions);

  // if (session?.user != null) {
  //   //Authenticated
  //   return {
  //     redirect: {
  //       destination: "/payments",
  //       permanent: false,
  //     },
  //   };
  // }

  console.log(process.env.DATABASE_URL)

  return {
    props: {},
  };
};
