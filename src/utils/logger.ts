const PREFIX = '[MOBILE]';

function timestamp(): string {
  return new Date().toISOString().split('T')[1].slice(0, 12);
}

export function log(step: string, message: string, data?: unknown): void {
  const extra = data !== undefined ? ` | ${JSON.stringify(data)}` : '';
  console.log(`${PREFIX} [${timestamp()}] [${step}] ${message}${extra}`);
}

export function logStep(stepNum: number, action: string, detail?: string): void {
  const d = detail ? ` - ${detail}` : '';
  console.log(`${PREFIX} [${timestamp()}] [STEP ${stepNum}] ${action}${d}`);
}

export function logAssert(what: string, expected: unknown, actual?: unknown): void {
  const act = actual !== undefined ? ` | actual: ${JSON.stringify(actual)}` : '';
  console.log(`${PREFIX} [${timestamp()}] [ASSERT] ${what} | expected: ${JSON.stringify(expected)}${act}`);
}
