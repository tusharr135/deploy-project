const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn("SUPABASE_URL or SUPABASE_KEY is missing.");
}

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        realtime: {
          transport: WebSocket
        }
      }
    );

app.get("/", (req, res) => {
  res.json({
    message: "GatePass API is running",
    endpoints: ["/api/health", "/api/gatepasses"]
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/gatepasses", async (req, res) => {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/api/gatepasses", async (req, res) => {
  console.log("Received data:", req.body);

  const {
    visitor_name,
    mobile,
    purpose,
    person_to_meet
  } = req.body;

  if (!visitor_name || !mobile || !purpose || !person_to_meet) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  const { data, error } = await supabase
    .from("visitors")
    .insert([{
      visitor_name,
      mobile,
      purpose,
      person_to_meet,
      status: "Pending"
    }])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);

    return res.status(500).json({
      error: error.message,
      details: error.details,
      hint: error.hint
    });
  }

  console.log("Created gate pass:", data);

  res.status(201).json(data);
});

app.listen(PORT, () => {
  console.log(`GatePass API running on port ${PORT}`);
});


app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .limit(1);

  if (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.json({
    message: "Supabase connection successful",
    data
  });
});

app.patch("/api/gatepasses/:id/status", async (req, res) => {
  const { status } = req.body;

  const { data, error } = await supabase
    .from("visitors")
    .update({ status })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    console.error("Status update error:", error);

    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});