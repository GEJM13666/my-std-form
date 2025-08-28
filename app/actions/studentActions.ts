// app/actions/studentActions.ts

"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// กำหนด Type สำหรับ State เพื่อความชัดเจน (Optional but recommended)
type FormState = {
  success: string | null;
  error: string | null;
};

// ⚙️ CREATE: ฟังก์ชันสำหรับเพิ่มข้อมูลนักเรียนใหม่ (ฉบับแก้ไข)
export async function createStudent(
  prevState: FormState, // <--- เพิ่มพารามิเตอร์ตัวนี้เข้ามา
  formData: FormData
): Promise<FormState> { // <--- ระบุ Type ที่จะ return ให้ชัดเจน
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    // ... ดึงข้อมูลอื่นๆ ...
    const email = formData.get("email") as string;

    if (!firstName || !email) {
      return { success: null, error: "First name and email are required." };
    }

    await prisma.student.create({
      data: {
        // ... ข้อมูลที่จะบันทึก ...
        firstName,
        lastName,
        major: formData.get("major") as string,
        faculty: formData.get("faculty") as string,
        email,
        phone: formData.get("phone") as string,
      },
    });

    revalidatePath("/students");
    return { success: "Student created successfully!", error: null };

  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return { success: null, error: "This email is already in use." };
    }
    return { success: null, error: "Something went wrong, could not create student." };
  }
}

// ... ฟังก์ชันอื่นๆ ยังคงเหมือนเดิม ...

// 📖 READ: ฟังก์ชันสำหรับดึงข้อมูลนักเรียนทั้งหมด
export async function getAllStudents() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc', // เรียงจากใหม่ไปเก่า
      }
    });
    return students;
  } catch (error) {
    console.error(error);
    return []; // คืนค่าเป็น array ว่างถ้าเกิด error
  }
}

// ✏️ UPDATE: ฟังก์ชันสำหรับอัปเดตข้อมูลนักเรียน
export async function updateStudent(id: number, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const major = formData.get("major") as string;
    const faculty = formData.get("faculty") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!id) {
        return { error: "Student ID is missing." };
    }

    await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        major,
        faculty,
        email,
        phone,
      },
    });

    revalidatePath("/students"); // อัปเดตหน้ารายการ
    revalidatePath(`/students/${id}`); // อัปเดตหน้ารายละเอียด (ถ้ามี)
    return { success: "Student updated successfully!" };

  } catch (error) {
    return { error: "Something went wrong, could not update student." };
  }
}

// 🗑️ DELETE: ฟังก์ชันสำหรับลบข้อมูลนักเรียน
// app/actions/studentActions.ts

// ฟังก์ชันนี้ถูกต้องแล้ว: รับ formData และดึง id ออกมาใช้
// app/actions/studentActions.ts

export async function deleteStudent(formData: FormData) {
  try {
    const id = formData.get("id");

    if (!id) {
      console.error("Delete failed: Student ID is missing.");
      return; // Exit if no ID
    }
      
    await prisma.student.delete({
      where: { 
        id: Number(id)
      },
    });

    // This is the most important part for updating the UI
    revalidatePath("/students");

  } catch (error) {
    // You can log the error on the server for debugging
    console.error("Failed to delete student:", error);
  }
}