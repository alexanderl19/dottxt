import { Hono } from "hono";
import { env } from "hono/adapter";
import { formatTracker, getEasypostTracker } from "./utils";

const track = new Hono().on(
  "GET",
  ["/track/:carrier/:code", "/track/:carrier/:code/full"],
  async (c) => {
    if (!["usps", "ups"].includes(c.req.param("carrier").toLowerCase())) {
      return c.text("Carrier is not currently supported.", 400);
    }

    const { EASYPOST_API_KEY } = env<{ EASYPOST_API_KEY: string }>(c);

    const tracker = await getEasypostTracker(
      EASYPOST_API_KEY,
      c.req.param("code"),
      c.req.param("carrier").toUpperCase()
    );

    if (tracker) {
      return c.text(formatTracker(tracker, c.req.path.endsWith("/full")));
    } else {
      return c.text("Failed to fetch shipment information.", 500);
    }
  }
);

export { track };
