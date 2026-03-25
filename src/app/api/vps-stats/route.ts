// src/app/api/vps-stats/route.ts
import { exec } from 'child_process'
import { promisify } from 'util'
import { NextResponse } from 'next/server'

const execAsync = promisify(exec)

async function getCpuPercent(): Promise<number> {
  try {
    const read = async () => {
      const { stdout } = await execAsync('head -1 /proc/stat')
      const parts = stdout.trim().split(/\s+/).slice(1).map(Number)
      const idle = parts[3]
      const total = parts.reduce((a, b) => a + b, 0)
      return { idle, total }
    }
    const a = await read()
    await new Promise(r => setTimeout(r, 100))
    const b = await read()
    const idleDelta = b.idle - a.idle
    const totalDelta = b.total - a.total
    return Math.round((1 - idleDelta / totalDelta) * 100)
  } catch {
    return 0
  }
}

async function getRamStats(): Promise<{ used: number; total: number; percent: number }> {
  try {
    const { stdout } = await execAsync('cat /proc/meminfo')
    const lines: Record<string, number> = {}
    for (const line of stdout.split('\n')) {
      const [key, val] = line.split(':')
      if (key && val) lines[key.trim()] = parseInt(val.trim())
    }
    const total = (lines['MemTotal'] ?? 0) / 1024 / 1024
    const available = (lines['MemAvailable'] ?? 0) / 1024 / 1024
    const used = total - available
    return {
      used: Math.round(used * 10) / 10,
      total: Math.round(total * 10) / 10,
      percent: Math.round((used / total) * 100),
    }
  } catch {
    return { used: 0, total: 0, percent: 0 }
  }
}

async function getDiskStats(): Promise<{ used: number; total: number; percent: number }> {
  try {
    const { stdout } = await execAsync('df -BG / | tail -1')
    const parts = stdout.trim().split(/\s+/)
    const total = parseInt(parts[1])
    const used = parseInt(parts[2])
    const percent = parseInt(parts[4])
    return { used, total, percent }
  } catch {
    return { used: 0, total: 0, percent: 0 }
  }
}

export async function GET() {
  const [cpu, ram, disk] = await Promise.all([getCpuPercent(), getRamStats(), getDiskStats()])
  return NextResponse.json({ cpu, ram, disk })
}
