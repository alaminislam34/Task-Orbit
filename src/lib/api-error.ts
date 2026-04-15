type ErrorWithMessage = {
  message?: string;
  statusCode?: number;
  requestId?: string;
};

type ErrorWithNestedMessage = {
  errorSource?: Array<{ path?: string; message?: string }>;
};

type ApiErrorDetails = {
  message: string;
  requestId?: string;
  validationErrors: Array<{ path?: string; message: string }>;
};

export const getApiErrorDetails = (error: unknown): ApiErrorDetails => {
  const fallback: ApiErrorDetails = {
    message: "Something went wrong",
    validationErrors: [],
  };

  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return {
      ...fallback,
      message: error,
    };
  }

  if (error instanceof Error && error.message) {
    return {
      ...fallback,
      message: error.message,
    };
  }

  if (typeof error !== "object") {
    return fallback;
  }

  const withMessage = error as ErrorWithMessage;
  const withNestedMessage = error as ErrorWithNestedMessage & {
    requestId?: string;
  };

  const validationErrors = (withNestedMessage.errorSource ?? [])
    .map((entry) => ({
      path: entry.path,
      message: entry.message?.trim() || "Validation error",
    }))
    .filter((entry) => entry.message);

  const baseMessage =
    withMessage.message?.trim() ||
    (validationErrors.length ? "Validation error" : fallback.message);

  return {
    message: validationErrors.length
      ? `${baseMessage}: ${validationErrors
          .map((entry) =>
            entry.path ? `${entry.path} - ${entry.message}` : entry.message,
          )
          .join("; ")}`
      : baseMessage,
    requestId: withNestedMessage.requestId,
    validationErrors,
  };
};

export const getApiErrorMessage = (error: unknown): string => {
  return getApiErrorDetails(error).message;
};
