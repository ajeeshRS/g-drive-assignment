"use client";
import axios, { AxiosError } from "axios";
import {
  Clock,
  Cloud,
  Computer,
  HardDrive,
  House,
  Menu,
  OctagonAlert,
  Plus,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const uploadFile = async (file: File | null) => {
    console.log("triggered upload file function");
    try {
      if (!file) {
        return toast.error("no file selected");
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/upload`,
        formData,
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error("error uploadng file : ", error);

      toast.error(error.response?.data.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* hamburger button */}
      <button
        className={`md:hidden fixed top-5 left-4 z-20 p-2 bg-neutral-900 rounded-lg ${
          isMobileMenuOpen && "ml-52 mt-2"
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* sidebar */}
      <div
        className={`md:w-1/6 w-[80vw] h-screen flex flex-col items-start justify-start space-y-2 bg-neutral-900 text-white fixed left-0 p-6 z-10 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="w-full flex items-center justify-start space-x-3">
          <Image
            src={"/google-drive.png"}
            alt="drive-logo"
            width={40}
            height={40}
          />
          <p className="text-xl text-neutral-300">Drive</p>
        </div>
        <div className="w-full flex flex-col items-start justify-start space-y-2 py-4">
          <label className="flex items-center text-sm p-3 px-5 bg-neutral-800 hover:bg-neutral-700 cursor-pointer rounded-xl text-[#E3E3E3] relative overflow-hidden">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-o w-full h-full opacity-0 cursor-pointer"
            />
            <Plus className="w-8 h-8 text-white mr-2" />
            New
          </label>
          <ul className="w-full flex flex-col items-start justify-start space-y-1 text-[#E3E3E3]">
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <House className="w-5 h-5 text-white mr-3" />
              Home
            </li>
            <li className="w-full flex items-center bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <HardDrive className="w-5 h-5 text-white mr-3" />
              MyDrive
            </li>
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Computer className="w-5 h-5 text-white mr-3" />
              Computers
            </li>
          </ul>
        </div>
        <div className="w-full flex flex-col items-start justify-start">
          <ul className="w-full flex flex-col items-start justify-start space-y-1 text-[#E3E3E3]">
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Users className="w-5 h-5 text-white mr-3" />
              Share with me
            </li>
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Clock className="w-5 h-5 text-white mr-3" />
              Recent
            </li>
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Star className="w-5 h-5 text-white mr-3" />
              Starred
            </li>
          </ul>
        </div>
        <div className="w-full flex flex-col items-start justify-start pt-4">
          <ul className="w-full flex flex-col items-start justify-start space-y-1 text-[#E3E3E3]">
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <OctagonAlert className="w-5 h-5 text-white mr-3" />
              Spam
            </li>
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Trash2 className="w-5 h-5 text-white mr-3" />
              Trash
            </li>
            <li className="w-full flex items-center active:bg-[#004A76] hover:bg-neutral-800 pl-5 cursor-pointer rounded-full py-1">
              <Cloud className="w-5 h-5 text-white mr-3" />
              Storage
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
