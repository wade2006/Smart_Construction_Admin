const mongoose = require('mongoose')

const overviewSchema = new mongoose.Schema({
  airQuality: {
    aqi: Number,
    co2: Number,
    o3: Number
  },
  dustData: {
    pm25: Number,
    pm10: Number,
    tsp: Number
  },
  towerCrane: {
    running: Number,
    total: Number,
    load: Number
  },
  statistics: {
    onlineWorkers: Number,
    totalWorkers: Number,
    todayAlarms: Number,
    unhandledAlarms: Number,
    deviceOnlineRate: Number,
    onlineDevices: Number,
    totalDevices: Number
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Overview', overviewSchema)
