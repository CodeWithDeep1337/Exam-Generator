import { useState } from "react";
import { materialAPI } from "../services/courseApi";

export function useMaterialForm() {
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    type: "YOUTUBE_VIDEO",
    difficulty: "BEGINNER",
    link: "",
    fileUrl: "",
  });
  const [files, setFiles] = useState([]);

  const resetForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      type: "YOUTUBE_VIDEO",
      difficulty: "BEGINNER",
      link: "",
      fileUrl: "",
    });
    setFiles([]);
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    for (const file of selectedFiles) {
      const uploadedFile = await materialAPI.uploadFile(file);
      setFiles((prev) => [...prev, { name: file.name, url: uploadedFile.url }]);
      setMaterialForm((prev) => ({
        ...prev,
        fileUrl: uploadedFile.url,
      }));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    materialForm,
    setMaterialForm,
    files,
    setFiles,
    resetForm,
    handleFileSelect,
    removeFile,
  };
}
