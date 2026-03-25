import { exec } from 'child_process'
import { promisify } from 'util'
import { NextResponse } from 'next/server'

const execAsync = promisify(exec)

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync(
      'docker logs moltbot-clawdbot-1 --tail 30 2>&1',
      { timeout: 5000 }
    )
    const output = (stdout + stderr).trim()
    const lines = output.split('\n').filter(Boolean).slice(-30)
    return NextResponse.json({ lines })
  } catch {
    return NextResponse.json({ lines: ['[logs indisponíveis — container offline ou sem permissão]'] })
  }
}
