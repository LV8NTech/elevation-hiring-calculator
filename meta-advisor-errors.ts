export const META_ADVISOR_INCOMPLETE = "META_ADVISOR_INCOMPLETE";

export const META_ADVISOR_INCOMPLETE_MESSAGE =
  "Meta did not return a complete, usable explanation, so nothing is shown. The calculations are unchanged. No automatic retry was made; you can choose to request again.";

/** Reads `code` from an ApiError-shaped object (ApiError.data is the parsed JSON body). */
export function getApiErrorCode(reason: unknown): string | null {
  if (!reason || typeof reason !== "object") return null;
  const data = (reason as { data?: unknown }).data;
  if (data && typeof data === "object") {
    const code = (data as { code?: unknown; error?: unknown }).code;
    if (typeof code === "string") return code;
    const nested = (data as { error?: unknown }).error;
    if (nested && typeof nested === "object" && typeof (nested as { code?: unknown }).code === "string") {
      return (nested as { code: string }).code;
    }
  }
  return null;
}

export function isMetaAdvisorIncomplete(reason: unknown): boolean {
  return getApiErrorCode(reason) === META_ADVISOR_INCOMPLETE;
}

export function withMetaReference(message: string, reason: unknown): string {
  const reference = (reason as { data?: { reference?: unknown } } | null)?.data?.reference;
  return typeof reference === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reference)
    ? `${message} Reference: ${reference}` : message;
}
