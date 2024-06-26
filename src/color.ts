type ColorKeys = "divider" | "red" | "blue" | "green" | "light";

type ColorMap = Record<ColorKeys, string>;

export const darkColorMap: ColorMap = {
  divider: "#333",
  red: "#b73430",
  green: "#5aa34a",
  blue: "#3571df",
  light: "#c2c2c2",
};

export const lightColorMap: ColorMap = {
  divider: "#ddd",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  light: "#d3cbca",
};

async function isDarkTheme() {
  const theme = await eagle.app.theme;
  return !theme.toLocaleLowerCase().includes("light");
}

export async function getColorMap() {
  const isDark = await isDarkTheme();
  return isDark ? darkColorMap : lightColorMap;
}
