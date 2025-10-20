import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedStudents() {
  const students = [
    { nim: "2021001", name: "Ahmad Rizki", program: "Computer Science" },
    { nim: "2021002", name: "Siti Nurhaliza", program: "Information Systems" },
    { nim: "2021003", name: "Budi Santoso", program: "Computer Science" },
    { nim: "2021004", name: "Dewi Lestari", program: "Software Engineering" },
    { nim: "2021005", name: "Eko Prasetyo", program: "Computer Science" },
    {
      nim: "2021006",
      name: "Fitria Rahmawati",
      program: "Information Systems",
    },
    { nim: "2021007", name: "Gunawan Wijaya", program: "Data Science" },
    { nim: "2021008", name: "Hana Pertiwi", program: "Software Engineering" },
    { nim: "2021009", name: "Indra Kusuma", program: "Computer Science" },
    { nim: "2021010", name: "Jasmine Putri", program: "Information Systems" },
  ];

  for (const student of students) {
    await prisma.student.upsert({
      where: { nim: student.nim },
      update: student,
      create: student,
    });
  }

  console.log(`✅ Seeded ${students.length} students`);
}

seedStudents()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
