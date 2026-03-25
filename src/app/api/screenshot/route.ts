/**
 * Screenshot API
 * POST /api/screenshot
 * Body: { secret: string, page?: string }
 *
 * Takes a screenshot of the dashboard using Chromium headless.
 * Returns PNG as base64 for Amora to send via Telegram.
 */
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, existsSync, unlinkSync } from "fs";

const execAsync = promisify(exec);
const BRIDGE_SECRET = process.env.CLAUDE_BRIDGE_SECRET;
const SCREENSHOT_TOKEN = process.env.SCREENSHOT_TOKEN || "amora-screenshot-2026";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, page = "/" } = body as { secret?: string; page?: string };

    const headerSecret = request.headers.get("x-bridge-secret");
    if (BRIDGE_SECRET && secret !== BRIDGE_SECRET && headerSecret !== BRIDGE_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Sanitize page path
    const safePage = page.replace(/[^a-zA-Z0-9\-_/]/g, "").slice(0, 50) || "/";
    const url = `http://localhost:3010${safePage}?_stoken=${SCREENSHOT_TOKEN}`;
    const outFile = `/tmp/amora-screenshot-${Date.now()}.png`;

    const chromiumBin = "chromium-browser";
    const cmd = `${chromiumBin} --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1440,900 --screenshot="${outFile}" "${url}" 2>&1`;

    await execAsync(cmd, { timeout: 30000 });

    if (!existsSync(outFile)) {
      return NextResponse.json({ success: false, error: "Screenshot file not created" }, { status: 500 });
    }

    const imageBuffer = readFileSync(outFile);
    const base64 = imageBuffer.toString("base64");
    unlinkSync(outFile);

    return NextResponse.json({
      success: true,
      image: base64,
      mimeType: "image/png",
      page: safePage,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
