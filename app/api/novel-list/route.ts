import { readdirSync } from "fs";
import path from "path";

import { NextResponse } from "next/server";

const handler = async () => {
  const novels = readdirSync(path.join(process.cwd(), "input-txt"), {
    withFileTypes: true,
  })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

  return NextResponse.json({ novels });
};

export { handler as GET };
