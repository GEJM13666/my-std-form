// prisma/seed.ts 
const { PrismaClient } = require("../app/generated/prisma");
const prisma = new PrismaClient();
const { hash } = require('bcryptjs');

 
async function seedSTD() {
  const students = [
    { firstName: "Sakan", lastName: "Wokkum", major: "ComSci", faculty: "Science of Digital Innovation", email: "sakan@gmail.com", phone: "0640054724" },
    { firstName: "Niti", lastName: "Suwansai", major: "Engineering", faculty: "Faculty of Engineering", email: "niti@gmail.com", phone: "0651234567" },
    { firstName: "Pim", lastName: "Wong", major: "Business", faculty: "Faculty of Business Administration", email: "pim@gmail.com", phone: "0652345678" },
    { firstName: "Korn", lastName: "Phuriphat", major: "Philosophy", faculty: "Faculty of Arts", email: "korn@gmail.com", phone: "0653456789" },
    { firstName: "Jin", lastName: "Chayatorn", major: "Physics", faculty: "Faculty of Science", email: "jin@gmail.com", phone: "0654567890" },
    { firstName: "Maya", lastName: "Saksa", major: "History", faculty: "Faculty of Arts", email: "maya@gmail.com", phone: "0655678901" },
    { firstName: "Tee", lastName: "Rukhan", major: "Marketing", faculty: "Faculty of Business", email: "tee@gmail.com", phone: "0656789012" },
    { firstName: "Nina", lastName: "Pat", major: "Design", faculty: "Faculty of Fine Arts", email: "nina@gmail.com", phone: "0657890123" },
    { firstName: "Suriya", lastName: "Yok", major: "Literature", faculty: "Faculty of Arts", email: "suriya@gmail.com", phone: "0658901234" },
    { firstName: "Eak", lastName: "Samphat", major: "Law", faculty: "Faculty of Law", email: "eak@gmail.com", phone: "0659012345" },
    { firstName: "Kris", lastName: "Virot", major: "Medicine", faculty: "Faculty of Medicine", email: "kris@gmail.com", phone: "0650123456" },
    { firstName: "Poo", lastName: "Wongcharoen", major: "Sociology", faculty: "Faculty of Social Sciences", email: "poo@gmail.com", phone: "0651234567" },
    { firstName: "Fah", lastName: "Patim", major: "Architecture", faculty: "Faculty of Architecture", email: "fah@gmail.com", phone: "0652345678" },
    { firstName: "Mark", lastName: "Panuwat", major: "Computer Engineering", faculty: "Faculty of Engineering", email: "mark@gmail.com", phone: "0653456789" },
    { firstName: "Pai", lastName: "Sukit", major: "Economics", faculty: "Faculty of Economics", email: "pai@gmail.com", phone: "0654567890" },
    { firstName: "Krit", lastName: "Boonchai", major: "Mathematics", faculty: "Faculty of Science", email: "krit@gmail.com", phone: "0655678901" },
    { firstName: "Lina", lastName: "Somchai", major: "Fine Arts", faculty: "Faculty of Fine Arts", email: "lina@gmail.com", phone: "0656789012" },
    { firstName: "Oat", lastName: "Sukja", major: "Agriculture", faculty: "Faculty of Agriculture", email: "oat@gmail.com", phone: "0657890123" },
    { firstName: "Apple", lastName: "Thanakorn", major: "Biotechnology", faculty: "Faculty of Science", email: "apple@gmail.com", phone: "0658901234" },
    { firstName: "Ben", lastName: "Chaiwong", major: "Journalism", faculty: "Faculty of Communication Arts", email: "ben@gmail.com", phone: "0659012345" },
    { firstName: "May", lastName: "Thitikorn", major: "Pharmacy", faculty: "Faculty of Pharmacy", email: "may@gmail.com", phone: "0650123456" },
    { firstName: "Ae", lastName: "Nakamura", major: "Music", faculty: "Faculty of Music", email: "ae@gmail.com", phone: "0651234567" },
    { firstName: "Ryu", lastName: "Kittipong", major: "Psychology", faculty: "Faculty of Social Sciences", email: "ryu@gmail.com", phone: "0652345678" },
    { firstName: "Poy", lastName: "Poomsa", major: "Nursing", faculty: "Faculty of Nursing", email: "poy@gmail.com", phone: "0653456789" },
    { firstName: "Dome", lastName: "Chokpachon", major: "Tourism", faculty: "Faculty of Arts", email: "dome@gmail.com", phone: "0654567890" },
    { firstName: "Bum", lastName: "Rachaporn", major: "Veterinary Medicine", faculty: "Faculty of Veterinary Science", email: "bum@gmail.com", phone: "0655678901" },
    { firstName: "Oat", lastName: "Thapthim", major: "International Relations", faculty: "Faculty of Political Science", email: "oat2@gmail.com", phone: "0656789012" }
  ];

  for (const student of students) {
    // Check if the student with the same email already exists
    const existingStudent = await prisma.student.findUnique({
      where: {
        email: student.email, // Check for existing email
      },
    });

    // If no student exists with the same email, create the student
    if (!existingStudent) {
      await prisma.student.create({
        data: student,
      });
    }
  }
}

 
async function main() { 
  await seedSTD(); 

    const adminUsername = 'admin';
  const adminPassword = 'admin123'; // ปกติควรเก็บใน .env แล้วอ่านจาก process.env

  // เช็คก่อนว่ามี admin หรือยัง
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const hashedPassword = await hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      image: null,
    },
  });

  console.log('✅ Admin user created:', adminUser);

  // --- เพิ่มส่วนสำหรับสร้าง Teacher ---
  const teacherUsername = 'teacher';
  const teacherPassword = 'teacher123';

  const existingTeacher = await prisma.user.findUnique({
    where: { username: teacherUsername },
  });

  if (existingTeacher) {
    console.log('Teacher user already exists');
  } else {
    const hashedTeacherPassword = await hash(teacherPassword, 10);
    await prisma.user.create({
      data: {
        username: teacherUsername,
        password: hashedTeacherPassword,
        role: 'teacher',
        image: null,
      },
    });
    console.log('✅ Teacher user created');
  }

  // --- เพิ่มส่วนสำหรับสร้าง Student User ---
  const studentUsername = 'student';
  const studentPassword = 'student123';

  const existingStudentUser = await prisma.user.findUnique({
    where: { username: studentUsername },
  });

  if (existingStudentUser) {
    console.log('Student user already exists');
  } else {
    const hashedStudentPassword = await hash(studentPassword, 10);
    await prisma.user.create({
      data: {
        username: studentUsername,
        password: hashedStudentPassword,
        role: 'student',
        image: null,
      },
    });
    console.log('✅ Student user created');
  }
} 


main() 
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  }) 
  .finally(async () => { 
    await prisma.$disconnect(); 
  }); 