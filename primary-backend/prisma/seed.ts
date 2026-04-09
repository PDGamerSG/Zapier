import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
console.log("Connecting to:", connectionString);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.availableTrigger.upsert({
        where: { id: "webhook" },
        update: {},
        create: {
            id: "webhook",
            name: "Webhook",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVQtyw3YP4pW8owoHsGyCI2o8POL2m7Hf9NA&s"
        }
    });

    await prisma.availableAction.upsert({
        where: { id: "email" },
        update: {},
        create: {
            id: "email",
            name: "Email",
            image: "https://img.freepik.com/premium-vector/email-letter-mail-message-subscribe-icon_1178600-1831.jpg?semt=ais_hybrid&w=740&q=80"
        }
    });

    await prisma.availableAction.upsert({
        where: { id: "sol" },
        update: {},
        create: {
            id: "sol",
            name: "Solana",
            image: "https://via.placeholder.com/48?text=SOL"
        }
    });

    await prisma.availableAction.upsert({
        where: { id: "send-sol" },
        update: {},
        create: {
            id: "send-sol",
            name: "Solana",
            image: "https://t4.ftcdn.net/jpg/10/07/56/63/360_F_1007566365_53UZszxYkvhblIWuMPfBmwQezeDryXeg.jpg"
        }
    });

    // Create a demo user with many zaps
    let user = await prisma.user.findFirst({ where: { email: "demo@zapier.com" } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Demo User",
                email: "demo@zapier.com",
                password: "password123"
            }
        });
    }
    console.log("User created:", user.email);

    const zapDefinitions = [
        { name: "Gmail → Slack", actions: [{ actionId: "email", order: 0 }] },
        { name: "Webhook → Email", actions: [{ actionId: "email", order: 0 }] },
        { name: "Webhook → Solana", actions: [{ actionId: "sol", order: 0 }] },
        { name: "Webhook → Email + Solana", actions: [{ actionId: "email", order: 0 }, { actionId: "sol", order: 1 }] },
        { name: "Daily Digest", actions: [{ actionId: "email", order: 0 }] },
        { name: "Payment Alert → Solana", actions: [{ actionId: "sol", order: 0 }] },
        { name: "Form Submit → Email", actions: [{ actionId: "email", order: 0 }] },
        { name: "Order Placed → Solana + Email", actions: [{ actionId: "sol", order: 0 }, { actionId: "email", order: 1 }] },
        { name: "Support Ticket → Email", actions: [{ actionId: "email", order: 0 }] },
        { name: "New Signup → Solana", actions: [{ actionId: "sol", order: 0 }] },
    ];

    for (const def of zapDefinitions) {
        const zap = await prisma.zap.create({
            data: {
                userId: user.id,
                triggerId: "webhook",
                trigger: {
                    create: {
                        triggerId: "webhook",
                        metadata: { name: def.name }
                    }
                },
                actions: {
                    create: def.actions.map(a => ({
                        actionId: a.actionId,
                        sortingOrder: a.order,
                        metadata: {}
                    }))
                }
            }
        });
        console.log(`Created zap: ${def.name} (${zap.id})`);
    }

    const triggers = await prisma.availableTrigger.findMany();
    const actions = await prisma.availableAction.findMany();
    console.log("Triggers:", triggers);
    console.log("Actions:", actions);
    console.log("Seed data created successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
