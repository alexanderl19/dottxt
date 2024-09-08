import { Hono } from "hono";
import index from "./index.txt";

import { track } from "./sites/track";
import { wiki } from "./sites/wiki";

const app = new Hono()
  .get("/", (c) => {
    return c.text(index);
  })
  .route("/", track)
  .route("/", wiki);

export default app;
