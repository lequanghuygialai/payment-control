import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/auth";
import { deletePayment, updatePayment } from "../../../../data/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session == undefined) {
    res.status(401).json("Unauthorized");
    return;
  }

  const { id } = req.query;

  if (req.method == "PUT") {
    return updatePayment({ ...req.body, id, updatedBy: session.user.id })
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(err.status);
      });
  } else if (req.method == "DELETE") {
    return deletePayment(`${id}`)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(err.status);
      });
  }
}
