/**
 * Shell Bridge API — for Claude Code automation only
 * POST /api/bridge
 * Headers: x-bridge-secret: <CLAUDE_BRIDGE_SECRET>
 * Body: { task: string, projectPath?: string }
 *
 * Runs arbitrary shell commands on the VPS as the Next.js process user (root).
 * SECURITY: Protected by CLAUDE_BRIDGE_SECRET. Never expose publicly.
 * Used by Claude Code sessions to set up infra (clone repos, write secrets, etc.)
 */
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BRIDGE_SECRET = process.env.CLAUDE_BRIDGE_SECRET;
const EXEC_TIMEOUT_MS = 60 * 1000; // 60 seconds

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const headerSecret = request.headers.get("x-bridge-secret");
    const body = await request.json();
    const { task, projectPath } = body as { task: string; projectPath?: string };

    if (BRIDGE_SECRET && headerSecret !== BRIDGE_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!task || typeof task !== "string") {
      return NextResponse.json({ error: "Missing task" }, { status: 400 });
    }

    if (task.length > 8000) {
      return NextResponse.json({ error: "Task too long" }, { status: 400 });
    }

    const cwd = projectPath || "/root";
    const start = Date.now();

    const { stdout, stderr } = await execAsync(`bash -c ${JSON.stringify(task)}`, {
      timeout: EXEC_TIMEOUT_MS,
      maxBuffer: 1024 * 1024 * 5,
      cwd,
      env: {
        ...process.env,
        HOME: "/root",
        PATH: process.env.PATH + ":/usr/local/bin:/usr/bin:/bin:/root/.npm-global/bin",
      },
    });

    const duration = Date.now() - start;
    const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : "");

    return NextResponse.json({ success: true, output: output.trim(), duration });
  } catch (error: unknown) {
    const err = error as { message?: string; stdout?: string; stderr?: string; killed?: boolean };
    if (err.killed) {
      return NextResponse.json({ error: "Command timed out" }, { status: 504 });
    }
    const output = (err.stdout || "") + (err.stderr ? `\nSTDERR: ${err.stderr}` : "");
    return NextResponse.json(
      { error: err.message || "Command failed", output: output.trim() },
      { status: 500 }
    );
  }
}
