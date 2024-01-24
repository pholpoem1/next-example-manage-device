import { deleteCookies } from "@/utils/cookies";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  deleteCookies(res);
};

export default handler;
