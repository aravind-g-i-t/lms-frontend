import { Download, FileImage, FileText } from "lucide-react";

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export const AttachmentPreview: React.FC<{ attachment: Attachment }> = ({ attachment }) => {

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage size={16} />;
    return <FileText size={16} />;
  };
  return (
    <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3 max-w-xs">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
        {getFileIcon(attachment.fileType)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{attachment.fileName}</p>
        <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
      </div>
      <a
        href={attachment.fileUrl}
        download={attachment.fileName}
        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
        title="Download"
      >
        <Download size={16} className="text-gray-600" />
      </a>
    </div>
  );
};