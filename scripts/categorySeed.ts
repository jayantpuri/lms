const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

const categories = [
  { name: "Computer Science" },
  { name: "Music" },
  { name: "Fitness" },
  { name: "Photography" },
  { name: "Filming" },
  { name: "Enigneering" },
];

async function seedCategories() {
  try {
    await database.category.createMany({
      data: categories,
    });
    console.log("categories seeded");
  } catch (error) {
    console.log("cannot push catrgoriesd to database");
  }
}

seedCategories();
