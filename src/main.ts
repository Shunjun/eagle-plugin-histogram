import url from "node:url";
import { calcChannels, ChannelInfo } from "./calcChannels";

import * as echarts from "echarts";

import "./index.css";
import { getColorMap, lightColorMap } from "./color";

const chartDom = document.getElementById("chart");
const myChart = echarts.init(chartDom);
let channelInfo: ChannelInfo | null = null;
let colorMap = lightColorMap;

const seriesKeys: (keyof ChannelInfo)[] = ["red", "green", "blue", "gray"];

// Listen to plugin creation
eagle.onPluginCreate(async () => {
  // Get the current theme
  handleTheme();

  // Get the selected item
  const items = await eagle.item.getSelected();
  if (!Array.isArray(items) || items.length > 1) {
    return;
  }

  const fileNode = items[0];
  const filePath = fileURLToPath(fileNode.fileURL);

  channelInfo = await calcChannels(filePath);
  generateHistogram(channelInfo);
});

function generateHistogram(channelInfo: ChannelInfo) {
  myChart.setOption(genOption(channelInfo));
}

function genOption(channelInfo: ChannelInfo) {
  return {
    grid: {
      left: "4", // 左边距
      right: "4", // 右边距
      top: "4", // 上边距
      bottom: "4", // 下边距
    },
    color: [colorMap.red, colorMap.green, colorMap.blue, colorMap.gray],
    xAxis: {
      show: false,
      data: channelInfo.red.map((_, i) => i),
    },
    yAxis: {
      alignTicks: true,
      splitLine: {
        lineStyle: {
          color: "#999",
          opacity: 0.2,
        },
      },
      axisLabel: {
        show: false,
      },
    },
    // tooltip: {},
    series: seriesKeys.map((name, index) => {
      return {
        name,
        type: "bar",
        sampling: "lttb",
        barWidth: 2,
        barGap: "-100%",
        data: channelInfo[name],
        emphasis: {
          focus: "series",
        },
        animationDelay: index * 50,
      };
    }),
    animationEasing: "elasticOut" as const,
    animationDelayUpdate: function (idx: number) {
      return idx * 5;
    },
  };
}

// Listen to theme changes
eagle.onThemeChanged(handleTheme);

async function handleTheme(theme?: string) {
  if (!theme) {
    theme = (await eagle.app.theme) || "light";
  }
  colorMap = await getColorMap();
  if (channelInfo) {
    generateHistogram(channelInfo);
  }
  document.body.setAttribute("theme", theme);
}

function fileURLToPath(fileUrl: string) {
  if (fileUrl.startsWith("file://")) {
    return url.fileURLToPath(fileUrl);
  }
  return fileUrl;
}
