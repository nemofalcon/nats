export enum ErrorCode {
  INVALID_PAYLOAD = 'invalid_payload',
  DB_ERROR = 'db_error',
  CACHE_ERROR = 'cache_error',
  APIKEY_NOT_FOUND = 'apiKey_not_found',
}

export function createError(code: ErrorCode, message: string) {
  return {
    error: {
      code,
      message,
    }
  };
}
