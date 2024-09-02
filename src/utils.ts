export const domainPattern = (domain: string) =>
  new RegExp(`^https?:\/([^?]+).*$`);

export const snakeToTitleCase = (string: string) => {
  string
    .replace(/^_*(.)/, (_, char) => char.toUpperCase())
    .replace(/[-_]+(.)/g, (_, char) => " " + char.toUpperCase());
};
