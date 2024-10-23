"use client";

import { startRun } from "@/actions/actions";
import { useState } from "react";

const apiKey = "ww-4yBapCwfmpRWhvQo5zgjkFejdwUtCs7dDLrxDnyvaQ1U1EXKfTmYsj";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const handleStartRun = async () => {
    setLoading(true);
    const runId = await startRun({
      apiKey,
      version: "2.1",
      inputs: {
        question: "Please tell me all the news on cassava sciences. ",
      },
      orgSlug: "isaac-dyor-d74b42",
      appSlug: "106f80a2-4606-49f5-9edd-c25de0400c76",
    });
    const response = await fetch(`/api/stream/${runId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let jsonBuffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream complete");
        break;
      }

      // Decode the chunk and split by lines
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      // Process each line
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          jsonBuffer += line.slice(6);
          if (jsonBuffer.trim().endsWith("}")) {
            try {
              const data = JSON.parse(jsonBuffer);
              console.log("Parsed data:", data);
              if (data.content) {
                console.log(data.content);
              }
              // Reset buffer after successful parse
              jsonBuffer = "";
            } catch (e) {
              // If we can't parse yet, we might need more lines
              console.log("Not yet complete JSON");
            }
          }
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WordWare Stream</h1>
      <button
        className="bg-teal-500 p-2 rounded mb-4 disabled:cursor-not-allowed"
        onClick={handleStartRun}
        disabled={loading}
      >
        {loading ? "Loading..." : "Start run"}
      </button>
    </div>
  );
}
