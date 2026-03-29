import { prisma } from "../lib/prisma.js";

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Test User", email: "test@test.com", password: "password" },
  });
  console.log("User:", user);

  const trigger = await prisma.availableTrigger.create({
    data: { name: "webhooks", image: "https://example.com/webhook.png" },
  });
  console.log("AvailableTrigger:", trigger);

  const emailAction = await prisma.availableAction.create({
    data: { name: "email", image: "https://example.com/email.png" },
  });
  console.log("AvailableAction (email):", emailAction);

  const solanaAction = await prisma.availableAction.create({
    data: { name: "solana_send", image: "https://example.com/solana.png" },
  });
  console.log("AvailableAction (solana):", solanaAction);

  const zap = await prisma.zap.create({
    data: {
      userId: user.id,
      trigger: {
        create: { triggerId: trigger.id },
      },
      actions: {
        create: [
          { actionId: emailAction.id, sortingOrder: 0 },
          { actionId: solanaAction.id, sortingOrder: 1 },
        ],
      },
    },
    include: { trigger: true, actions: true },
  });
  console.log("Zap with trigger + actions:", JSON.stringify(zap, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
