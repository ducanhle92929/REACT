// Import các thư viện cần thiết
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Đường dẫn đến thư mục hiện tại
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

// Hàm xóa dữ liệu có ID rỗng
async function cleanEmptyIds() {
  try {
    console.log("Bắt đầu xóa dữ liệu có ID rỗng...")

    // Đọc dữ liệu thói quen
    const habits = await readData(habitsFile)
    const progress = await readData(progressFile)

    console.log(`Tổng số thói quen trước khi xóa: ${habits.length}`)
    console.log(`Tổng số tiến độ trước khi xóa: ${progress.length}`)

    // Lọc ra các thói quen có ID hợp lệ (không rỗng và không null)
    const validHabits = habits.filter((habit) => {
      const isValid = habit.id && habit.id.trim() !== ""
      if (!isValid) {
        console.log(`Xóa thói quen có ID rỗng: ${habit.name}`)
      }
      return isValid
    })

    // Lấy danh sách ID hợp lệ
    const validHabitIds = validHabits.map((h) => h.id)

    // Lọc ra các tiến độ có habitId hợp lệ
    const validProgress = progress.filter((p) => {
      // Kiểm tra habitId có tồn tại và không rỗng
      if (!p.habitId || p.habitId.trim() === "") {
        console.log(`Xóa tiến độ có habitId rỗng: ${p.id}`)
        return false
      }

      // Kiểm tra habitId có tồn tại trong danh sách thói quen hợp lệ không
      if (!validHabitIds.includes(p.habitId)) {
        console.log(`Xóa tiến độ có habitId không tồn tại: ${p.habitId}`)
        return false
      }

      return true
    })

    // Đếm số thói quen và tiến độ bị xóa
    const removedHabitsCount = habits.length - validHabits.length
    const removedProgressCount = progress.length - validProgress.length

    // Lưu dữ liệu đã lọc
    await writeData(habitsFile, validHabits)
    await writeData(progressFile, validProgress)

    console.log(`Đã xóa ${removedHabitsCount} thói quen có ID không hợp lệ.`)
    console.log(`Đã xóa ${removedProgressCount} tiến độ không hợp lệ.`)
    console.log(`Còn lại ${validHabits.length} thói quen hợp lệ.`)
    console.log(`Còn lại ${validProgress.length} tiến độ hợp lệ.`)
    console.log("Dữ liệu đã được làm sạch thành công!")
  } catch (error) {
    console.error("Lỗi khi làm sạch dữ liệu:", error)
  }
}

// Chạy hàm làm sạch dữ liệu
cleanEmptyIds()
