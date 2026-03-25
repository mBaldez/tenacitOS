/**
 * Deploy API
 * POST /api/deploy
 * Body: { secret?: string, page?: string, caption?: string }
 *
 * Full Amora CEO cycle:
 *  1. npm run build + pm2 restart
 *  2. Screenshot of dashboard
 *  3. Send screenshot to Michael via Telegram
 *
 * Called by Amora after every code task via /api/claude-task.
 */
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, existsSync, unlinkSync } from "fs";

const execAsync = promisify(exec);

const BRIDGE_SECRET = process.env.CLAUDE_BRIDGE_SECRET;
const PROJECT_DIR = process.env.CLAUDE_DEFAULT_PROJECT || "/root/lawyer-mb";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SCREENSHOT_TOKEN = process.env.SCREENSHOT_TOKEN || "amora-screenshot-2026";

async function takeScreenshot(page = "/"): Promise<string | null> {
  const safePage = page.replace(/[^a-zA-Z0-9\-_/]/g, "").slice(0, 50) || "/";
  const url = `http://localhost:3010${safePage}?_stoken=${SCREENSHOT_TOKEN}`;
  const outFile = `/tmp/amora-ss-${Date.now()}.png`;

  try {
    await execAsync(
      `chromium-browser --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1440,900 --screenshot="${outFile}" "${url}" 2>&1`,
      { timeout: 20000 }
    );
    if (existsSync(outFile)) return outFile;
  } catch {
    // screenshot failed — non-fatal
  }
  return null;
}

async function sendTelegramPhoto(photoPath: string, caption: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("caption", caption);

  const blob = new Blob([readFileSync(photoPath)], { type: "image/png" });
  form.append("photo", blob, "dashboard.png");

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: form,
  });
}

async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      secret,
      page = "/",
      caption = "✅ Deploy concluído — dashboard atualizado!",
    } = body as { secret?: string; page?: string; caption?: string };

    const headerSecret = request.headers.get("x-bridge-secret");
    if (BRIDGE_SECRET && secret !== BRIDGE_SECRET && headerSecret !== BRIDGE_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Step 1: Build + restart (use absolute paths — Next.js env may have limited PATH)
    const npmBin = "/usr/bin/npm";
    const pm2Bin = "/usr/bin/pm2";
    let buildOutput = "";

    try {
      const buildResult = await execAsync(
        `cd '${PROJECT_DIR}' && ${npmBin} run build 2>&1`,
        { timeout: 4 * 60 * 1000, maxBuffer: 1024 * 1024 * 10 }
      );
      buildOutput = (buildResult.stdout + buildResult.stderr).trim().slice(-300);
    } catch (buildErr: any) {
      buildOutput = buildErr.stdout || buildErr.stderr || buildErr.message || "build failed";
      // Non-fatal: if build fails, still try to restart with existing build
    }

    try {
      await execAsync(`${pm2Bin} restart lawyer-mb`, { timeout: 30000 });
    } catch (pm2Err: any) {
      // PM2 restart failed — not fatal, server may still be running
    }

    // Step 2: Screenshot (wait 3s for server to come back up)
    await new Promise((r) => setTimeout(r, 3000));
    const screenshotPath = await takeScreenshot(page);

    // Step 3: Send to Telegram
    if (screenshotPath) {
      try {
        await sendTelegramPhoto(screenshotPath, caption);
        unlinkSync(screenshotPath);
      } catch {
        await sendTelegramMessage(`${caption}\n\nDashboard: http://100.78.232.120:3010`).catch(() => {});
      }
    } else {
      await sendTelegramMessage(`${caption}\n\nDashboard: http://100.78.232.120:3010`).catch(() => {});
    }

    return NextResponse.json({ success: true, buildOutput });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
