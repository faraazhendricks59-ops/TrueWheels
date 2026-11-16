"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "@/components/providers/LanguageProvider";
import {
  ACCEPTED_DOCUMENT_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_BYTES,
  formatFileSize,
  validateFile,
  type UploadedFile,
} from "@/lib/dealers/application";

export interface StagedFile extends UploadedFile {
  id: string;
  /** Object URL for image previews; revoked when the file is removed. */
  previewUrl?: string;
}

interface FileUploadProps {
  label: string;
  description: string;
  /** Comma-separated accept attribute, e.g. ".pdf,image/*". */
  accept: string;
  required?: boolean;
  maxFiles?: number;
  files: StagedFile[];
  onChange: (files: StagedFile[]) => void;
  /** Translation key suffix for an external error (e.g. a missing required doc). */
  error?: string;
}

export function FileUpload({
  label,
  description,
  accept,
  required,
  maxFiles = 1,
  files,
  onChange,
  error,
}: FileUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // A field that accepts PDFs is a document field even though it also allows
  // images: derive the mode from the accept list rather than assuming that
  // "image" appearing anywhere means images only.
  const allowsPdf = accept.includes("pdf");
  const isImageOnly = !allowsPdf && accept.includes("image");
  const acceptedTypes = allowsPdf ? ACCEPTED_DOCUMENT_TYPES : ACCEPTED_IMAGE_TYPES;

  // Object URLs are a manual resource: revoke whatever is still mounted when the
  // component unmounts, otherwise every preview leaks for the page's lifetime.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, []);

  const addFiles = useCallback(
    (selected: FileList | null) => {
      if (!selected || selected.length === 0) return;

      const remaining = maxFiles - files.length;
      if (remaining <= 0) {
        setFileError(t("dealer.errMaxFiles").replace("{count}", String(maxFiles)));
        return;
      }

      const incoming = Array.from(selected).slice(0, remaining);
      const accepted: StagedFile[] = [];
      let rejection: string | null = null;

      for (const file of incoming) {
        const result = validateFile(file, acceptedTypes);
        if (!result.ok) {
          // Report the first problem; showing one clear message beats a list.
          rejection ??= t(
            result.reason === "fileTooLarge" ? "dealer.errFileTooLarge" : "dealer.errFileType",
          ).replace("{size}", formatFileSize(MAX_FILE_BYTES));
          continue;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        });
      }

      setFileError(rejection);
      if (accepted.length > 0) onChange([...files, ...accepted]);
    },
    [acceptedTypes, files, maxFiles, onChange, t],
  );

  const removeFile = (id: string) => {
    const target = files.find((file) => file.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setFileError(null);
    onChange(files.filter((file) => file.id !== id));
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const message = error ?? fileError;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
        {label}
        {required && (
          <span className="ml-0.5 text-brand-red" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <p className="mb-3 text-xs text-neutral-muted">{description}</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={label}
        className={clsx(
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-brand-red bg-brand-red/5"
            : "border-brand-silver hover:border-brand-red hover:bg-brand-red/5",
        )}
      >
        <Upload size={24} className="mx-auto mb-2 text-neutral-subtle" aria-hidden="true" />
        <p className="text-sm font-semibold text-brand-graphite">{t("dealer.dropzone")}</p>
        <p className="mt-1 text-xs text-neutral-muted">
          {t(isImageOnly ? "dealer.formatsImage" : "dealer.formatsDocument").replace(
            "{size}",
            formatFileSize(MAX_FILE_BYTES),
          )}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(event) => {
            addFiles(event.target.files);
            // Reset so re-selecting the same file still fires onChange.
            event.target.value = "";
          }}
          className="hidden"
        />
      </div>

      {message && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-semantic-error" role="alert">
          <AlertCircle size={13} aria-hidden="true" /> {message}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-brand-silver bg-surface-grey p-3"
            >
              {file.previewUrl ? (
                // A blob: URL cannot go through next/image (no remote pattern,
                // and it would need unoptimized anyway), so use a plain img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="h-12 w-12 flex-shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/10">
                  <FileText size={18} className="text-brand-red" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-graphite">{file.name}</p>
                <p className="text-xs text-neutral-muted">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                aria-label={`${t("dealer.removeFile")}: ${file.name}`}
                className="flex-shrink-0 p-1 text-neutral-muted transition-colors hover:text-semantic-error"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
