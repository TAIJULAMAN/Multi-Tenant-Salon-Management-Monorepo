"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { DEMO_PROFILE } from "./data";

export default function EditProfile() {
  const [name, setName] = useState(DEMO_PROFILE.name);
  const [storeName, setStoreName] = useState(DEMO_PROFILE.store);
  const [email, setEmail] = useState(DEMO_PROFILE.email);
  const [phone, setPhone] = useState(DEMO_PROFILE.phone);
  const [address, setAddress] = useState(DEMO_PROFILE.address);
  const [avatar, setAvatar] = useState(DEMO_PROFILE.avatarUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleReset = () => {
    setAvatar("/avatar/icon1.png");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center relative max-w-2xl mx-auto">
        <div className="w-full text-left mb-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#1E293B]">Change profile</h2>
        </div>

        <div className="w-32 h-32 rounded-full bg-[#F3F4F6] overflow-hidden mb-6 border-4 border-white shadow-md relative">
          <Image
            width={128}
            height={128}
            src={avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="flex items-center gap-3 mb-4">
          <SubmitButton
            onClick={handleUploadClick}
          >
            Upload
          </SubmitButton>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-[#FFE4E6] text-[#FF4C6A] text-sm font-semibold rounded-lg hover:bg-[#FECDD3] transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-[#94A3B8] text-center max-w-[200px]">
          Allowed JPG, GIF or PNG. Max size of 800K
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm max-w-2xl mx-auto mt-6">
        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Personal Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomInput
            label="Your Name"
            value={name}
            onChange={setName}
          />
          <CustomInput
            label="Store Name"
            value={storeName}
            onChange={setStoreName}
          />
          <div className="md:col-span-2">
            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />
          </div>
          <div className="md:col-span-2">
            <CustomInput
              label="Phone"
              type="tel"
              value={phone}
              onChange={setPhone}
            />
          </div>
        </div>

        <CustomInput
          label="Address"
          value={address}
          onChange={setAddress}
        />
      </div>
    </>
  );
}
