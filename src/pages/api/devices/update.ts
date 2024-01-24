import { deleteCookies } from "@/utils/cookies";
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.cookies.accessToken;
  const { device_name, ...data } = req.body;

  try {
    if (req.method === "POST") {
      const response = await axios.post(
        `http://localhost:4000/update-device`,
        { ...data, deviceId: data.id },
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
    res.status(500).json({ error: "failed to update data" });
  }
};

export default handler;
