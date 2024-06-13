type ColorKeys = "divider" | "red" | "blue" | "green" | "gray";

type ColorMap = Record<ColorKeys, string>;

export const darkColorMap: ColorMap = {
  divider: "#333",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  gray: "#4b4b4b",
};

export const lightColorMap: ColorMap = {
  divider: "#ddd",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  gray: "#d3cbca",
};

async function isDarkTheme() {
  const theme = await eagle.app.theme;
  return !theme.toLocaleLowerCase().includes("light");
}

export async function getColorMap() {
  const isDark = await isDarkTheme();
  return isDark ? darkColorMap : lightColorMap;
}
