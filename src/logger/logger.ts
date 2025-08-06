export function logInfo(message: string, data?: any) {
  console.log(JSON.stringify({ level: 'info', message, data }));
}

export function logError(message: string, error: any) {
  console.error(JSON.stringify({ level: 'error', message, error }));
}
