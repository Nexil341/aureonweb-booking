
const prisma = require("./config/prisma");

async function main() {
    const count = await prisma.user.count();

    console.log("Użytkownicy:", count);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
