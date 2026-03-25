/**
 * Deploy API
 * POST /api/deploy
 * Body: { secret: string, page?: string }
 *
 * Runs npm run build + pm2 restart lawyer-mb as root.
 * Returns screenshot URL after deploy completes.
 * Called by Amora after code changes via /api/claude-task.
 */
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BRIDGE_SECRET = process.env.CLAUDE_BRIDGE_SECRET;
const PROJECT_DIR = process.env.CLAUDE_DEFAULT_PROJECT || "/root/lawyer-mb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body as { secret?: string };

    const headerSecret = request.headers.get("x-bridge-secret");
    if (BRIDGE_SECRET && secret !== BRIDGE_SECRET && headerSecret !== BRIDGE_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const start = Date.now();

    // Run build + restart (Next.js runs as root so this works)
    const { stdout, stderr } = await execAsync(
      `cd '${PROJECT_DIR}' && npm run build 2>&1 && pm2 restart lawyer-mb 2>&1`,
      { timeout: 5 * 60 * 1000, maxBuffer: 1024 * 1024 * 10 }
    );

    const duration = Date.now() - start;
    const output = (stdout + stderr).trim();

    return NextResponse.json({
      success: true,
      output: output.slice(-500), // last 500 chars of build output
      duration,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
