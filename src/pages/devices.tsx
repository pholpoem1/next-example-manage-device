"use client";

import { useState, useEffect, Fragment, CSSProperties } from "react";
import axios, { AxiosError } from "axios";
import Navbar from "@/components/Navbar";
import { Col, List, Row, Skeleton, message } from "antd";
import ConfirmModal from "@/components/ConfirmModal";
import Button from "@/components/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

const PAGE_SIZE = 5;
const style: CSSProperties = {
  padding: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

interface FormData {
  device_name: string;
  type: string;
  description: string;
  id?: string;
}

const Devices = () => {
  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [initLoading, setInitLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isConfirm, setIsConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schema = Joi.object({
    device_name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    id: Joi.string().allow("", null)
  });

  const methods = useForm<FormData>({
    resolver: joiResolver(schema)
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = methods;

  useEffect(() => {
    fetchDevices();
  }, [page]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get(
        `/api/devices?page=${page}&page_size=${PAGE_SIZE}`
      );

      const data = response.data;

      setDevicesList(data.devices);
      setCurrentPage(data.currentPage);
      setTotal(data.totalDevices);

      setInitLoading(false);
    } catch (error) {
      const { response } = error as AxiosError;

      console.log("error :>> ", error);

      setInitLoading(false);

      messageApi.open({
        type: "error",
        content: response?.statusText
      });

      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล devices", error);

      if (response?.status === 401 || response?.status === 403) {
        router.replace("/login");
      }
    }
  };

  const handelDeleteDevice = async () => {
    try {
      if (idDelete) {
        const response = await axios.get(`/api/devices/delete/${idDelete}`);

        if (response.status === 200) {
          console.log("response.data.message :>> ", response.data.message);
          setIsConfirm(false);

          messageApi.open({
            type: "success",
            content: response.data.message
          });

          await fetchDevices();
        }
      } else {
        setIsConfirm(false);
        console.log("ID not found :>> ");
      }
    } catch (error) {
      const { response } = error as AxiosError;

      messageApi.open({
        type: "error",
        content: response?.statusText
      });

      if (response?.status === 401 || response?.status === 403) {
        router.replace("/login");
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      let url = "/api/devices/create";
      if (data.id) {
        url = "/api/devices/update";
      }

      const response = await axios.post(url, {
        ...data,
        name: data.device_name
      });

      setIsLoading(false);

      if (response.status === 200) {
        reset(response.data.data);
        messageApi.open({
          type: "success",
          content: response.data.message
        });
        fetchDevices();
      }
    } catch (error) {
      const { response } = error as AxiosError;

      setIsLoading(false);

      messageApi.open({
        type: "error",
        content: response?.statusText
      });

      if (response?.status === 401 || response?.status === 403) {
        router.replace("/login");
      }
    }
  };

  const hangleEdit = async (data: FormData) => {
    setValue("id", data.id);
    setValue("device_name", data.device_name);
    setValue("description", data.description);
    setValue("type", data.type);
  };

  return (
    <Fragment>
      <Navbar />
      {contextHolder}

      <div className="min-h-screen flex items-center justify-center flex-col container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-4">Devices</h2>

        <Row
          gutter={4}
          className="flex justify-center w-full p-4 mb-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <form className="flex w-full">
            <Col className="gutter-row" span={7}>
              <div style={style}>
                <label className="block">Name</label>
                <input
                  className={`w-full p-2 border rounded ${
                    errors.device_name ? "border-red-500" : ""
                  }`}
                  type="text"
                  disabled={isLoading}
                  {...register("device_name", {
                    required: "กรุณากรอก divice name"
                  })}
                />
              </div>
            </Col>
            <Col className="gutter-row" span={7}>
              <div style={style}>
                <label className="block ">Type</label>
                <input
                  className={`w-full p-2 border rounded ${
                    errors.type ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                  type="text"
                  {...register("type", {
                    required: "กรุณากรอก type"
                  })}
                />
              </div>
            </Col>
            <Col className="gutter-row" span={7}>
              <div style={style}>
                <label className="block">description</label>
                <input
                  className={`w-full p-2 border rounded ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                  type="text"
                  {...register("description", {
                    required: "กรุณากรอก description"
                  })}
                />
              </div>
            </Col>
            <Col className="gutter-row flex align-middle py-2" span={3}>
              <Button isDisabled={false}>
                {watch("id") ? `บันทึก` : `เพิ่ม`}
              </Button>
            </Col>
          </form>
        </Row>

        <List
          style={{ width: "100%" }}
          className="w-full demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={devicesList}
          pagination={{
            position: "bottom",
            align: "center",
            current: currentPage,
            total: total,
            pageSize: PAGE_SIZE,
            onChange(page) {
              setPage(page);
            }
          }}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <a
                  key="list-loadmore-edit"
                  onClick={() => {
                    hangleEdit(item);
                  }}
                >
                  edit
                </a>,
                <a
                  key="list-loadmore-more"
                  onClick={() => {
                    setIsConfirm(true);
                    setIdDelete(item.id);
                  }}
                >
                  delete
                </a>
              ]}
            >
              <Skeleton title={false} loading={false} active>
                <List.Item.Meta
                  title={`${item?.device_name} (${item?.type})` || ""}
                  description={item?.description || ""}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirm}
        title="Delete"
        confirmText="Confirm to delete"
        setIsOpen={setIsConfirm}
        onSubmit={handelDeleteDevice}
      />
    </Fragment>
  );
};

export default Devices;
