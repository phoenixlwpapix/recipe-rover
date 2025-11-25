import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageSrc,
  alt,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 
                 flex items-center justify-center
                 bg-black/70 backdrop-blur-sm 
                 animate-fadeIn"
      onClick={onClose}
    >
      {/* 图片容器 */}
      <div
        className="relative p-2 max-w-5xl w-full 
                   animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 
                     bg-white/20 backdrop-blur 
                     rounded-full p-2 
                     hover:bg-white/40 transition 
                     border border-white/30 
                     shadow-lg"
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>

        {/* 主图 */}
        <Image
          src={imageSrc}
          alt={alt}
          width={1600}
          height={1200}
          className="w-full h-auto max-h-[90vh] object-contain 
                     rounded-xl shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
}
