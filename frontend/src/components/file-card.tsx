"use client";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {
  EllipsisVertical,
  File,
  PackageOpen,
  SquarePen,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { FileData } from "@/app/page";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FileCard({ file }: { file: FileData }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const getFilePath = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fileName = file.originalName;

    return `${baseUrl}/uploads/${fileName}`;
  };

  const handleOpen = () => {
    const url = getFilePath();
    window.location.href = url;
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const fileName = file.originalName;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/delete`,
        {
          data: { fileName },
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting file : ", err);
      toast.error("some error occured during the deletion");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    try {
      setLoading(true);
      const fileName: string = file.fileName;
      const extenstion = fileName.split(".")[1];

      console.log(extenstion);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/rename`,
        {
          oldName: fileName,
          newName: renameValue + "." + extenstion,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setDialogOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error renaming file : ", err);
      toast.error("some error occured during the renaming");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-2xl h-[300px] flex flex-col items-start justify-start space-y-2 p-4 text-white">
      <div className="flex items-center justify-between w-full">
        <span className="max-w-5/6 flex items-center space-x-2 h-6">
          <File className="w-5 h-5 text-blue-400" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="max-w-5/6 h-6  truncate">
                {file.fileName}
              </TooltipTrigger>
              <TooltipContent>
                <p>{file.fileName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  New name
                </Label>
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  id="file-name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRename} disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20 bg-neutral-700 border-none text-white">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleOpen}
                className="hover:bg-neutral-800 flex items-center group"
              >
                <PackageOpen className="w-5 h-5 mr-1 text-white group-hover:text-black" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const nameWithoutExtension = file.originalName.replace(
                    /\.[^/.]+$/,
                    ""
                  );
                  setRenameValue(nameWithoutExtension);
                  setDialogOpen(true);
                }}
                className="hover:bg-neutral-800 flex items-center group"
              >
                <SquarePen className="w-5 h-5 mr-1 text-white group-hover:text-black" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="hover:bg-neutral-800 flex items-center group"
              >
                <Trash2 className="w-5 h-5 mr-1 text-white group-hover:text-black" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-[250px] overflow-hidden flex items-center justify-center rounded-lg object-center">
        {getFilePath().endsWith(".pdf") ? (
          <Document file={getFilePath()} className="w-full h-full">
            <Page scale={0.8} pageNumber={1} width={250} />
          </Document>
        ) : getFilePath().match(/\.(jpg|jpeg|png|gif)$/i) ? (
          <Image
            src={getFilePath()}
            alt="Preview"
            width={50}
            height={50}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-800 rounded-lg">
            <File className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
