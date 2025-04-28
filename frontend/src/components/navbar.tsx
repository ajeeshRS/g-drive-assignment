"use client";
import axios from "axios";
import {
  Grip,
  HelpCircle,
  Search,
  Settings,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useSearch } from "@/context/search-context";

interface User {
  email: string;
  name: string;
  avatar: string;
}
export default function Navbar() {
  const router = useRouter();
  const { setSearchResult, setSearchLoading } = useSearch();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
        { withCredentials: true }
      );
      setUser(response.data.user);
      console.log("user : ", response.data.user);
    } catch (err) {
      console.error("Error getting user : ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setSearchLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/search`,
        {
          params: {
            searchQuery: value,
          },
          withCredentials: true,
        }
      );

      setSearchLoading(false);
      console.log("search result : ", response.data);
      setSearchResult(response.data.files);
    } catch (err) {
      console.error("Some error searching the files : ", err);
      setSearchLoading(false);
    }
  };

  
  const debouncedSearchResults = useMemo(() => {
    return debounce(handleSearch, 300);
  }, []);
  
  useEffect(() => {
    return () => {
      debouncedSearchResults.cancel();
    };
  }, []);
  
  useEffect(() => {
    console.log("Reached fetch user")
    fetchUser();
  }, []);
  return (
    <nav className="w-full h-20 text-white flex items-center justify-end fixed top-0 bg-neutral-900 z-10">
      <div className="md:w-5/6 w-full flex items-center justify-between pr-6 md:px-5 px-4">
        <div className="w-3/6 relative flex items-center">
          <input
            type="text"
            placeholder="Search in Drive"
            onChange={debouncedSearchResults}
            className="bg-neutral-800 text-neutral-300 text-start md:px-14 px-10 py-4 rounded-full md:w-full w-[60vw] placeholder:text-neutral-300  placeholder:pl-2 outline-0 md:ml-0 ml-16"
          />
          <Search className="w-5 h-5 absolute md:left-8 left-20 top-1/2 transform -translate-y-1/2 text-white" />
          <SlidersHorizontal className="w-5 h-5 absolute right-4 md:block hidden top-1/2 transform -translate-y-1/2 text-white" />
        </div>
        <div className="flex items-center space-x-6">
          <button className="md:block hidden">
            <HelpCircle className="w-6 h-6" />
          </button>
          <button className="md:block hidden">
            <Settings className="w-6 h-6" />
          </button>
          <button className="md:block hidden">
            <Grip className="w-6 h-6" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-black rounded-full border-none w-8 h-8 flex items-center justify-center"
          >
            {loading && (
              <div className="w-full h-full animate-pulse repeat-infinite bg-neutral-700 rounded-full"></div>
            )}

            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt="avatar-img"
                width={24}
                height={24}
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
