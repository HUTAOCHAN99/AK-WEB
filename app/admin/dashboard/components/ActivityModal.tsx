// app\admin\dashboard\components\ActivityModal.tsx - FULL FIXED VERSION
"use client";

import { useState, useCallback, useEffect } from "react";
import { MdImage, MdError, MdCheckCircle, MdInfo } from "react-icons/md";
import { Activity } from "../types";
import Image from "next/image";

interface ActivityModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  currentActivity: Activity | null;
  uploading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ActivityModal({
  isOpen,
  mode,
  currentActivity,
  uploading,
  onClose,
  onSubmit,
}: ActivityModalProps) {
  const [mainImagePreview, setMainImagePreview] = useState<string>(
    currentActivity?.image_url || "",
  );
  const [imageError, setImageError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState<number>(
    currentActivity?.description?.length || 0,
  );

  // Reset state ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageError("");
      setFileName("");
    }
  }, [isOpen]);

  // Update preview ketika currentActivity berubah dan modal terbuka
  useEffect(() => {
    if (isOpen && currentActivity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMainImagePreview(currentActivity.image_url || "");
      setDescriptionLength(currentActivity.description?.length || 0);
    }
  }, [isOpen, currentActivity]);

  // Handle description input change
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescriptionLength(e.target.value.length);
    },
    [],
  );

  // Handle main image change
  const handleMainImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setImageError("");

      if (file) {
        setFileName(file.name);

        // Validasi file size (max 2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          setImageError(
            `❌ File size too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum is 2MB.`,
          );
          e.target.value = "";
          setFileName("");
          return;
        }

        // Validasi file type
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          setImageError(
            "❌ Invalid file type. Please select JPEG, PNG, WEBP, or GIF image.",
          );
          e.target.value = "";
          setFileName("");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setMainImagePreview(reader.result as string);
        };
        reader.onerror = () => {
          setImageError("❌ Error reading file. Please try another image.");
          e.target.value = "";
          setFileName("");
        };
        reader.readAsDataURL(file);
      } else {
        setFileName("");
        setMainImagePreview(currentActivity?.image_url || "");
      }
    },
    [currentActivity],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setImageError("");

      // Validasi thumbnail untuk mode add
      if (mode === "add") {
        const formData = new FormData(e.currentTarget);
        const imageFile = formData.get("image_file") as File;

        if (!imageFile || imageFile.size === 0) {
          setImageError("⚠️ Please upload a thumbnail image for new activity");
          return;
        }
      }

      // Validasi field required (tanpa batas maksimal karakter untuk description)
      const title = (
        e.currentTarget.elements.namedItem("title") as HTMLInputElement
      )?.value;
      const description = (
        e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement
      )?.value;

      if (!title || title.trim().length < 3) {
        alert("⚠️ Title must be at least 3 characters");
        return;
      }

      if (!description || description.trim().length < 10) {
        alert("⚠️ Description must be at least 10 characters");
        return;
      }

      onSubmit(e);
    },
    [onSubmit, mode],
  );

  const resetForm = useCallback(() => {
    setMainImagePreview(currentActivity?.image_url || "");
    setImageError("");
    setFileName("");
    setDescriptionLength(currentActivity?.description?.length || 0);
  }, [currentActivity]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {mode === "add" ? "➕ Add New Activity" : "✏️ Edit Activity"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl p-1"
            disabled={uploading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="id"
            defaultValue={currentActivity?.id || ""}
          />

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-300">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={currentActivity?.title || ""}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  required
                  placeholder="e.g., Workshop Programming"
                  minLength={3}
                  maxLength={100}
                  disabled={uploading}
                />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MdInfo className="w-3 h-3" />
                  <span>Judul aktivitas (3-100 karakter)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-300">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={currentActivity?.category || ""}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder="e.g., Workshop, Outdoor, Religious"
                  maxLength={50}
                  disabled={uploading}
                />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MdInfo className="w-3 h-3" />
                  <span>Kategori aktivitas (opsional)</span>
                </div>
              </div>
            </div>

            {/* Description - Unlimited characters */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {descriptionLength} characters
                </span>
              </div>
              <textarea
                name="description"
                defaultValue={currentActivity?.description || ""}
                onChange={handleDescriptionChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 resize-y"
                required
                placeholder="Deskripsi lengkap aktivitas..."
                minLength={10}
                disabled={uploading}
              />
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <MdInfo className="w-3 h-3" />
                <span>Minimal 10 karakter, tidak ada batas maksimal</span>
              </div>
            </div>

            {/* Thumbnail Upload Section */}
            <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
              <label className="block text-sm mb-3 font-medium text-gray-300">
                Thumbnail Image <span className="text-red-400">*</span>
                {mode === "edit" && (
                  <span className="ml-2 text-xs text-yellow-400">
                    (Kosongkan jika tidak ingin mengganti)
                  </span>
                )}
              </label>

              {/* Error Message */}
              {imageError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
                  <MdError className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-medium">
                      Image Error
                    </p>
                    <p className="text-red-400 text-xs mt-1">{imageError}</p>
                  </div>
                </div>
              )}

              {/* File Info */}
              {fileName && !imageError && (
                <div className="mb-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg flex items-center gap-3">
                  <MdCheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-300 text-sm font-medium">
                      File Selected
                    </p>
                    <p
                      className="text-green-400 text-xs truncate"
                      title={fileName}
                    >
                      {fileName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFileName("");
                      setMainImagePreview(currentActivity?.image_url || "");
                      const fileInput = document.querySelector(
                        'input[name="image_file"]',
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                    disabled={uploading}
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Thumbnail Preview */}
              <div className="mb-5">
                <p className="text-sm text-gray-400 mb-3">Preview:</p>
                <div
                  className={`relative w-full h-64 rounded-lg overflow-hidden border-2 ${
                    mainImagePreview
                      ? "border-gray-600"
                      : "border-dashed border-gray-700"
                  }`}
                >
                  {mainImagePreview ? (
                    <>
                      <div className="relative w-full h-full">
                        {mainImagePreview.startsWith("data:") ? (
                          // Untuk base64/data URL preview
                          <img
                            src={mainImagePreview}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                                    <MdError class="text-4xl text-red-500 mb-3" />
                                    <p class="text-red-400 text-sm">Failed to load image</p>
                                    <p class="text-gray-500 text-xs mt-1">Please re-upload the image</p>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          // Untuk URL external
                          <Image
                            src={mainImagePreview}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                      <MdImage className="text-5xl text-gray-600 mb-4" />
                      <p className="text-gray-400 text-sm">
                        No thumbnail uploaded
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Upload a thumbnail image
                      </p>
                    </div>
                  )}
                </div>

                {currentActivity?.image_url && !fileName && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="text-gray-400">Current image:</span>{" "}
                    <span
                      className="truncate max-w-xs inline-block align-bottom"
                      title={currentActivity.image_url}
                    >
                      {currentActivity.image_url.substring(0, 80)}...
                    </span>
                  </div>
                )}
              </div>

              {/* File Upload Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      name="image_file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleMainImageChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required={mode === "add"}
                      disabled={uploading}
                    />
                  </label>

                  {mainImagePreview && mode === "edit" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview(currentActivity?.image_url || "");
                        setFileName("");
                        const fileInput = document.querySelector(
                          'input[name="image_file"]',
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                      className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition duration-200 disabled:opacity-50"
                      disabled={uploading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Requirements Info */}
                <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <MdInfo className="w-4 h-4 text-primary" />
                    Thumbnail Requirements:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        Upload thumbnail untuk activity (wajib untuk activity
                        baru)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Ukuran disarankan: 600×400px (landscape)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Format yang didukung: JPG, PNG, WEBP, GIF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Maksimum size: 2MB</span>
                    </li>
                    {mode === "edit" && (
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        <span className="text-yellow-400">
                          Kosongkan jika tidak ingin mengganti thumbnail
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-gray-500">
                        Gambar akan disimpan di Supabase Storage, bukan di
                        database
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={currentActivity?.status || "active"}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 cursor-pointer disabled:opacity-50"
                  disabled={uploading}
                >
                  <option value="active" className="bg-gray-800">
                    Active
                  </option>
                  <option value="inactive" className="bg-gray-800">
                    Inactive
                  </option>
                </select>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MdInfo className="w-3 h-3" />
                  <span>Tampilkan atau sembunyikan activity</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-300">
                  Order Index
                </label>
                <input
                  type="number"
                  name="order_index"
                  defaultValue={currentActivity?.order_index || 0}
                  min="0"
                  step="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 disabled:opacity-50"
                  disabled={uploading}
                />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MdInfo className="w-3 h-3" />
                  <span>
                    Angka lebih kecil akan muncul lebih dulu (0 = pertama)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-lg font-medium transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : mode === "add" ? (
                "➕ Add Activity"
              ) : (
                "💾 Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
