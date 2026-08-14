import * as startPkg from "@tanstack/react-start";
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Defining src/start.ts opts out of Start's automatic CSRF middleware, so we
// re-add it. Older @tanstack/start-client-core builds don't export the factory,
// so resolve it defensively — a missing export must not crash the SSR bundle.
type CsrfFactory = (options: {
  filter: (ctx: { handlerType: string }) => boolean;
}) => ReturnType<typeof createMiddleware>;

const createCsrf = (startPkg as unknown as { createCsrfMiddleware?: CsrfFactory })
  .createCsrfMiddleware;

const csrfMiddleware =
  typeof createCsrf === "function"
    ? createCsrf({ filter: (ctx) => ctx.handlerType === "serverFn" })
    : undefined;

export const startInstance = createStart(() => ({
  requestMiddleware: csrfMiddleware ? [errorMiddleware, csrfMiddleware] : [errorMiddleware],
}));
