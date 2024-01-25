import { useState } from "react";
// import { login } from "./action";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import Link from "next/link";

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  });

  const methods = useForm<FormData>({
    resolver: joiResolver(schema)
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/login`, data);

      setIsLoading(false);

      if (response.status !== 200) {
        setLoginError("เข้าสู่ระบบไม่สำเร็จ");
      } else {
        router.replace("/devices");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error :>> ", error);
      setLoginError(`เกิดข้อผิดพลาดในการเข้าสู่ระบบ`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              disabled={isLoading}
              className={`w-full p-2 border rounded ${
                errors.username ? "border-red-500" : ""
              }`}
              type="text"
              {...register("username", { required: "กรุณากรอก Username" })}
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              disabled={isLoading}
              className={`w-full p-2 border rounded ${
                errors.password ? "border-red-500" : ""
              }`}
              type="password"
              {...register("password", {
                required: "กรุณากรอก Password"
              })}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 w-full flex justify-center hover:text-cyan-950">
          <Link href={"/register"}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
