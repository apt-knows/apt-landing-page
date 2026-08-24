import { describe, expect, it } from "vitest";
import { ADMIN_PRIVATE_HEADERS, adminRedirect } from "./admin-http";

describe("founder admin HTTP policy", () => {
  it("applies private cache and indexing headers to redirects", () => {
    const response = adminRedirect("/admin/login");
    expect(response.status).toBe(307);
    expect(response.headers.get("Cache-Control")).toBe(ADMIN_PRIVATE_HEADERS["Cache-Control"]);
    expect(response.headers.get("Pragma")).toBe(ADMIN_PRIVATE_HEADERS.Pragma);
    expect(response.headers.get("X-Robots-Tag")).toBe(ADMIN_PRIVATE_HEADERS["X-Robots-Tag"]);
  });
});
