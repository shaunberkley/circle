import { NextResponse, type NextRequest } from 'next/server'

/**
 * IP Address
 *
 * @link https://nextjs.org/docs/app/api-reference/functions/headers#ip-address
 */

export async function GET(request: NextRequest) {
  const FALLBACK_IP_ADDRESS = '127.0.0.1'
  const xForwardedFor = request.headers.get('X-Forwarded-For')

  let ip = request.ip

  if (!ip && xForwardedFor) {
    ip = xForwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  } else if (!ip) {
    ip = request.headers.get('x-real-ip') ?? FALLBACK_IP_ADDRESS
  }

  return new Response(ip, { status: 200 })
}
