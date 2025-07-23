import { readFileSync, existsSync } from "fs";
import path from "path";

import { type NextRequest, NextResponse } from "next/server";

const handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: filename } = await params;
  const file = path.join(process.cwd(), "input-txt", filename);

  if (existsSync(file)) {
    const fileData = readFileSync(file);
    const res = new NextResponse(fileData);

    res.headers.set("Content-Type", "text/plain;charset=utf-8");

    return res;
  }
  const res = new NextResponse("Novel Not Found", { status: 404 });

  return res;
};

export { handler as GET };
