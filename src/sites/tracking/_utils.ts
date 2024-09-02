import type { Tracker } from "@easypost/api";
import { titleCase } from "title-case";
import { sentenceCase } from "change-case";
import { format } from "date-fns";

const formatDate = (date: Parameters<typeof format>["0"]) =>
  format(date, "MMM do yyyy (MM/dd/yyyy) hh:mm:ss b (HH:mm:ss)");

export const formatTracker = (tracker: Tracker, full: boolean = false) => {
  const lines: (undefined | string | (string | undefined)[])[] = [];

  if (tracker.carrier_detail) {
    lines.push([
      tracker.tracking_code,
      `${tracker.carrier} ${tracker.carrier_detail.service}`,
      `${tracker.carrier_detail.origin_location} → ${tracker.carrier_detail.destination_location}`,
    ]);
  } else {
    lines.push(tracker.tracking_code);
  }

  lines.push("\n");

  lines.push(`Status: ${titleCase(sentenceCase(tracker.status_detail))}`);
  lines.push(
    `Estimated Delivery Date: ${
      tracker.est_delivery_date
        ? formatDate(tracker.est_delivery_date)
        : "Unknown"
    }`
  );

  lines.push("\n");

  lines.push(`Details (${tracker.tracking_details.length}):`);

  for (
    let i = tracker.tracking_details.length - 1;
    i >= (full ? 0 : Math.max(tracker.tracking_details.length - 5, 0));
    i--
  ) {
    const trackingDetail = tracker.tracking_details[i];
    lines.push([formatDate(trackingDetail.datetime), trackingDetail.message]);
    if (trackingDetail.tracking_location) {
      lines.push(
        [
          trackingDetail.tracking_location.city,
          trackingDetail.tracking_location.state,
          trackingDetail.tracking_location.zip,
          trackingDetail.tracking_location.country,
        ]
          .filter((item) => !!item)
          .join(", ")
      );
    }
    lines.push("");
  }
  if (!full && tracker.tracking_details.length > 5) {
    lines.push(
      'For a complete list of updates, append "/full" to the end of the url.'
    );
  } else {
    lines.push("No prior updates.");
  }

  return lines
    .flatMap((line) => line)
    .filter((line) => line !== undefined)
    .join("\n");
};
