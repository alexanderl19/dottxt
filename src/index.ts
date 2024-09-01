import { Hono } from "hono";
const app = new Hono();

import index from "./index.txt?raw";

app.get("/", (c) => {
  return c.text(index);
});

export default app;
