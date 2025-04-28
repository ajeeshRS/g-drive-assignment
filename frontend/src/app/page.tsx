"use client";
import FileCard from "@/components/file-card";
import { useSearch } from "@/context/search-context";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface FileData {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchResult, searchLoading } = useSearch();

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file`,
        { withCredentials: true }
      );

      console.log(response.data);
      setFiles(response.data.files);
    } catch (err) {
      console.error("Error fetching files : ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);
  useEffect(() => {
    console.log({ searchResult });
  }, [searchResult]);
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center relative bg-neutral-900 ">
      <div className="w-5/6 h-full fixed right-0 top-20 bg-[#131314] rounded-2xl flex flex-col items-start justify-start p-10">
        <h3 className="font-medium text-3xl text-white">MyDrive</h3>
        {searchLoading ||
          (loading && (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin repeat-infinite text-neutral-300" />
            </div>
          ))}
        {searchResult && searchResult.length > 0 ? (
          <div className="w-full h-full overflow-scroll grid grid-cols-5 gap-5 mt-10 p-2 pb-20">
            {searchResult.map((fileData, i) => (
              <FileCard key={i} file={fileData} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full overflow-scroll grid grid-cols-5 gap-5 mt-10 p-2 pb-20">
            {files.map((fileData, i) => (
              <FileCard key={i} file={fileData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
