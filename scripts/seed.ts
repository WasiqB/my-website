const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Appuim" },
        { name: "Selenium WebDriver" },
        { name: "Rest-Assured" },
        { name: "GitHub" },
        { name: "GitHub Actions" },
        { name: "WebDriverIO" },
      ],
    });
    console.log("Success!");
  } catch (error) {
    console.error("Error seeding the database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
