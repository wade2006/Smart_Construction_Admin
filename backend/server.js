import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 连接 MongoDB
mongoose
  .connect("mongodb://localhost:27017/smart-construction")
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.error("MongoDB 连接失败:", err));

// 数据模型
const Overview = mongoose.model(
  "Overview",
  new mongoose.Schema({
    airQuality: { aqi: Number, co2: Number, o3: Number },
    dustData: { pm25: Number, pm10: Number, tsp: Number },
    towerCrane: { running: Number, total: Number, load: Number },
    statistics: {
      onlineWorkers: Number,
      totalWorkers: Number,
      todayAlarms: Number,
      unhandledAlarms: Number,
      deviceOnlineRate: Number,
      onlineDevices: Number,
      totalDevices: Number,
    },
    createdAt: { type: Date, default: Date.now },
  }),
);

const Alarm = mongoose.model(
  "Alarm",
  new mongoose.Schema({
    title: String,
    description: String,
    level: { type: String, enum: ["danger", "warning", "info"] },
    location: String,
    time: String,
    handled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }),
);

// 定义工人数据模型，用于存储和管理工地人员信息
const Worker = mongoose.model(
  "Worker",
  new mongoose.Schema({
    name: String, // 工人姓名
    workerId: String, // 工人工号
    position: {
      // 职位
      type: String,
      enum: ["worker", "foreman", "engineer", "manager"], // 可选值：工人、工长、工程师、经理
    },
    department: String, // 所属部门
    phone: String, // 联系电话
    status: {
      // 在线状态
      type: String,
      enum: ["online", "offline"], // 可选值：在线、离线
      default: "online", // 默认在线
    },
    joinDate: String, // 入职日期
    avatar: { type: String, default: "" }, // 头像URL，默认为空
    createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  }),
);

let chatQueue = [];

const generateOverviewData = () => ({
  airQuality: {
    aqi: Math.floor(Math.random() * 100) + 30,
    co2: Math.floor(Math.random() * 200) + 400,
    o3: Math.floor(Math.random() * 50) + 30,
  },
  dustData: {
    pm25: Math.floor(Math.random() * 50) + 10,
    pm10: Math.floor(Math.random() * 80) + 20,
    tsp: Math.floor(Math.random() * 100) + 50,
  },
  towerCrane: {
    running: Math.floor(Math.random() * 3) + 2,
    total: 5,
    load: Math.floor(Math.random() * 30) + 50,
  },
  statistics: {
    onlineWorkers: Math.floor(Math.random() * 50) + 80,
    totalWorkers: 150,
    todayAlarms: Math.floor(Math.random() * 10),
    unhandledAlarms: Math.floor(Math.random() * 5),
    deviceOnlineRate: Math.floor(Math.random() * 10) + 90,
    onlineDevices: Math.floor(Math.random() * 20) + 80,
    totalDevices: 100,
  },
});

const generateAlarms = () => {
  const alarmTypes = [
    {
      title: "空气质量超标",
      description: "PM2.5浓度超过安全阈值",
      level: "danger",
      location: "A区-1号监测点",
    },
    {
      title: "扬尘浓度预警",
      description: "扬尘浓度接近预警值",
      level: "warning",
      location: "B区-3号监测点",
    },
    {
      title: "塔机负载过高",
      description: "2号塔机负载达到75%",
      level: "warning",
      location: "2号塔机",
    },
    {
      title: "设备离线告警",
      description: "C区-5号传感器离线",
      level: "danger",
      location: "C区-5号监测点",
    },
    {
      title: "温度异常",
      description: "环境温度超过35°C",
      level: "info",
      location: "A区-2号监测点",
    },
    {
      title: "噪音超标",
      description: "施工噪音超过85分贝",
      level: "warning",
      location: "B区施工区域",
    },
    {
      title: "湿度异常",
      description: "空气湿度低于30%",
      level: "info",
      location: "A区-1号监测点",
    },
    {
      title: "风速过大",
      description: "风速达到6级",
      level: "danger",
      location: "塔吊区域",
    },
  ];
  return alarmTypes.map((alarm, index) => ({
    id: index + 1,
    ...alarm,
    time: new Date(Date.now() - Math.random() * 3600000 * 2).toLocaleString(
      "zh-CN",
    ),
    handled: Math.random() > 0.6,
  }));
};

const generateWorkers = () => {
  const names = [
    "张三",
    "李四",
    "王五",
    "赵六",
    "孙七",
    "周八",
    "吴九",
    "郑十",
    "冯一",
    "陈二",
  ];
  const positions = ["worker", "foreman", "engineer", "manager"];
  const departments = ["土建部", "机电部", "安全部", "质量部"];
  return names.map((name, index) => ({
    id: index + 1,
    name,
    workerId: `GD${String(index + 1).padStart(4, "0")}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    phone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 1000000000)).padStart(9, "0")}`,
    status: Math.random() > 0.3 ? "online" : "offline",
    joinDate: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("zh-CN"),
    avatar: "",
  }));
};

