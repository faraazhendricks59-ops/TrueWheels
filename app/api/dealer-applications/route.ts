import { NextResponse, type NextRequest } from "next/server";
import {
  EMPTY_APPLICATION,
  REQUIRED_DOCUMENT_KEYS,
  validateApplication,
  type DealerApplication,
} from "@/lib/dealers/application";

/**
 * Accepts a dealer application.
 *
 * The browser validates for speed, but this endpoint re-validates every field:
 * a client-side check is a convenience, not a security control. Incoming data is
 * rebuilt field by field so nothing unexpected is persisted.
 *
 * TODO(persistence): the Phase 25 verification queue does not exist yet. Once it
 * does, write the record there and notify the review team.
 */
export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalidJson" }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const raw = (body.application ?? {}) as Record<string, unknown>;

  const application: DealerApplication = { ...EMPTY_APPLICATION };
  for (const key of Object.keys(EMPTY_APPLICATION) as (keyof DealerApplication)[]) {
    const value = raw[key];
    application[key] = typeof value === "string" ? value.trim().slice(0, 200) : "";
  }

  const errors = validateApplication(application);

  const documents = (body.documents ?? {}) as Record<string, unknown>;
  const missingDocuments = REQUIRED_DOCUMENT_KEYS.filter((key) => {
    const value = documents[key];
    return !Array.isArray(value) || value.length === 0;
  });

  if (Object.keys(errors).length > 0 || missingDocuments.length > 0) {
    return NextResponse.json(
      { ok: false, error: "validationFailed", fields: errors, missingDocuments },
      { status: 422 },
    );
  }

  if (body.agreed !== true) {
    return NextResponse.json({ ok: false, error: "termsNotAccepted" }, { status: 422 });
  }

  // Never log the document contents; they are identity documents.
  console.info("[dealer-application] received", {
    businessName: application.businessName,
    province: application.province,
    documents: Object.keys(documents).length,
  });

  return NextResponse.json({ ok: true, status: "pending_review" }, { status: 202 });
}
