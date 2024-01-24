import { deleteCookies } from "@/utils/cookies";
import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = req.cookies.accessToken;
    const id = req.query.id;

    const response = await axios.post(
      `http://localhost:4000/delete-device`,
      {
        deviceId: id
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.status(200).json({ message: response.data.message });
  } catch (error) {
    console.log("error :>> ", error);
    if (
      (error as AxiosError).response?.status === 401 ||
      (error as AxiosError).response?.status === 403
    ) {
      deleteCookies(res);
    }
    res.status(500).json({ error: "failed to delete data" });
  }
};

export default handler;
