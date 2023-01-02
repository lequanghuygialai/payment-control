import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { authOptions } from "../auth/auth";
import { ILogin } from "../common/validation/auth";

function LoginPage() {
  const { query } = useRouter();
  const { callbackUrl = "/payments", error } = query;
  const onSubmit = useCallback(async (data: ILogin) => {
    await signIn("credentials", {
      ...data,
      callbackUrl: callbackUrl as string,
    });
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILogin>();

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="email"
          className="input input-bordered"
          {...register("username")}
        />
        <input
          type="password"
          placeholder="email"
          className="input input-bordered"
          {...register("password", { required: true })}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

LoginPage.anonymous = true;

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session?.user != null) {
    //Authenticated
    return {
      redirect: {
        destination: "/payments",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
