import { joinLines, type Lines } from "../../utils";
import { Hono } from "hono";
import { query, search } from "./utils";

const wiki = new Hono()
  .get("/wiki/search/:query", async (c) => {
    const searchResults = await search(c.req.param("query"));
    if (!searchResults.success) {
      if (searchResults.error === 429) {
        return c.text(
          "Failed to search. Likely being rate limited by Wikipedia. Try again later.",
          500
        );
      }
      return c.text("Failed to search.", 500);
    }

    const lines: Lines = [];
    lines.push(searchResults.results[0]);
    lines.push(`Wikipedia (${searchResults.results[1].length} Result(s))`);
    lines.push("\n");
    searchResults.results[1].forEach((title) =>
      lines.push([title, new URL(`/wiki/${title}`, c.req.url).toString(), ""])
    );

    return c.text(joinLines(lines));
  })
  .get("/wiki/:query", async (c) => {
    const queryResult = await query(c.req.param("query"));
    if (!queryResult.success) {
      if (queryResult.error === 429) {
        return c.text(
          "Failed to load document information. Likely being rate limited by Wikipedia. Try again later.",
          500
        );
      }
      return c.text("Failed to load document information.", 500);
    }

    if (queryResult.result.query.pages["-1"]) {
      // Search and display first page if no match.

      const searchResults = await search(c.req.param("query"));
      if (!searchResults.success) {
        if (searchResults.error === 429) {
          return c.text(
            `Did not find page matching "${c.req.param(
              "query"
            )}" and failed to search. Likely being rate limited by Wikipedia. Try again later.`,
            500
          );
        }
        return c.text(
          `Did not find page matching "${c.req.param(
            "query"
          )}" and failed to search.`,
          500
        );
      }

      if (searchResults.results[1].length === 0) {
        return c.text(
          `Did not find page matching "${c.req.param(
            "query"
          )}" or any search results.`,
          404
        );
      }

      const queryResult = await query(searchResults.results[1][0]);
      if (!queryResult.success) {
        if (queryResult.error === 429) {
          return c.text(
            `Did not find page matching "${c.req.param(
              "query"
            )}" and failed to load first search result. Likely being rate limited by Wikipedia. Try again later.`,
            500
          );
        }
        return c.text(
          `Did not find page matching "${c.req.param(
            "query"
          )}" and failed to load first search result.`,
          500
        );
      }

      if (queryResult.result.query.pages["-1"]) {
        return c.text(
          `Did not find page matching "${c.req.param(
            "query"
          )}" and failed to load first search result.`,
          500
        );
      }

      const page = Object.values(queryResult.result.query.pages)[0];
      const lines: Lines = [];
      lines.push(
        `Did not find a Wikipedia page matching "${c.req.param("query")}".`
      );
      lines.push("Showing first search result:");
      lines.push(`${page.title} (Wikipedia Page ID: ${page.pageid})`);
      lines.push("");
      lines.push(page.extract);

      return c.text(joinLines(lines));
    } else {
      const page = Object.values(queryResult.result.query.pages)[0];
      const lines: Lines = [];

      const normalizedQuery =
        queryResult.result.query.normalized?.[0].to || c.req.param("query");
      if (normalizedQuery !== page.title) {
        lines.push(`Redirected from ${normalizedQuery}.`);
      }

      lines.push(`${page.title} (Wikipedia Page ID: ${page.pageid})`);
      lines.push("");
      lines.push(page.extract);

      return c.text(joinLines(lines));
    }
  });

export { wiki };
