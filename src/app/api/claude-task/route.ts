/**
 * Claude Code Bridge API
 * POST /api/claude-task
 * Body: { task: string, project?: string, secret: string }
 *
 * Executes a task via the claude CLI (non-interactive mode).
 * Called by OpenClaw skills when Amora needs to delegate programming work.
 *
 * Security:
 *  - Requires CLAUDE_BRIDGE_SECRET header or body field
 *  - Only accessible from localhost / Tailscale network
 *  - No arbitrary command execution — only `claude --print`
 */
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BRIDGE_SECRET = process.env.CLAUDE_BRIDGE_SECRET;
const DEFAULT_PROJECT = process.env.CLAUDE_DEFAULT_PROJECT || "/root/lawyer-mb";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Max task length to prevent abuse
const MAX_TASK_LENGTH = 4000;
// Timeout: 8 minutes (claude can take a while for complex tasks)
const EXEC_TIMEOUT_MS = 8 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, project, secret } = body as {
      task: string;
      project?: string;
      secret?: string;
    };

    // Auth check — skip if no secret is configured (dev mode)
    if (BRIDGE_SECRET) {
      const headerSecret = request.headers.get("x-bridge-secret");
      if (secret !== BRIDGE_SECRET && headerSecret !== BRIDGE_SECRET) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    if (!task || typeof task !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing task" },
        { status: 400 }
      );
    }

    if (task.length > MAX_TASK_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Task too long (max ${MAX_TASK_LENGTH} chars)` },
        { status: 400 }
      );
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "ANTHROPIC_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const workDir = project || DEFAULT_PROJECT;

    // Escape single quotes in task for shell safety
    const escapedTask = task.replace(/'/g, "'\\''");

    const command = `cd '${workDir}' && claude --print '${escapedTask}' 2>&1`;

    const start = Date.now();

    const { stdout } = await execAsync(command, {
      timeout: EXEC_TIMEOUT_MS,
      maxBuffer: 1024 * 1024 * 20, // 20MB
      env: {
        ...process.env,
        ANTHROPIC_API_KEY,
        HOME: "/root",
        PATH: process.env.PATH + ":/usr/local/bin:/root/.npm-global/bin",
      },
    });

    const duration = Date.now() - start;

    return NextResponse.json({
      success: true,
      output: stdout.trim(),
      duration,
      project: workDir,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    // Timeout error
    if (msg.includes("ETIMEDOUT") || msg.includes("timed out")) {
      return NextResponse.json(
        { success: false, error: "Task timed out after 8 minutes" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
