import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const response = await axios.post(
        `http://localhost:4000/login`,
        req.body
      );

      res.setHeader(
        "Set-Cookie",
        `accessToken=${response.data.token}; Path=/; HttpOnly`
      );

      res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
};

export default handler;
