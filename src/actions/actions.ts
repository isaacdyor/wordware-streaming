"use server";

import { z } from "zod";

const RunResponseSchema = z.object({
  runId: z.string(),
});

export async function startRun({
  apiKey,
  version,
  inputs,
  orgSlug,
  appSlug,
}: {
  apiKey: string;
  version: string;
  inputs: Record<string, string>;
  orgSlug: string;
  appSlug: string;
}): Promise<string> {
  try {
    const url = `https://api.wordware.ai/v1alpha/apps/${orgSlug}/${appSlug}/${version}/runs`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to start run: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    const { runId } = RunResponseSchema.parse(data);
    return runId;
  } catch (error) {
    console.error("Error starting run:", error);
    throw error;
  }
}
