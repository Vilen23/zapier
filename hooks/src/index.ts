import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;

  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
      },
    });

    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.zapId,
      },
    });
  });
  res.json({
    message: "Webhook received",
  });
});

app.listen(3000);
