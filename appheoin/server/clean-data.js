// Import các thư viện cần thiết
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Đường dẫn đến thư mục data
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, "data")
const habitsFile = join(dataDir, "habits.json")
const progressFile = join(dataDir, "progress.json")

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

// Hàm xóa dữ liệu có ID rỗng
async function cleanData() {
  try {
    console.log("Bắt đầu xóa dữ liệu có ID rỗng...")

    // Đọc dữ liệu thói quen
    const habits = await readData(habitsFile)
    const progress = await readData(progressFile)

    // Lọc ra các thói quen có ID hợp lệ
    const validHabits = habits.filter((habit) => habit.id && habit.id.trim() !== "")

    // Đếm số thói quen bị xóa
    const removedCount = habits.length - validHabits.length

    // Lọc ra các tiến độ có habitId hợp lệ
    const validProgress = progress.filter((p) => {
      // Kiểm tra habitId có tồn tại và không rỗng
      if (!p.habitId || p.habitId.trim() === "") return false

      // Kiểm tra habitId có tồn tại trong danh sách thói quen hợp lệ không
      return validHabits.some((h) => h.id === p.habitId)
    })

    // Đếm số tiến độ bị xóa
    const removedProgressCount = progress.length - validProgress.length

    // Lưu dữ liệu đã lọc
    await writeData(habitsFile, validHabits)
    await writeData(progressFile, validProgress)

    console.log(`Đã xóa ${removedCount} thói quen có ID không hợp lệ.`)
    console.log(`Đã xóa ${removedProgressCount} tiến độ không hợp lệ.`)
    console.log("Dữ liệu đã được làm sạch thành công!")
  } catch (error) {
    console.error("Lỗi khi làm sạch dữ liệu:", error)
  }
}

// Chạy hàm làm sạch dữ liệu
cleanData()
