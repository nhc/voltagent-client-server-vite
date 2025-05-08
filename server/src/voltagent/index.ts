import { VoltAgent, Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";

import { openai } from "@ai-sdk/openai";

export const agent = new Agent({
  name: "voltagent-client-server-example",
  instructions:
    "A helpful assistant called VoltAgent assistant that answers questions without using tools",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [],
});

new VoltAgent({
  agents: {
    agent,
  },
});
