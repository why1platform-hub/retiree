import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Users
  const [admin, instructor, normal] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@demo.com" },
      update: {},
      create: { email: "admin@demo.com", name: "Admin", role: "Admin", passwordHash: await bcrypt.hash("Admin1234!", 10) }
    }),
    prisma.user.upsert({
      where: { email: "instructor@demo.com" },
      update: {},
      create: { email: "instructor@demo.com", name: "Instructor", role: "Instructor", passwordHash: await bcrypt.hash("Instructor1234!", 10) }
    }),
    prisma.user.upsert({
      where: { email: "user@demo.com" },
      update: {},
      create: { email: "user@demo.com", name: "Normal User", role: "Normal", passwordHash: await bcrypt.hash("User1234!", 10) }
    })
  ]);

  // Profiles
  await prisma.userProfile.upsert({
    where: { userId: normal.id },
    update: {},
    create: {
      userId: normal.id,
      headline: "Former operations lead, now reskilling for a new role",
      bio: "Interested in project coordination, customer support, and operations.",
      location: "Seoul",
      skills: { create: [{ name: "Communication", level: 4 }, { name: "Excel", level: 3 }] }
    }
  });

  // Announcements + FAQ
  await prisma.announcement.createMany({
    data: [
      { title: "Welcome to the Retiree Support Platform", body: "Check programs, learn via videos, and book consultations.", badge: "안내" },
      { title: "New Program Intake Open", body: "Applications are open for the January program track.", badge: "긴급" }
    ],
    skipDuplicates: true
  });

  await prisma.faqItem.createMany({
    data: [
      { question: "How do I apply for a program?", answer: "Go to Programs and click Apply.", sortOrder: 1 },
      { question: "How do I book a consultant?", answer: "Go to Consulting and request an available slot.", sortOrder: 2 }
    ],
    skipDuplicates: true
  });

  // Program + Jobs
  const program = await prisma.program.upsert({
    where: { id: "demo-program-1" },
    update: {},
    create: {
      id: "demo-program-1",
      name: "Career Transition Bootcamp",
      field: "Career",
      description: "A guided program to help retirees transition to new roles.",
      statusLabel: "진행중"
    }
  });

  const job = await prisma.jobPosting.upsert({
    where: { id: "demo-job-1" },
    update: {},
    create: {
      id: "demo-job-1",
      title: "Operations Coordinator",
      company: "Demo Company",
      location: "Seoul",
      jobType: "Full-time",
      salary: "Negotiable",
      description: "Support operations and coordination across teams.",
      requirements: "Communication, spreadsheets, coordination"
    }
  });

  // Course + Lessons (video learning)
  const course = await prisma.course.upsert({
    where: { id: "demo-course-1" },
    update: {},
    create: {
      id: "demo-course-1",
      title: "Excel for Work (Basics)",
      description: "A practical refresher for workplace spreadsheets.",
      isPublished: true,
      instructorId: instructor.id,
      lessons: {
        create: [
          { title: "Getting Started", videoUrl: "https://example.com/video1", sortOrder: 1, durationSeconds: 420 },
          { title: "Tables & Filters", videoUrl: "https://example.com/video2", sortOrder: 2, durationSeconds: 540 }
        ]
      }
    }
  });

  // Learning resources
  await prisma.learningResource.createMany({
    data: [
      { title: "Resume Template (PDF)", fileUrl: "https://example.com/resume.pdf", fileSize: "220KB", category: "PDF" },
      { title: "Interview Checklist", fileUrl: "https://example.com/checklist.pdf", fileSize: "180KB", category: "PDF" }
    ],
    skipDuplicates: true
  });

  // Consultant availability
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const availability = await prisma.consultantAvailability.create({
    data: { consultantId: instructor.id, startUtc: start, endUtc: end, isActive: true }
  });

  // Sample discussion & Q&A
  const thread = await prisma.discussionThread.create({
    data: { title: "Introductions", userId: normal.id }
  });
  await prisma.discussionPost.create({
    data: { threadId: thread.id, userId: normal.id, body: "Hi everyone! Excited to learn and connect." }
  });

  const question = await prisma.question.create({
    data: { title: "How long does program review take?", body: "After I apply, when should I expect an update?", userId: normal.id }
  });
  await prisma.answer.create({
    data: { questionId: question.id, userId: instructor.id, body: "Usually within 3–5 business days. We will notify you via email." }
  });

  // Sample enrollment + application
  await prisma.courseEnrollment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: normal.id } },
    update: { progressPercent: 25 },
    create: { courseId: course.id, userId: normal.id, progressPercent: 25 }
  });

  await prisma.programApplication.upsert({
    where: { programId_userId: { programId: program.id, userId: normal.id } },
    update: {},
    create: { programId: program.id, userId: normal.id, status: "Submitted" }
  });

  await prisma.jobApplication.upsert({
    where: { jobId_userId: { jobId: job.id, userId: normal.id } },
    update: {},
    create: { jobId: job.id, userId: normal.id, status: "Submitted" }
  });

  console.log("Seed complete. Demo users:");
  console.log("- admin@demo.com (Admin)");
  console.log("- instructor@demo.com (Instructor)");
  console.log("- user@demo.com (Normal)");
  console.log("Login at /login with the passwords above.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
