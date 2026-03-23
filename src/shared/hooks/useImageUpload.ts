import { useState, useRef } from "react";

export const useImageUpload = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }));
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setImageFile(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    imagePreview,
    imageFile,
    fileInputRef,
    handleCameraClick,
    handleImageChange,
    resetImage,
    setImagePreview // Útil para cuando editas y ya hay una foto en la DB
  };
};