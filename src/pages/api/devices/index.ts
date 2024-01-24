import { deleteCookies } from "@/utils/cookies";
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const PAGE_SIZE = req.query.page_size
      ? parseInt(req.query.page_size as string)
      : 5;
    const currentPage = parseInt(query.page as string, 10) || 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const accessToken = req.cookies.accessToken;

    const response = await axios.get(`http://localhost:4000/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const allDevices: any[] = response.data.items;

    const devicesOnCurrentPage = allDevices.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );

    res.json({
      currentPage,
      devices: devicesOnCurrentPage,
      totalDevices: response.data.rowCount
    });
  } catch (error) {
    if (
      (error as AxiosError).response?.status === 401 ||
      (error as AxiosError).response?.status === 403
    ) {
      deleteCookies(res);
    }
    res.status(500).json({ error: `failed to load data ${error}` });
  }
};

export default handler;
