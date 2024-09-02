import { Hono } from "hono";
import index from "./index.txt";

import { tracking } from "./sites/tracking";

const app = new Hono()
  .get("/", (c) => {
    return c.text(index);
  })
  .route("/", tracking);

export default app;
