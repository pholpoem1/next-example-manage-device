import { NextApiResponse } from "next";

export const deleteCookies = (res: NextApiResponse) => {
  const expireDate = new Date("Thu, 01 Jan 1970 00:00:00 GMT");
  res.setHeader(
    "Set-Cookie",
    "accessToken=; expires=" + expireDate.toUTCString() + "; Path=/; HttpOnly"
  );

  res.status(200).json({});
};
