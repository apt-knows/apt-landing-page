import type { AdminState } from "./admin.server";

export const allowedCapabilities = new Set(["memory", "session_search", "skills", "apt_bridge"]);

export function validateDraft(state: AdminState, releaseId: string) {
  const release = state.releases.find((item) => item.id === releaseId);
  if (!release || release.status !== "draft")
    return { valid: false, issues: ["Select a draft release."] };
  const documents = state.documents.filter((item) => item.release_id === releaseId && item.enabled);
  const capabilities = state.capabilities.filter(
    (item) => item.release_id === releaseId && item.enabled,
  );
  const issues: string[] = [];
  for (const kind of ["core", "soul_template", "policy"] as const) {
    if (!documents.some((document) => document.kind === kind))
      issues.push(`Missing enabled ${kind} document.`);
  }
  for (const key of ["intent.retail", "intent.grocery", "intent.food"]) {
    if (!documents.some((document) => document.key === key && document.kind === "intent"))
      issues.push(`Missing ${key}.`);
  }
  for (const document of documents.filter((item) => item.kind === "skill")) {
    const normalized = document.content.replaceAll("\r", "");
    const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
    const name = frontmatter?.match(/^name:\s*["']?([^\n"']+)["']?\s*$/m)?.[1]?.trim();
    const description = frontmatter?.match(/^description:\s*(.+)\s*$/m)?.[1]?.trim();
    if (name !== document.key || !description || description.length > 500)
      issues.push(`Skill ${document.key} needs matching name and description frontmatter.`);
  }
  for (const key of allowedCapabilities)
    if (!capabilities.some((capability) => capability.key === key))
      issues.push(`Missing enabled ${key} capability.`);
  for (const capability of capabilities)
    if (!allowedCapabilities.has(capability.key))
      issues.push(`Forbidden capability ${capability.key}.`);
  return { valid: issues.length === 0, issues };
}

export function releaseDiff(state: AdminState, releaseId: string) {
  const release = state.releases.find((item) => item.id === releaseId);
  if (!release) return [];
  const baseDocuments = new Map(
    state.documents
      .filter((item) => item.release_id === release.base_release_id)
      .map((item) => [item.key, item.checksum]),
  );
  const baseCapabilities = new Map(
    state.capabilities
      .filter((item) => item.release_id === release.base_release_id)
      .map((item) => [item.key, item.checksum]),
  );
  const current = [
    ...state.documents
      .filter((item) => item.release_id === releaseId)
      .map((item) => ({
        key: `document:${item.key}`,
        checksum: item.checksum,
        previous: baseDocuments.get(item.key),
      })),
    ...state.capabilities
      .filter((item) => item.release_id === releaseId)
      .map((item) => ({
        key: `capability:${item.key}`,
        checksum: item.checksum,
        previous: baseCapabilities.get(item.key),
      })),
  ];
  return current
    .filter((item) => item.checksum !== item.previous)
    .sort((left, right) => left.key.localeCompare(right.key));
}

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
