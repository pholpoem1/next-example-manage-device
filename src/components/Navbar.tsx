"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";

const Navbar = () => {
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);

  const handleLogout = async () => {
    const response = await axios.get("/api/logout");

    if (response.status === 200) {
      console.log("Logout Success...");
      router.replace("/login");
    } else {
      console.error("Logout Fail...");
    }
  };

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-end">
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                onClick={() => setIsConfirm(true)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ConfirmModal
        title="Logout"
        confirmText="Confirm to logout?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onSubmit={handleLogout}
      />
    </>
  );
};

export default Navbar;
