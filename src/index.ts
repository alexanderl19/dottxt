import { Hono } from "hono";
import index from "./index.txt?raw";

import { usps } from "./sites/usps";

const app = new Hono()
  .get("/", (c) => {
    return c.text(index);
  })
  .route("/", usps);

export default app;
