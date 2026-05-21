import React, { useState } from "react";
import axios from "axios";
import { API } from "@/ADVOCAI/constants/api";

const Timeline = () => {
  const [text, setText] = useState("");
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateTimeline = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        API.generateTimeline,
  { text }
);

setTimeline(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to generate timeline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Timeline Builder</h1>

      <textarea
        rows={10}
        cols={80}
        placeholder="Paste case text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <br />

      <button onClick={generateTimeline}>
        {loading ? "Generating..." : "Generate Timeline"}
      </button>

      <div style={{ marginTop: "40px" }}>
        {timeline.map((item, index) => (
          <div
            key={index}
            style={{
              borderLeft: "4px solid #2563eb",
              paddingLeft: "15px",
              marginBottom: "20px",
            }}
          >
            <h3>{item.date}</h3>
            <p>{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;