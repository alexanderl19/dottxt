export const search = async (query: string) => {
  const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
  searchUrl.searchParams.append("action", "opensearch");
  searchUrl.searchParams.append("format", "json");
  searchUrl.searchParams.append("formatversion", "2");
  searchUrl.searchParams.append("search", query);
  const searchRequest = await fetch(searchUrl);

  if (!searchRequest.ok)
    return {
      success: false as const,
      error: searchRequest.status,
    };

  return {
    success: true as const,
    results: (await searchRequest.json()) as [
      string,
      string[],
      string[],
      string[]
    ],
  };
};

export const query = async (title: string) => {
  const queryUrl = new URL("https://en.wikipedia.org/w/api.php");
  queryUrl.searchParams.append("action", "query");
  queryUrl.searchParams.append("format", "json");
  queryUrl.searchParams.append("prop", "extracts");
  queryUrl.searchParams.append("explaintext", "");
  queryUrl.searchParams.append("redirects", "");
  queryUrl.searchParams.append("titles", title);
  const queryRequest = await fetch(queryUrl);

  if (!queryRequest.ok)
    return {
      success: false as const,
      error: queryRequest.status,
    };

  return {
    success: true as const,
    result: (await queryRequest.json()) as {
      batchcomplete: string;
      query: {
        normalized?: {
          from: string;
          to: string;
        }[];
        pages:
          | {
              "-1": {
                ns: number;
                title: string;
                missing: "";
              };
            }
          | ({
              [key: string]: {
                pageid: number;
                ns: number;
                title: string;
                extract: string;
              };
            } & {
              "-1"?: never;
            });
      };
    },
  };
};
