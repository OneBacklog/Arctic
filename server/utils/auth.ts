import { SignJWT, jwtVerify } from 'jose'

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days
const SESSION_TTL = '30d'

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET environment variable must be set and at least 32 characters long. ' +
      'Generate one with: openssl rand -hex 32'
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}
