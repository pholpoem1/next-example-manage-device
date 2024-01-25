"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Joi from "joi";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "@/components/Button";
import Link from "next/link";
import { message } from "antd";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string>("");
  const [registerSuccess, setRegisterSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
  });

  const methods = useForm<FormData>({
    resolver: joiResolver(schema)
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = methods;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/register", data);

      setIsLoading(false);
      if (response.status === 200) {
        setValue("username", "");
        setValue("email", "");
        setValue("password", "");
        setValue("confirmPassword", "");

        setRegisterSuccess("ลงทะเบียนเรียบร้อย");

        messageApi.open({
          type: "success",
          content: "ลงทะเบียนเรียบร้อย"
        });
      } else {
        setRegisterError("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      setIsLoading(false);
      setRegisterError(`เกิดข้อผิดพลาดในการส่งข้อมูลไปที่เซิร์ฟเวอร์ ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contextHolder}

      <form
        className="w-full max-w-md bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <label className="block mb-2">Username</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          {...register("username", { required: true })}
          disabled={isLoading}
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}

        <label className="block mb-2">Email</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <div className="relative mb-4">
          <label className="block mb-2">Password</label>
          <input
            className="w-full p-2 border rounded"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true, minLength: 6 })}
            disabled={isLoading}
          />
          <span
            className="absolute top-2 right-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>

        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <div className="relative mb-4">
          <label className="block mb-2">Confirm Password</label>
          <input
            className="w-full p-2 border rounded"
            type={showPassword ? "text" : "password"}
            disabled={isLoading}
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === watch("password")
            })}
          />
          <span
            className="absolute top-2 right-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>

        {errors.confirmPassword && (
          <span className="text-red-500">รหัสผ่านไม่ตรงกัน</span>
        )}

        {registerError && (
          <div className="text-red-500 mb-4">{registerError}</div>
        )}
        {registerSuccess && (
          <div className="text-green-700 mb-4">{registerSuccess}</div>
        )}

        <div className="relative mb-4">
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            <span>{isLoading ? "Registering..." : "Register"}</span>
          </Button>

          <div className="mt-4 w-full flex justify-center hover:text-cyan-950">
            <Link href={"/login"}>Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
