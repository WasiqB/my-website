"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast({
        variant: "default",
        title: "Success!",
        description: "Chapter Video uploaded successfully",
        duration: 3000,
      });
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Occurred!",
        description: "Something went wrong!",
        duration: 3000,
      });
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <p className="text-sm text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </p>
      )}
    </div>
  );
};
