"use client";

import { useRef, useState } from "react";
import { Building2, ShieldCheck, FileCheck, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/components/providers/LanguageProvider";
import {
  EMPTY_APPLICATION,
  MAX_PHOTOS,
  PROVINCES,
  REQUIRED_DOCUMENT_KEYS,
  validateApplication,
  validateBusinessDetails,
  type ApplicationErrors,
  type DealerApplication,
} from "@/lib/dealers/application";
import { FileUpload, type StagedFile } from "./FileUpload";
import { ApplicationSuccess } from "./ApplicationSuccess";

const STEPS = [
  { id: 1, labelKey: "dealer.stepBusiness", icon: Building2 },
  { id: 2, labelKey: "dealer.stepDocs", icon: ShieldCheck },
  { id: 3, labelKey: "dealer.stepReview", icon: FileCheck },
] as const;

interface Documents {
  cipcDocument: StagedFile[];
  directorId: StagedFile[];
  photos: StagedFile[];
}

const EMPTY_DOCUMENTS: Documents = { cipcDocument: [], directorId: [], photos: [] };

export function DealerApplicationForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<DealerApplication>(EMPTY_APPLICATION);
  const [documents, setDocuments] = useState<Documents>(EMPTY_DOCUMENTS);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [docErrors, setDocErrors] = useState<Partial<Record<keyof Documents, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const update = (key: keyof DealerApplication, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const goToStep = (next: number) => {
    setStep(next);
    // Move focus to the new step heading so keyboard and screen-reader users are
    // not left at the bottom of the previous step's form.
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const handleContinue = () => {
    const found = validateBusinessDetails(form);
    setErrors(found);
    if (Object.keys(found).length === 0) goToStep(2);
  };

  const handleDocumentsContinue = () => {
    const missing = REQUIRED_DOCUMENT_KEYS.filter((key) => documents[key].length === 0);
    const next: Partial<Record<keyof Documents, string>> = {};
    for (const key of missing) next[key] = "required";
    setDocErrors(next);
    if (missing.length === 0) goToStep(3);
  };

  const handleSubmit = async () => {
    const found = validateApplication(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmitError(t("dealer.errFixFields"));
      goToStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/dealer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: form,
          agreed,
          documents: {
            cipcDocument: documents.cipcDocument.map(summarise),
            directorId: documents.directorId.map(summarise),
            photos: documents.photos.map(summarise),
          },
        }),
      });

      if (!response.ok) {
        setSubmitError(t("dealer.errSubmit"));
        return;
      }
      setIsSubmitted(true);
    } catch {
      setSubmitError(t("dealer.errNetwork"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) return <ApplicationSuccess businessName={form.businessName} />;

  const reviewRows: [string, string][] = [
    [t("dealer.businessName"), form.businessName],
    [t("dealer.cipcReg"), form.cipcReg],
    [t("dealer.contact"), `${form.phone} • ${form.email}`],
    [t("dealer.location"), `${form.city}, ${form.province}`],
    [t("dealer.yearsInBusiness"), form.yearsInBusiness || "—"],
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="relative mb-10 flex items-center justify-between" aria-label={t("dealer.steps")}>
        <div className="absolute left-0 top-5 -z-10 h-0.5 w-full bg-brand-silver" aria-hidden="true" />
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <li
              key={s.id}
              className="relative z-10 flex flex-col items-center bg-surface-grey px-2"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  isActive
                    ? "border-brand-red bg-brand-red text-white"
                    : isDone
                      ? "border-semantic-success bg-semantic-success text-white"
                      : "border-brand-silver bg-surface-white text-neutral-subtle"
                }`}
              >
                {isDone ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
              </div>
              <span
                className={`mt-2 text-center text-[10px] font-medium ${
                  isActive ? "text-brand-red" : "text-neutral-muted"
                }`}
              >
                {t(s.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-brand-silver bg-surface-white p-6 shadow-sm md:p-8">
        <p className="sr-only" role="status">
          {t("dealer.stepAnnounce")
            .replace("{current}", String(step))
            .replace("{total}", String(STEPS.length))}
        </p>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="mb-1 text-xl font-bold text-brand-graphite focus:outline-none"
              >
                {t("dealer.businessHeading")}
              </h2>
              <p className="text-sm text-neutral-muted">{t("dealer.businessSubheading")}</p>
            </div>

            <Input
              label={t("dealer.businessName")}
              required
              value={form.businessName}
              error={errors.businessName && t(`dealer.err.${errors.businessName}`)}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. Prestige Motors SA"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label={t("dealer.cipcReg")}
                required
                value={form.cipcReg}
                error={errors.cipcReg && t(`dealer.err.${errors.cipcReg}`)}
                onChange={(e) => update("cipcReg", e.target.value)}
                placeholder="2014/123456/07"
              />
              <Input
                label={t("dealer.vatNumber")}
                value={form.vatNumber}
                error={errors.vatNumber && t(`dealer.err.${errors.vatNumber}`)}
                onChange={(e) => update("vatNumber", e.target.value)}
                placeholder="4123456789"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label={t("dealer.phone")}
                required
                type="tel"
                value={form.phone}
                error={errors.phone && t(`dealer.err.${errors.phone}`)}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="011 555 0123"
              />
              <Input
                label={t("dealer.email")}
                required
                type="email"
                value={form.email}
                error={errors.email && t(`dealer.err.${errors.email}`)}
                onChange={(e) => update("email", e.target.value)}
                placeholder="info@dealership.co.za"
              />
            </div>

            <Input
              label={t("dealer.website")}
              value={form.website}
              error={errors.website && t(`dealer.err.${errors.website}`)}
              onChange={(e) => update("website", e.target.value)}
              placeholder="www.dealership.co.za"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label={t("dealer.province")}
                required
                value={form.province}
                error={errors.province && t(`dealer.err.${errors.province}`)}
                onChange={(e) => update("province", e.target.value)}
              >
                <option value="">{t("dealer.selectProvince")}</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </Select>
              <Input
                label={t("dealer.city")}
                required
                value={form.city}
                error={errors.city && t(`dealer.err.${errors.city}`)}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Sandton"
              />
            </div>

            <Input
              label={t("dealer.yearsInBusiness")}
              type="number"
              min={0}
              max={200}
              value={form.yearsInBusiness}
              error={errors.yearsInBusiness && t(`dealer.err.${errors.yearsInBusiness}`)}
              onChange={(e) => update("yearsInBusiness", e.target.value)}
              placeholder="e.g. 12"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="mb-1 text-xl font-bold text-brand-graphite focus:outline-none"
              >
                {t("dealer.docsHeading")}
              </h2>
              <p className="text-sm text-neutral-muted">{t("dealer.docsSubheading")}</p>
            </div>

            <FileUpload
              label={t("dealer.docCipc")}
              description={t("dealer.docCipcDesc")}
              accept=".pdf,image/*"
              required
              files={documents.cipcDocument}
              onChange={(files) => {
                setDocuments((prev) => ({ ...prev, cipcDocument: files }));
                setDocErrors((prev) => ({ ...prev, cipcDocument: undefined }));
              }}
              error={docErrors.cipcDocument && t("dealer.errDocRequired")}
            />
            <FileUpload
              label={t("dealer.docId")}
              description={t("dealer.docIdDesc")}
              accept=".pdf,image/*"
              required
              files={documents.directorId}
              onChange={(files) => {
                setDocuments((prev) => ({ ...prev, directorId: files }));
                setDocErrors((prev) => ({ ...prev, directorId: undefined }));
              }}
              error={docErrors.directorId && t("dealer.errDocRequired")}
            />
            <FileUpload
              label={t("dealer.docPhotos")}
              description={t("dealer.docPhotosDesc").replace("{count}", String(MAX_PHOTOS))}
              accept="image/*"
              maxFiles={MAX_PHOTOS}
              files={documents.photos}
              onChange={(files) => setDocuments((prev) => ({ ...prev, photos: files }))}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="mb-1 text-xl font-bold text-brand-graphite focus:outline-none"
              >
                {t("dealer.reviewHeading")}
              </h2>
              <p className="text-sm text-neutral-muted">{t("dealer.reviewSubheading")}</p>
            </div>

            <dl className="space-y-3 rounded-xl border border-brand-silver bg-surface-grey p-5">
              {reviewRows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-neutral-muted">{label}</dt>
                  <dd className="text-right font-semibold text-brand-graphite">{value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-brand-silver pt-3 text-sm">
                <dt className="text-neutral-muted">{t("dealer.documentsAttached")}</dt>
                <dd className="text-right font-semibold text-brand-graphite">
                  {REQUIRED_DOCUMENT_KEYS.length + (documents.photos.length > 0 ? 1 : 0)}
                </dd>
              </div>
            </dl>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-silver bg-surface-grey p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-brand-red"
              />
              <span className="text-xs leading-relaxed text-neutral-muted">
                {t("dealer.consent")}{" "}
                <a href="/legal/terms" className="text-brand-red underline">
                  {t("footer.terms")}
                </a>{" "}
                {t("dealer.and")}{" "}
                <a href="/legal/privacy" className="text-brand-red underline">
                  {t("footer.privacy")}
                </a>
                .
              </span>
            </label>

            {submitError && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-semantic-error" role="alert">
                <AlertCircle size={15} aria-hidden="true" /> {submitError}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between border-t border-brand-silver pt-6">
          <Button variant="outline" onClick={() => goToStep(Math.max(1, step - 1))} disabled={step === 1}>
            {t("dealer.back")}
          </Button>

          {step === 1 && <Button onClick={handleContinue}>{t("dealer.continue")}</Button>}
          {step === 2 && <Button onClick={handleDocumentsContinue}>{t("dealer.continue")}</Button>}
          {step === 3 && (
            <Button onClick={handleSubmit} disabled={!agreed || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" /> {t("dealer.submitting")}
                </>
              ) : (
                t("dealer.submit")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Only the metadata is sent; the file bytes would go to object storage. */
function summarise(file: StagedFile) {
  return { name: file.name, size: file.size, type: file.type };
}
