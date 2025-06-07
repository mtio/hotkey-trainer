/**
 * Given an image filename (e.g. "icon.png"), resolve it from the /src/assets folder
 */
export function resolveImage(imageFilename: string): string {
  return new URL(`../assets/${imageFilename}`, import.meta.url).href;
}
