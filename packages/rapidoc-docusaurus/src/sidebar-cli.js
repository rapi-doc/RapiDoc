// Runs rapidocSidebar in a process of its own for rapidocSidebarSync: reads its options as JSON from stdin
// and writes the sidebar items as JSON to stdout.
import { rapidocSidebar } from "./index.js";

let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;
process.stdout.write(JSON.stringify(await rapidocSidebar(JSON.parse(input))));
