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
  assert.match(html, /这次，想记录谁的人生/);
  assert.match(html, /被记录人姓名/);
  assert.match(html, /创建传记/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("contains the complete clickable interview journey", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const state of [
    "create",
    "home",
    "discovery",
    "outline",
    "chapter",
    "records",
    "conversation",
    "articles",
    "guide",
    "recording",
    "article",
    "updated",
  ]) {
    assert.match(page, new RegExp(`"${state}"`));
  }

  assert.match(page, /生成初始提纲/);
  assert.match(page, /完整采访提纲/);
  assert.match(page, /新建传记/);
  assert.match(page, /传记进度/);
  assert.match(page, /每一次谈话都保留在这里/);
  assert.match(page, /查看提问与回答聊天记录/);
  assert.match(page, /传记文章/);
  assert.match(page, /家乡或长期生活地/);
  assert.match(page, /选择章节，开始深度采访/);
  assert.match(page, /第二步/);
  assert.match(page, /第三步/);
  assert.match(page, /phase-track/);
  assert.match(page, /leftControl/);
  assert.doesNotMatch(page, /小青建议/);
  assert.doesNotMatch(page, /摸底/);
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
