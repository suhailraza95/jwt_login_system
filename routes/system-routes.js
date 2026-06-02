const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
const { performance } = require("perf_hooks");
 
const router = express.Router();
 
/**
* GET /system/health
* API health + DB status
*/
router.get("/system/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
 
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
 
  const isHealthy = dbState === 1;
 
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "success" : "failure",
    data: {
      service: "JWT SYSTEM API",
      database: states[dbState],
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().rss,
      timestamp: new Date().toISOString()
    }
  });
});
 
 
/**
* GET /system/info
* System information endpoint
*/
router.get("/system/info", (req, res) => {
  const dbState = mongoose.connection.readyState;
 
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
 
  const isHealthy = dbState === 1;
 
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "success" : "failure",
    data: {
      service: "JWT SYSTEM API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      database: states[dbState],
      memoryUsage: process.memoryUsage().rss,
      timestamp: new Date().toISOString()
    }
  });
});
 
 
/**
* GET /system/metrics
* Runtime metrics
*/
router.get("/system/metrics", async (req, res) => {
  const dbState = mongoose.connection.readyState;
 
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
 
  // Memory
  const memory = process.memoryUsage();
 
  // CPU
  const cpuLoad = os.loadavg();
 
  // Mongo ping
  let mongoPing = null;
  try {
    const start = performance.now();
    await mongoose.connection.db.admin().ping();
    const end = performance.now();
    mongoPing = (end - start).toFixed(2);
  } catch {
    mongoPing = null;
  }
 
  res.json({
    status: "success",
    data: {
      service: "JWT SYSTEM API",
      environment: process.env.NODE_ENV || "development",
 
      uptimeSeconds: process.uptime(),
 
      database: states[dbState],
 
      mongoPingMs: mongoPing,
 
      memory: {
        rss: memory.rss,
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal
      },
 
      cpuLoad,
 
      system: {
        platform: os.platform(),
        cpuCount: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem()
      },
 
      timestamp: new Date().toISOString()
    }
  });
});
 
module.exports = router;