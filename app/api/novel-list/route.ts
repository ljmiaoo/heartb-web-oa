import { readdirSync } from "fs";
import path from "path";

const handler = async () => {
  const novels = readdirSync(path.join(process.cwd(), "input-txt"), {
    withFileTypes: true,
  })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

  return Response.json({ novels });
};

export { handler as GET };
