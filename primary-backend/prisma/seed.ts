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
            image: "https://via.placeholder.com/48?text=WH"
        }
    });

    await prisma.availableAction.upsert({
        where: { id: "email" },
        update: {},
        create: {
            id: "email",
            name: "Email",
            image: "https://via.placeholder.com/48?text=EM"
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
