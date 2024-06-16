import { calcChannels, ChannelInfo } from "./calcChannels";

import * as echarts from "echarts";

import "./index.css";
import { getColorMap, lightColorMap } from "./color";
import { fileURLToPath, sortArrayAsTarget } from "./utils";

const chartDom = document.getElementById("chart");
const myChart = echarts.init(chartDom);
let channelInfo: ChannelInfo | null = null;
let colorMap = lightColorMap;
const seriesKeySeq: (keyof ChannelInfo)[] = ["red", "green", "blue", "light"];
let seriesKeys: (keyof ChannelInfo)[] = ["red", "green", "blue", "light"];
let tempSeriesKeys: (keyof ChannelInfo)[] | null = null;
let isOver = false;

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
  myChart.setOption(genOption(channelInfo), true);
}

function genOption(channelInfo: ChannelInfo) {
  console.log(seriesKeys);

  return {
    grid: {
      left: "4", // 左边距
      right: "4", // 右边距
      top: "4", // 上边距
      bottom: "4", // 下边距
    },
    color: [colorMap.red, colorMap.green, colorMap.blue, colorMap.light],
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
        itemStyle: {
          color: colorMap[name as keyof typeof colorMap],
          opacity: 0.7,
        },
        z: index,
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

["red", "green", "blue", "light"].map((key) => {
  const inputNode = document.querySelector("#" + key);
  if (inputNode) {
    inputNode.setAttribute("checked", "true");

    inputNode.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      let currentSeriesKeys = [...(tempSeriesKeys || seriesKeys)];
      if (target.checked) {
        if (!currentSeriesKeys.includes(key as keyof ChannelInfo)) {
          currentSeriesKeys.push(key as keyof ChannelInfo);
        }
      } else {
        currentSeriesKeys = currentSeriesKeys.filter((k) => k !== key);
      }
      currentSeriesKeys = sortArrayAsTarget(currentSeriesKeys, seriesKeySeq);
      if (tempSeriesKeys) {
        tempSeriesKeys = currentSeriesKeys;
      } else {
        seriesKeys = currentSeriesKeys;
      }
      if (channelInfo) {
        generateHistogram(channelInfo);
      }
    });

    inputNode.addEventListener("mouseover", () => {
      isOver = true;
      if (tempSeriesKeys === null) {
        tempSeriesKeys = seriesKeys;
      }
      seriesKeys = [key as keyof ChannelInfo];
      if (channelInfo) {
        generateHistogram(channelInfo);
      }
    });

    inputNode.addEventListener("mouseout", () => {
      isOver = false;
      setTimeout(() => {
        if (isOver) return;
        if (tempSeriesKeys) {
          seriesKeys = tempSeriesKeys;
          tempSeriesKeys = null;
        }
        if (channelInfo) {
          generateHistogram(channelInfo);
        }
      }, 300);
    });
  }
});
