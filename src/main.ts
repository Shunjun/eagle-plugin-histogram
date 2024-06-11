// Listen to plugin creation
eagle.onPluginCreate(async () => {
  // Get the current theme
  handleTheme();

  // Get the selected item
  const item = await eagle.item.getSelected();

  console.log(item);
});

// Listen to theme changes
eagle.onThemeChanged(handleTheme);

async function handleTheme(theme?: string) {
  if (!theme) {
    theme = (await eagle.app.theme) || "light";
  }
  document.body.setAttribute("theme", theme);
}
