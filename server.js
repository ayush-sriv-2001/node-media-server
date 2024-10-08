const NodeMediaServer = require("node-media-server");

const httpConfig = {
  port: 8000,
  allow_origin: "*",
  mediaroot: "./media",
};

const rtmpConfig = {
  port: 1935,
  chunk_size: 60000,
  gop_cache: true,
  ping: 10,
  ping_timeout: 60,
};

const transformationConfig = {
  ffmpeg: "./ffmpeg-master-latest-win64-gpl-shared/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe",
  tasks: [
    {
      app: "live",
      hls: true,
      hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
      hlsKeep: false,
    },
  ],
  MediaRoot: "./media",
};

const config = {
  http: httpConfig,
  rtmp: rtmpConfig,
  trans: transformationConfig,
};

const nms = new NodeMediaServer(config);


// Log the RTMP and HLS URLs when a stream is published
nms.on('prePublish', (id, streamPath) => {
  const streamName = streamPath.split('/').pop(); // Get the stream name from the path
  const rtmpUrl = `rtmp://192.168.1.18:1935${streamPath}`; // Construct the RTMP URL
  const hlsUrl = `http://192.168.1.18:8000/live/${streamName}.m3u8`; // Construct the HLS URL
  
  console.log(`Stream published:`);
  console.log(`RTMP URL: ${rtmpUrl}`);
  console.log(`HLS URL: ${hlsUrl}`);
});

nms.run();