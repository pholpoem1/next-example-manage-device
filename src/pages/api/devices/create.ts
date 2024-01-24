import { deleteCookies } from "@/utils/cookies";
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.cookies.accessToken;

  try {
    if (req.method === "POST") {
      const response = await axios.post(
        `http://localhost:4000/create-device`,
        { ...req.body },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      res.json({ message: response.data.message });
    }
  } catch (error) {
    if (
      (error as AxiosError).response?.status === 401 ||
      (error as AxiosError).response?.status === 403
    ) {
      deleteCookies(res);
    }
    res.status(500).json({ error: "failed to create data" });
  }
};

export default handler;
