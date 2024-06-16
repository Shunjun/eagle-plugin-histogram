import url from "node:url";

export function fileURLToPath(fileUrl: string) {
  if (fileUrl.startsWith("file://")) {
    return url.fileURLToPath(fileUrl);
  }
  return fileUrl;
}

export function sortArrayAsTarget<T>(array: T[], target: T[]) {
  return array.sort((a, b) => {
    return target.indexOf(a) - target.indexOf(b);
  });
}
