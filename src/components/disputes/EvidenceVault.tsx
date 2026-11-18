"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  AlertTriangle,
  FileText,
  Fingerprint,
  Image as ImageIcon,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { readSealedFiles, writeSealedFiles, type SealedFile } from "@/lib/disputes-data";

/**
 * Fingerprint your own documents, on your own device.
 *
 * The brief's evidence vault uploaded files and produced a "chain of custody",
 * with a badge claiming it "holds up in a real legal process", plus invented "AI
 * flags" judging the reader's evidence. There is no server to upload to, so the
 * upload would go nowhere; and a client-side hash is not a chain of custody, which
 * is a record of who held a thing and when, kept by someone with authority. What a
 * hash genuinely proves is narrower and worth stating plainly: that a file is
 * unchanged from the moment it was hashed.
 *
 * That is still useful to a buyer. If you fingerprint your photographs and the
 * seller's messages now, and later someone questions whether a file was altered,
 * you can re-hash it and show it matches. So this does exactly that, and only that:
 * it hashes files you choose, keeps the hash and the file's name and size on your
 * device, and tells you what the hash does and does not prove. Nothing is uploaded,
 * nothing is judged, and the file itself never leaves your machine.
 */
const MAX_BYTES = 25 * 1024 * 1024;

const TYPE_ICON: Record<string, typeof FileText> = {
  image: ImageIcon,
  video: Video,
  audio: FileText,
  document: FileText,
};

function resolveType(mime: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "document";
}

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function EvidenceVault({ vehicleId }: { vehicleId: string }) {
  const { toast } = useToast();
  const [files, setFiles] = useState<SealedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFiles(readSealedFiles()[vehicleId] ?? []);
    setIsHydrated(true);
  }, [vehicleId]);

  const persist = (next: SealedFile[]) => {
    setFiles(next);
    const state = readSealedFiles();
    state[vehicleId] = next;
    writeSealedFiles(state);
  };

  const processFiles = useCallback(
    async (list: FileList) => {
      const added: SealedFile[] = [];
      setIsHashing(true);
      try {
        for (const file of Array.from(list)) {
          if (file.size > MAX_BYTES) {
            toast({
              variant: "error",
              title: "File too large",
              description: `${file.name} is larger than 25 MB.`,
            });
            continue;
          }
          try {
            const sha256 = await hashFile(file);
            added.push({
              id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              sizeBytes: file.size,
              type: resolveType(file.type),
              sha256,
              sealedAt: Date.now(),
            });
          } catch {
            toast({ variant: "error", title: "Could not read file", description: file.name });
          }
        }
        if (added.length) {
          persist([...files, ...added]);
          toast({
            variant: "info",
            title: added.length === 1 ? "File fingerprinted" : `${added.length} files fingerprinted`,
            description:
              "The hash is kept on this device. The file itself has not been uploaded anywhere.",
          });
        }
      } finally {
        setIsHashing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, toast]
  );

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-aurora-purple/10 flex items-center justify-center text-aurora-purple">
            <Icon icon={Fingerprint} size={16} />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-ink-900 dark:text-white">
              Fingerprint your evidence
            </h3>
            <p className="text-[10px] text-ink-500 dark:text-ink-400">
              SHA-256, computed on your device. Nothing is uploaded.
            </p>
          </div>
        </div>
        <Badge variant="status" tone="ink">{files.length} sealed</Badge>
      </div>

      {/* What a hash proves, and what it does not. */}
      <div className="px-5 pt-4">
        <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 flex items-start gap-2">
          <Icon icon={AlertTriangle} size={13} className="text-ink-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
            A SHA-256 hash proves one thing: that a file has not changed since the
            moment it was hashed. It does not prove who made it, when it was taken, or
            where it came from, and it is not a chain of custody. Keep your original
            files — the hash is only useful alongside them.
          </p>
        </div>
      </div>

      {/* Dropzone */}
      <div className="p-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (event.dataTransfer.files?.length) processFiles(event.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-brand bg-brand/5"
              : "border-ink-200 dark:border-ink-800 hover:border-brand/40"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => event.target.files && processFiles(event.target.files)}
          />
          <div className="w-11 h-11 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-3">
            <Icon
              icon={Upload}
              size={18}
              className={isHashing ? "animate-pulse text-brand" : "text-ink-400"}
            />
          </div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">
            {isHashing ? "Hashing…" : "Choose files to fingerprint"}
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Photos, inspection reports, messages, invoices • Max 25 MB each
          </p>
        </div>
      </div>

      <div className="divide-y divide-ink-100 dark:divide-ink-800 border-t border-ink-100 dark:border-ink-800">
        {isHydrated && files.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-400">
            No files fingerprinted yet.
          </div>
        ) : (
          files.map((item) => {
            const ItemIcon = TYPE_ICON[item.type] ?? FileText;
            return (
              <div key={item.id} className="p-4 flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center flex-shrink-0">
                  <Icon icon={ItemIcon} size={16} className="text-ink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-ink-400 mb-1.5">
                    {(item.sizeBytes / 1024 / 1024).toFixed(2)} MB •{" "}
                    {new Date(item.sealedAt).toLocaleString("en-ZA")}
                  </p>
                  <code className="inline-block text-[9px] font-mono text-ink-400 bg-ink-50 dark:bg-ink-950 px-1.5 py-0.5 rounded border border-ink-100 dark:border-ink-800 break-all">
                    {item.sha256}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => persist(files.filter((f) => f.id !== item.id))}
                  className="p-2 text-ink-400 hover:text-semantic-error hover:bg-semantic-error/10 rounded-lg transition-colors flex-shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <Icon icon={Trash2} size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
