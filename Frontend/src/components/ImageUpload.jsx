"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

const ImageUpload = ({ onImageUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0])
      }
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
      <h3 className="text-lg font-semibold text-green-800 mb-4">Upload Plant Image</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-500 hover:bg-green-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-6xl mb-4">📷</div>
        {isDragActive ? (
          <p className="text-green-600 text-lg">Drop the image here...</p>
        ) : (
          <div>
            <p className="text-green-600 text-lg mb-2">Drag and drop an image here, or click to select</p>
            <p className="text-green-500 text-sm">Supports: JPEG, PNG, GIF, BMP, WebP</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
