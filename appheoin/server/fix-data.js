// Import các thư viện cần thiết
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Đường dẫn đến thư mục data
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, "data")
const habitsFile = join(dataDir, "habits.json")

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

// Hàm sửa dữ liệu
async function fixData() {
  try {
    console.log("Bắt đầu sửa dữ liệu...")

    // Đọc dữ liệu thói quen
    const habits = await readData(habitsFile)

    // Kiểm tra và sửa ID
    let fixed = 0
    for (let i = 0; i < habits.length; i++) {
      if (!habits[i].id || habits[i].id === "") {
        habits[i].id = `fixed_${Date.now()}_${i}`
        fixed++
      }
    }

    // Lưu dữ liệu đã sửa
    await writeData(habitsFile, habits)

    console.log(`Đã sửa ${fixed} thói quen có ID không hợp lệ.`)
    console.log("Dữ liệu đã được sửa thành công!")
  } catch (error) {
    console.error("Lỗi khi sửa dữ liệu:", error)
  }
}

// Chạy hàm sửa dữ liệu
fixData()
