// Script kiểm tra nội dung file habits.json
import fs from "fs/promises"

async function checkHabits() {
  try {
    console.log("🔍 Kiểm tra file habits.json...")

    const data = await fs.readFile("habits.json", "utf8")
    const habits = JSON.parse(data)

    console.log(`📊 Tổng số thói quen: ${habits.length}`)

    habits.forEach((habit, index) => {
      console.log(`\n${index + 1}. ${habit.name}`)
      console.log(`   ID: "${habit.id}" (độ dài: ${habit.id.length})`)
      console.log(`   Category: ${habit.category}`)
      console.log(`   Created: ${habit.createdAt}`)

      if (!habit.id || habit.id === "") {
        console.log("   ❌ ID RỖNG!")
      } else {
        console.log("   ✅ ID hợp lệ")
      }
    })
  } catch (error) {
    console.error("❌ Lỗi khi đọc file:", error)
  }
}

// Chạy kiểm tra
checkHabits()
