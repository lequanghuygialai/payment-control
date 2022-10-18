import { GetServerSideProps } from "next";
export default function index() {}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {},
  };
};
