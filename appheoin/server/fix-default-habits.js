// Script sửa thói quen mặc định
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const habitsFile = join(__dirname, "habits.json")
const progressFile = join(__dirname, "progress.json")

// Hàm đọc dữ liệu từ file
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    if (error.code === "ENOENT") {
      return []
    }
    throw error
  }
}

// Hàm ghi dữ liệu vào file
async function writeData(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
}

async function fixDefaultHabits() {
  try {
    console.log("🔧 SỬA THÓI QUEN MẶC ĐỊNH")
    console.log("=" * 50)

    const habits = await readData(habitsFile)
    const progress = await readData(progressFile)

    console.log(`📊 Trước khi sửa: ${habits.length} thói quen, ${progress.length} tiến độ`)

    // Danh sách ID thói quen mặc định
    const defaultHabitIds = [
      "default_water_habit",
      "default_exercise_habit",
      "default_meditation_habit",
      "default_reading_habit",
    ]

    // Xóa tất cả thói quen mặc định cũ (cả ID cố định và ID động)
    const userHabits = habits.filter((habit) => {
      // Giữ lại thói quen do người dùng tạo (không phải mặc định)
      const isDefaultById = defaultHabitIds.includes(habit.id)
      const isDefaultByName = ["Uống nước", "Tập thể dục", "Thiền", "Đọc sách"].includes(habit.name)

      if (isDefaultById || isDefaultByName) {
        console.log(`🗑️ Xóa thói quen mặc định: ${habit.name} (${habit.id})`)
        return false
      }
      return true
    })

    // Tạo thói quen mặc định mới với ID cố định
    const now = new Date().toISOString()
    const defaultHabits = [
      {
        id: "default_water_habit",
        name: "Uống nước",
        category: "health",
        iconIndex: 0,
        target: 8,
        unit: "Ly",
        frequency: "Hằng ngày",
        reminders: "8:00, 12:00, 16:00, 20:00",
        color: "blue",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "default_exercise_habit",
        name: "Tập thể dục",
        category: "health",
        iconIndex: 4,
        target: 30,
        unit: "Phút",
        frequency: "Hằng ngày",
        reminders: "6:00",
        color: "blue",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "default_meditation_habit",
        name: "Thiền",
        category: "mental",
        iconIndex: 1,
        target: 15,
        unit: "Phút",
        frequency: "Hằng ngày",
        reminders: "7:00, 21:00",
        color: "orange",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "default_reading_habit",
        name: "Đọc sách",
        category: "mental",
        iconIndex: 3,
        target: 30,
        unit: "Phút",
        frequency: "Hằng ngày",
        reminders: "21:00",
        color: "orange",
        createdAt: now,
        updatedAt: now,
      },
    ]

    // Kết hợp thói quen do người dùng tạo và thói quen mặc định mới
    const allHabits = [...userHabits, ...defaultHabits]

    // Lọc tiến độ chỉ giữ lại của thói quen còn tồn tại
    const validHabitIds = new Set(allHabits.map((h) => h.id))
    const validProgress = progress.filter((p) => {
      if (validHabitIds.has(p.habitId)) {
        return true
      } else {
        console.log(`🗑️ Xóa tiến độ của thói quen không tồn tại: ${p.habitId}`)
        return false
      }
    })

    // Lưu dữ liệu
    await writeData(habitsFile, allHabits)
    await writeData(progressFile, validProgress)

    console.log(`\n📊 Sau khi sửa:`)
    console.log(`   - Thói quen do người dùng: ${userHabits.length}`)
    console.log(`   - Thói quen mặc định: ${defaultHabits.length}`)
    console.log(`   - Tổng thói quen: ${allHabits.length}`)
    console.log(`   - Tiến độ hợp lệ: ${validProgress.length}`)

    console.log(`\n✅ Đã sửa thói quen mặc định thành công!`)

    // Hiển thị thói quen mặc định mới
    console.log(`\n🔵 Thói quen mặc định mới:`)
    defaultHabits.forEach((habit, index) => {
      console.log(`   ${index + 1}. ${habit.name} (${habit.id})`)
    })
  } catch (error) {
    console.error("❌ Lỗi khi sửa thói quen mặc định:", error)
  }
}

// Chạy script
fixDefaultHabits()
