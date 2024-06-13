import Jimp from "jimp";

export type ChannelInfo = {
  red: number[];
  green: number[];
  blue: number[];
  alpha: number[];
  gray: number[];
};

export function calcChannels(filePath: string) {
  return new Promise<ChannelInfo>((resolve, reject) => {
    Jimp.read(filePath, (err, lenna) => {
      if (err) {
        reject(err);
        return;
      }
      const { width, height } = lenna.bitmap;
      const channelInfo: ChannelInfo = {
        red: new Array(256).fill(0),
        green: new Array(256).fill(0),
        blue: new Array(256).fill(0),
        alpha: new Array(256).fill(0),
        gray: new Array(256).fill(0),
      };

      lenna.scan(0, 0, width, height, function (_, __, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const alpha = this.bitmap.data[idx + 3];

        channelInfo.red[red]++;
        channelInfo.green[green]++;
        channelInfo.blue[blue]++;
        channelInfo.alpha[alpha]++;
        const gray = Math.round(red * 0.299 + green * 0.587 + blue * 0.114);
        channelInfo.gray[gray]++;
      });

      resolve(channelInfo);
    });
  });
}
