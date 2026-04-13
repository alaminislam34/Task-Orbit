type ErrorWithMessage = {
  message?: string;
};

type ErrorWithNestedMessage = {
  errorSource?: Array<{ message?: string }>;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (!error) {
    return "Something went wrong";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object") {
    const withMessage = error as ErrorWithMessage;
    if (withMessage.message) {
      return withMessage.message;
    }

    const withNestedMessage = error as ErrorWithNestedMessage;
    if (withNestedMessage.errorSource?.length) {
      const nestedMessage = withNestedMessage.errorSource
        .map((entry) => entry.message)
        .filter(Boolean)
        .join(", ");

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return "Something went wrong";
};
