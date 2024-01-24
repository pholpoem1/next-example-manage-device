import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";

export const handleLogout = async () => {
  cookies().delete("accessToken");
  redirect("/login");
};
