import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { confirmPassword, ...rest } = req.body;
  try {
    if (req.method === "POST") {
      const response = await axios.post(`http://localhost:4000/register`, rest);

      res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "failed to create data" });
  }
};

export default handler;
