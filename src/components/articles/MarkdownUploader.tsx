import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";

interface MarkdownUploaderProps {
  onContentLoaded: (content: { title?: string; content: string }) => void;
}

const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({
  onContentLoaded,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is a markdown file
    if (!file.name.endsWith(".md")) {
      toast.error("Please upload a markdown (.md) file");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // Try to extract title from the first heading in the file
        let title = "";
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }

        onContentLoaded({
          title: title || undefined,
          content,
        });

        toast.success("Markdown file loaded successfully");

        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error parsing markdown file:", error);
        toast.error("Error parsing markdown file");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md">
      <input
        type="file"
        accept=".md"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <div className="flex flex-col items-center space-y-2">
        <FileText className="h-8 w-8 text-gray-500" />
        <p className="text-sm text-gray-500">
          Upload a markdown file to quickly create an article
        </p>
        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
          {isLoading ? "Loading..." : "Upload Markdown File"}
        </Button>
      </div>
    </div>
  );
};

export default MarkdownUploader;
