import React, { useRef } from "react";

export default function UploadBox({ imageData, onFileSelect, onPredict, onClear, loading, mode }) {
    const fileRef = useRef();

    function handleFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        onFileSelect(f);
        e.target.value = ""; // reset so same file can be chosen again
    }

    function handleDrop(e) {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFileSelect(f);
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="rounded-xl border-2 border-dashed border-emerald-200 p-8 flex flex-col items-center justify-center shadow-lg"
        >
            {!imageData ? (
                <>
                    <p className="text-emerald-600 mb-4">Drag & drop an image or</p>
                    <button
                        onClick={() => fileRef.current.click()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md"
                        disabled={loading}
                    >
                        Select Image
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </>
            ) : (
                <>
                    <img
                        src={imageData}
                        alt="preview"
                        className="w-full max-h-80 object-contain rounded-md mb-4"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={onPredict}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-60"
                        >
                            {loading ? "Predicting..." : "Predict"}
                        </button>
                        <button
                            onClick={onClear}
                            className="px-4 py-2 border rounded-md"
                            disabled={loading}
                        >
                            Clear
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
