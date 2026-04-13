export type ApiEnvelope<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const looksLikeApiEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    "data" in value ||
    "meta" in value ||
    "statusCode" in value ||
    "success" in value ||
    "message" in value
  );
};

export const normalizeApiResponse = <T>(
  payload: unknown,
  fallback: T,
): { data: T; meta?: unknown } => {
  if (looksLikeApiEnvelope(payload)) {
    const envelope = payload as ApiEnvelope<T>;

    return {
      data: envelope.data ?? fallback,
      meta: envelope.meta,
    };
  }

  return {
    data: (payload as T) ?? fallback,
    meta: undefined,
  };
};
