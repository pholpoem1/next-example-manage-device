import React from "react";
import { Modal } from "antd";

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  onSubmit,
  title,
  confirmText
}: {
  isOpen: boolean;
  setIsOpen: Function;
  onSubmit: Function;
  title: string;
  confirmText: string;
}) => {
  const handleOk = () => {
    onSubmit();
  };

  const handleCancel = () => {
    console.log("Cancel");
    setIsOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        className: "bg-blue-500 text-white px-4 rounded mt-4 inline-flex"
      }}
    >
      <p>{confirmText}</p>
    </Modal>
  );
};

export default ConfirmModal;
