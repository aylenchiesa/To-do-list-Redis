import Redis from "ioredis";
import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const redis = new Redis({
  host: "redis",
  port: 6379,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await redis.lrange("tasks", 0, -1);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Add task
app.post("/api/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }
    const id = Date.now().toString();
    const taskObj = JSON.stringify({ id, task, completed: false });
    await redis.lpush("tasks", taskObj);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await redis.lrange("tasks", 0, -1);
    const filtered = tasks.filter((t) => {
      const obj = JSON.parse(t);
      return obj.id !== id;
    });

    await redis.del("tasks");
    if (filtered.length > 0) {
      await redis.rpush("tasks", ...filtered);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Toggle task completion
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await redis.lrange("tasks", 0, -1);
    const updated = tasks.map((t) => {
      const obj = JSON.parse(t);
      if (obj.id === id) {
        obj.completed = !obj.completed;
      }
      return JSON.stringify(obj);
    });

    await redis.del("tasks");
    if (updated.length > 0) {
      await redis.rpush("tasks", ...updated);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
