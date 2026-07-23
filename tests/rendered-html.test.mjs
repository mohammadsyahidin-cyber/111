import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the biography interview prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>山顶传记 · 子女协助采访原型<\/title>/i);
  assert.match(html, /林秀兰的人生故事/);
  assert.match(html, /开始首次摸底/);
  assert.match(html, /查看完整采访提纲/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("contains the complete clickable interview journey", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const state of [
    "home",
    "discovery",
    "outline",
    "chapter",
    "guide",
    "recording",
    "article",
    "updated",
  ]) {
    assert.match(page, new RegExp(`"${state}"`));
  }

  assert.match(page, /生成初始提纲/);
  assert.match(page, /一级章节/);
  assert.match(page, /二级小节/);
  assert.match(page, /选择本次采访小节/);
  assert.match(page, /更新后的完整提纲/);
  assert.match(page, /顺序调整/);
  assert.match(page, /可以跳过/);
  assert.match(page, /直接生成提纲/);
  assert.match(page, /skipDiscoveryQuestion/);
  assert.match(page, /toggleDiscoveryRecording/);
  assert.match(page, /开始采访并录音/);
  assert.match(page, /保存文章并更新提纲/);
  assert.match(page, /采访提纲已更新为 v2/);
  assert.match(page, /setInterval/);
  assert.match(layout, /lang="zh-CN"/);
  assert.doesNotMatch(layout, /shanding-logo/);
  assert.match(packageJson, /"lucide-react"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
