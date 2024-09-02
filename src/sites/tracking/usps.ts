import type { Tracker } from "@easypost/api";

import { Hono } from "hono";
import { env } from "hono/adapter";
import { formatTracker } from "./_utils";

const usps = new Hono().on(
  "GET",
  ["/usps/tracking/:code", "/usps/tracking/:code/full"],
  async (c) => {
    const { EASYPOST_API_KEY } = env<{ EASYPOST_API_KEY: string }>(c);

    const trackerResponse = await fetch(
      "https://api.easypost.com/v2/trackers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(EASYPOST_API_KEY + ":"),
        },
        body: JSON.stringify({
          tracking_code: c.req.param("code"),
          carrier: "USPS",
        }),
      }
    );

    if (trackerResponse.status === 200) {
      const tracker = (await trackerResponse.json()) as Tracker;

      return c.text(formatTracker(tracker, c.req.path.endsWith("/full")));
    } else {
      return c.text("Failed to fetch shipment information.", 500);
    }
  }
);

export { usps };
