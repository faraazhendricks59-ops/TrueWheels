/**
 * Dealer application rules, shared by the wizard and the API route.
 *
 * Keeping validation here (rather than inline in the form) means the client and
 * the server enforce the same thing: the API re-validates everything, because a
 * browser check is a convenience, not a security control.
 */

export interface DealerApplication {
  businessName: string;
  cipcReg: string;
  vatNumber: string;
  phone: string;
  email: string;
  website: string;
  province: string;
  city: string;
  yearsInBusiness: string;
}

export const EMPTY_APPLICATION: DealerApplication = {
  businessName: "",
  cipcReg: "",
  vatNumber: "",
  phone: "",
  email: "",
  website: "",
  province: "",
  city: "",
  yearsInBusiness: "",
};

/** The nine provinces of South Africa. */
export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
] as const;

export type Province = (typeof PROVINCES)[number];

/** Documents a dealer must supply before the application can be submitted. */
export const REQUIRED_DOCUMENT_KEYS = ["cipcDocument", "directorId"] as const;
export type RequiredDocumentKey = (typeof REQUIRED_DOCUMENT_KEYS)[number];

/** Upload constraints. 10 MB is the brief's stated limit and is actually enforced. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTOS = 5;

export const ACCEPTED_DOCUMENT_TYPES = [".pdf", "image/png", "image/jpeg", "image/webp"] as const;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

/**
 * CIPC company registration numbers look like 2014/123456/07.
 * Legacy close corporations (CK) use CK2014/123456/23.
 */
export const CIPC_PATTERN = /^(CK)?\d{4}\/\d{6}\/\d{2}$/i;

export function isValidCipcNumber(value: string): boolean {
  return CIPC_PATTERN.test(value.trim());
}

/** South African numbers, optionally +27-prefixed: 011 555 0123, +27 82 123 4567. */
export const SA_PHONE_PATTERN = /^(\+27|0)\d{9}$/;

export function isValidSaPhone(value: string): boolean {
  return SA_PHONE_PATTERN.test(normalisePhone(value));
}

/** Strip spaces, dashes and brackets so formatting never fails validation. */
export function normalisePhone(value: string): string {
  return value.replace(/[\s()\-]/g, "");
}

/** Deliberately permissive: catches typos without rejecting valid addresses. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** SA VAT numbers are 10 digits starting with 4. */
export function isValidVatNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 && digits.startsWith("4");
}

export function isValidWebsite(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true; // optional
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function isValidYearCount(value: string): boolean {
  if (!value.trim()) return true; // optional
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 200;
}

/**
 * Error codes, not messages: this module stays free of the i18n layer and the
 * wizard maps each code to a translation key under `dealer.err.*`.
 */
export type ApplicationErrorCode =
  | "businessNameRequired"
  | "businessNameShort"
  | "cipcRequired"
  | "cipcInvalid"
  | "vatInvalid"
  | "phoneRequired"
  | "phoneInvalid"
  | "emailRequired"
  | "emailInvalid"
  | "provinceRequired"
  | "provinceInvalid"
  | "cityRequired"
  | "websiteInvalid"
  | "yearsInvalid";

export type ApplicationErrors = Partial<Record<keyof DealerApplication, ApplicationErrorCode>>;

/**
 * Field-level errors keyed by translation key suffix, so the wizard can render
 * localised messages without this module depending on the i18n layer.
 */
export function validateApplication(values: DealerApplication): ApplicationErrors {
  const errors: ApplicationErrors = {};

  if (!values.businessName.trim()) errors.businessName = "businessNameRequired";
  else if (values.businessName.trim().length < 2) errors.businessName = "businessNameShort";

  if (!values.cipcReg.trim()) errors.cipcReg = "cipcRequired";
  else if (!isValidCipcNumber(values.cipcReg)) errors.cipcReg = "cipcInvalid";

  if (values.vatNumber.trim() && !isValidVatNumber(values.vatNumber)) errors.vatNumber = "vatInvalid";

  if (!values.phone.trim()) errors.phone = "phoneRequired";
  else if (!isValidSaPhone(values.phone)) errors.phone = "phoneInvalid";

  if (!values.email.trim()) errors.email = "emailRequired";
  else if (!isValidEmail(values.email)) errors.email = "emailInvalid";

  if (!values.province.trim()) errors.province = "provinceRequired";
  else if (!(PROVINCES as readonly string[]).includes(values.province)) errors.province = "provinceInvalid";

  if (!values.city.trim()) errors.city = "cityRequired";

  if (!isValidWebsite(values.website)) errors.website = "websiteInvalid";
  if (!isValidYearCount(values.yearsInBusiness)) errors.yearsInBusiness = "yearsInvalid";

  return errors;
}

/** Only the fields collected in step 1, so Continue can validate just that step. */
export function validateBusinessDetails(values: DealerApplication): ApplicationErrors {
  const all = validateApplication(values);
  const stepOne: (keyof DealerApplication)[] = [
    "businessName",
    "cipcReg",
    "vatNumber",
    "phone",
    "email",
    "website",
    "province",
    "city",
    "yearsInBusiness",
  ];
  const filtered: ApplicationErrors = {};
  for (const key of stepOne) {
    if (all[key]) filtered[key] = all[key];
  }
  return filtered;
}

export interface FileValidationResult {
  ok: boolean;
  /** Translation key suffix describing the first problem found. */
  reason?: "fileTooLarge" | "fileTypeNotAllowed";
}

/** Validates a single upload against the accept list and the size cap. */
export function validateFile(
  file: UploadedFile,
  accepted: readonly string[],
): FileValidationResult {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const typeAllowed = accepted.includes(file.type) || accepted.includes(extension);
  if (!typeAllowed) return { ok: false, reason: "fileTypeNotAllowed" };
  if (file.size > MAX_FILE_BYTES) return { ok: false, reason: "fileTooLarge" };
  return { ok: true };
}

/** Human-readable size, switching to KB below 1 MB. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Reference shown to the applicant so they can quote it to support. */
export function applicationReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `TW-DLR-${stamp}${random}`;
}
