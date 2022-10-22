import { NextApiRequest, NextApiResponse } from "next";
import { createUser, findUser } from "../../../data/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const { username, email, password } = req.body;

    findUser(email).then((resp) => {
      if (resp != null) {
        res.status(400).json({ message: "User already exists." });
        return;
      }
    });

    createUser({ username, email, password }).then((resp) => {
      res.status(200).json(resp);
    });
  }
}
