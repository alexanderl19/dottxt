import { Hono } from "hono";
import index from "./index.txt";

import { track } from "./sites/track";

const app = new Hono()
  .get("/", (c) => {
    return c.text(index);
  })
  .route("/", track);

export default app;
