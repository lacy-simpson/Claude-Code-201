const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const clientDir = path.join(dist, "client");
const serverDir = path.join(dist, "server");

const htmlPath = path.join(root, "cc-index.html");
const hostingPath = path.join(root, ".openai", "hosting.json");
const publicDir = path.join(root, "public");

if (!fs.existsSync(htmlPath)) {
  throw new Error("Expected cc-index.html at the project root.");
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(clientDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(path.join(dist, ".openai"), { recursive: true });

const html = fs.readFileSync(htmlPath, "utf8");
fs.writeFileSync(path.join(clientDir, "index.html"), html);
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, clientDir, { recursive: true });
}
fs.copyFileSync(hostingPath, path.join(dist, ".openai", "hosting.json"));

const worker = `const INDEX_HTML = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(INDEX_HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300"
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), worker);
