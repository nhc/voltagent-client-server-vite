import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { agent } from "./voltagent/index.js";

// Create Hono app
const app = new Hono();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Root endpoint
app.get("/", (c) => {
  return c.json({ message: "VoltAgent Server is running" });
});

// Stream endpoint
app.post("/stream", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = body;

    if (!prompt) {
      return c.json({ error: "Missing prompt" }, 400);
    }

    // Set up SSE streaming
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log(`Starting stream with prompt: "${prompt}"`);
          const response = await agent.streamText(prompt, {
            userId: "123",
            conversationId: "123",
          });

          let finalContent = "";
          // Handle the text stream
          for await (const chunk of response.textStream) {
            finalContent += chunk;
            const data = {
              text: chunk,
              timestamp: new Date().toISOString(),
              type: "text",
            };
            const sseMessage = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(sseMessage));
          }

          // Completion message
          const completionData = {
            finalContent: finalContent,
            timestamp: new Date().toISOString(),
            type: "completion",
          };
          const completionMessage = `data: ${JSON.stringify(
            completionData
          )}\n\n`;
          controller.enqueue(new TextEncoder().encode(completionMessage));

          console.log("Stream finished");
          controller.close();
        } catch (streamError) {
          console.error("Error during stream:", streamError);
          const errorData = {
            error:
              streamError instanceof Error
                ? streamError.message
                : "Streaming failed",
            timestamp: new Date().toISOString(),
            type: "error",
          };
          const errorMessage = `data: ${JSON.stringify(errorData)}\n\n`;
          try {
            controller.enqueue(new TextEncoder().encode(errorMessage));
          } catch {}
          controller.close();
        }
      },
    });

    // Return the stream response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in /stream endpoint:", error);
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process stream request",
      },
      500
    );
  }
});

// Start the server
const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