const aiResponses = [
  "好的，我来帮您分析一下当前的工地数据。根据监测数据显示，当前空气质量指数为AQI {{aqi}}，属于{{level}}水平。建议{{suggestion}}。",
  "收到，我来为您查询相关信息。目前工地共有{{onlineWorkers}}名工人在线，设备在线率达到{{deviceOnlineRate}}%。",
  "您的问题已收到，正在分析中...根据数据分析，当前扬尘浓度为PM2.5: {{pm25}} μg/m³，PM10: {{pm10}} μg/m³，整体处于正常水平。",
  "我来为您提供一些建议。为了确保工地安全，建议定期检查设备运行状态，关注空气质量变化，并做好工人安全培训。",
  "好的，让我为您解答。智慧工地管理平台集成了环境监测、设备监控、人员管理等多个模块，帮助提升工地管理效率。",
  "根据您的问题，我为您整理了以下信息：\n\n**当前状态概览：**\n- 空气质量：{{aqi}} (AQI)\n- 在线工人：{{onlineWorkers}} 人\n- 运行塔机：{{runningCrane}} 台\n- 今日告警：{{todayAlarms}} 条",
  "您问的是关于工地安全的问题。根据相关规定，进入施工现场必须佩戴安全帽，遵守安全操作规程，注意高空坠物风险。",
  "我理解您的需求。为了更好地帮助您，请提供更多具体信息，例如：\n- 您关注的具体指标\n- 时间范围\n- 特定设备或区域",
];

app.get("/api/overview", async (req, res) => {
  try {
    const latest = await Overview.findOne().sort({ createdAt: -1 });
    if (latest) {
      res.json({ code: 200, message: "success", data: latest.toObject() });
    } else {
      const data = generateOverviewData();
      await Overview.create(data);
      res.json({ code: 200, message: "success", data });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({ code: 200, message: "success", data: generateOverviewData() });
  }
});

app.get("/api/overview/chart", (req, res) => {
  const hours = [];
  const airQualityHistory = [];
  const dustHistory = [];
  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(`${hour.getHours().toString().padStart(2, "0")}:00`);
    airQualityHistory.push({
      time: hours[hours.length - 1],
      value: Math.floor(Math.random() * 80) + 40,
    });
    dustHistory.push({
      time: hours[hours.length - 1],
      pm25: Math.floor(Math.random() * 40) + 10,
      pm10: Math.floor(Math.random() * 60) + 20,
    });
  }
  const towerCraneStatus = [
    {
      name: "塔机1号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机2号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机3号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机4号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机5号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
  ];
  res.json({
    code: 200,
    message: "success",
    data: { airQualityHistory, dustHistory, towerCraneStatus },
  });
});

app.get("/api/alarms", async (req, res) => {
  try {
    const alarms = await Alarm.find().sort({ createdAt: -1 });
    if (alarms.length > 0) {
      res.json({
        code: 200,
        message: "success",
        data: alarms.map((a) => a.toObject()),
      });
    } else {
      const data = generateAlarms();
      await Alarm.insertMany(data);
      res.json({ code: 200, message: "success", data });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({ code: 200, message: "success", data: generateAlarms() });
  }
});

app.put("/api/alarms/:id/handle", async (req, res) => {
  try {
    await Alarm.findByIdAndUpdate(req.params.id, { handled: true });
    res.json({ code: 200, message: "success", data: { id: req.params.id } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ code: 500, message: "error" });
  }
});

app.get("/api/workers", async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    console.log(workers, "workers-------");
    if (workers.length > 0) {
      res.json({
        code: 200,
        message: "success",
        data: { total: workers.length, list: workers.map((w) => w.toObject()) },
      });
    } else {
      const data = generateWorkers();
      await Worker.insertMany(data);
      res.json({
        code: 200,
        message: "success",
        data: { total: data.length, list: data },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    const data = generateWorkers();
    res.json({
      code: 200,
      message: "success",
      data: { total: data.length, list: data },
    });
  }
});

app.post("/api/workers", async (req, res) => {
  try {
    const worker = await Worker.create({
      ...req.body,
      status: "online",
      joinDate: new Date().toLocaleDateString("zh-CN"),
      avatar: "",
    });
    res.json({ code: 200, message: "success", data: worker.toObject() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ code: 500, message: "error" });
  }
});

app.put("/api/workers/:id", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ code: 200, message: "success", data: worker.toObject() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ code: 500, message: "error" });
  }
});

app.delete("/api/workers/:id", async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ code: 200, message: "success", data: { id: req.params.id } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ code: 500, message: "error" });
  }
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const overview = generateOverviewData();
  let response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  response = response
    .replace("{{aqi}}", overview.airQuality.aqi)
    .replace(
      "{{level}}",
      overview.airQuality.aqi <= 50
        ? "优"
        : overview.airQuality.aqi <= 100
          ? "良"
          : "轻度污染",
    )
    .replace(
      "{{suggestion}}",
      overview.airQuality.aqi > 100 ? "减少户外活动，佩戴口罩" : "空气质量良好",
    )
    .replace("{{pm25}}", overview.dustData.pm25)
    .replace("{{pm10}}", overview.dustData.pm10)
    .replace("{{onlineWorkers}}", overview.statistics.onlineWorkers)
    .replace("{{deviceOnlineRate}}", overview.statistics.deviceOnlineRate)
    .replace("{{runningCrane}}", overview.towerCrane.running)
    .replace("{{todayAlarms}}", overview.statistics.todayAlarms);
  chatQueue.push(response);
  res.json({ code: 200, message: "success" });
});

app.get("/stream/chat", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const interval = setInterval(() => {
    if (chatQueue.length > 0) {
      const response = chatQueue.shift();
      let index = 0;
      const sendChunk = () => {
        if (index < response.length) {
          const chunkSize = Math.min(
            Math.floor(Math.random() * 5) + 1,
            response.length - index,
          );
          const chunk = response.substring(index, index + chunkSize);
          res.write(`data: ${chunk}\n\n`);
          index += chunkSize;
          setTimeout(sendChunk, Math.floor(Math.random() * 100) + 80);
        } else {
          res.write("data: [END]\n\n");
        }
      };
      sendChunk();
    }
  }, 100);
  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
