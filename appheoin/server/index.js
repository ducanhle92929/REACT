import express from "express"
import fs from "fs/promises"
import cors from "cors"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const habitsFile = "habits.json"
const progressFile = "progress.json"

// Hàm đọc dữ liệu từ file
async function readData(file) {
  try {
    const data = await fs.readFile(file, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Lỗi khi đọc file:", error)
    return []
  }
}

// Hàm ghi dữ liệu vào file
async function writeData(file, data) {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2))
    console.log("Đã ghi dữ liệu vào file:", file)
  } catch (error) {
    console.error("Lỗi khi ghi file:", error)
  }
}

// Hàm tạo ID duy nhất
function generateUniqueId() {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 10000)
  const id = `habit_${timestamp}_${randomNum}`
  console.log("🔥 Tạo ID mới:", id)
  return id
}

app.listen(port, () => {
  console.log(`🚀 Server đang lắng nghe tại http://localhost:${port}`)
  console.log(`🔧 Server version: NEW_VERSION_WITH_DEBUG`)
})

// API test để kiểm tra server
app.get("/api/test", (req, res) => {
  console.log("🧪 Test endpoint được gọi")

  const testId = generateUniqueId()
  console.log("🧪 Test ID:", testId)

  res.json({
    message: "Server đang hoạt động với code mới",
    version: "NEW_VERSION_WITH_DEBUG",
    testId: testId,
    timestamp: new Date().toISOString(),
  })
})

// API test tạo ID
app.post("/api/test-id", (req, res) => {
  console.log("🧪 Test ID endpoint được gọi")

  const newId = generateUniqueId()
  console.log("🧪 Generated ID:", newId)
  console.log("🧪 ID length:", newId.length)
  console.log("🧪 ID is empty:", newId === "")

  const testObject = {
    id: newId,
    name: "Test",
    createdAt: new Date().toISOString(),
  }

  console.log("🧪 Test object:", JSON.stringify(testObject, null, 2))

  res.json(testObject)
})

// API lấy danh sách thói quen
app.get("/api/habits", async (req, res) => {
  try {
    const habits = await readData(habitsFile)
    res.json(habits)
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thói quen:", error)
    res.status(500).json({ error: "Không thể lấy danh sách thói quen" })
  }
})

// API tạo thói quen mới
app.post("/api/habits", async (req, res) => {
  try {
    console.log("=" * 50)
    console.log("📥 NHẬN YÊU CẦU TẠO THÓI QUEN MỚI")
    console.log("=" * 50)
    console.log("Request body:", JSON.stringify(req.body, null, 2))

    const habits = await readData(habitsFile)

    // Tạo ID mới
    console.log("🔄 Bắt đầu tạo ID...")
    const newId = generateUniqueId()
    console.log("✅ ID được tạo:", newId)
    console.log("✅ Kiểm tra ID:")
    console.log("   - newId:", newId)
    console.log("   - typeof newId:", typeof newId)
    console.log("   - newId.length:", newId.length)
    console.log("   - newId === '':", newId === "")
    console.log("   - !newId:", !newId)

    // Tạo thói quen mới - HOÀN TOÀN THỦ CÔNG
    console.log("🔄 Tạo object thói quen...")
    const newHabit = {}
    newHabit.id = newId
    newHabit.name = req.body.name || ""
    newHabit.category = req.body.category || ""
    newHabit.iconIndex = req.body.iconIndex || 0
    newHabit.target = req.body.target || 0
    newHabit.unit = req.body.unit || ""
    newHabit.frequency = req.body.frequency || ""
    newHabit.reminders = req.body.reminders || ""
    newHabit.color = req.body.color || ""
    newHabit.createdAt = new Date().toISOString()
    newHabit.updatedAt = new Date().toISOString()

    console.log("🔍 KIỂM TRA THÓI QUEN MỚI:")
    console.log("   - newHabit.id:", newHabit.id)
    console.log("   - typeof newHabit.id:", typeof newHabit.id)
    console.log("   - newHabit.id.length:", newHabit.id.length)
    console.log("   - newHabit.id === '':", newHabit.id === "")
    console.log("   - !newHabit.id:", !newHabit.id)
    console.log("Full object:", JSON.stringify(newHabit, null, 2))

    // Kiểm tra ID có hợp lệ không
    if (!newHabit.id || newHabit.id === "") {
      console.error("❌ LỖI: ID không hợp lệ sau khi tạo")
      console.error("newHabit.id:", newHabit.id)
      return res.status(400).json({ error: "Không thể tạo ID cho thói quen mới" })
    }

    // Thêm vào danh sách
    console.log("🔄 Thêm vào danh sách...")
    habits.push(newHabit)

    // Lưu vào file
    console.log("🔄 Lưu vào file...")
    await writeData(habitsFile, habits)

    console.log("✅ ĐÃ TẠO THÓI QUEN MỚI THÀNH CÔNG")
    console.log("📤 CHUẨN BỊ TRẢ VỀ RESPONSE:")
    console.log("Response object:", JSON.stringify(newHabit, null, 2))
    console.log("Response ID:", newHabit.id)

    // Trả về thói quen mới
    res.status(201).json(newHabit)
  } catch (error) {
    console.error("❌ LỖI KHI TẠO THÓI QUEN MỚI:", error)
    res.status(500).json({ error: "Không thể tạo thói quen mới: " + error.message })
  }
})

// API cập nhật thói quen
app.put("/api/habits/:id", async (req, res) => {
  try {
    const habitId = req.params.id
    console.log("📝 Nhận yêu cầu cập nhật thói quen:", habitId, req.body)

    const habits = await readData(habitsFile)
    const index = habits.findIndex((h) => h.id === habitId)

    if (index === -1) {
      return res.status(404).json({ error: "Không tìm thấy thói quen" })
    }

    // Cập nhật thói quen
    const updatedHabit = {
      ...habits[index],
      ...req.body,
      id: habitId, // Đảm bảo ID không thay đổi
      updatedAt: new Date().toISOString(),
    }

    habits[index] = updatedHabit

    // Lưu vào file
    await writeData(habitsFile, habits)

    console.log("✅ Đã cập nhật thói quen thành công:", updatedHabit)

    res.json(updatedHabit)
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thói quen:", error)
    res.status(500).json({ error: "Không thể cập nhật thói quen" })
  }
})

// API xóa thói quen
app.delete("/api/habits/:id", async (req, res) => {
  try {
    const habitId = req.params.id
    console.log("🗑️ Nhận yêu cầu xóa thói quen:", habitId)

    const habits = await readData(habitsFile)
    const index = habits.findIndex((h) => h.id === habitId)

    if (index === -1) {
      return res.status(404).json({ error: "Không tìm thấy thói quen" })
    }

    // Xóa thói quen
    habits.splice(index, 1)

    // Lưu vào file
    await writeData(habitsFile, habits)

    console.log("✅ Đã xóa thói quen thành công:", habitId)

    res.json({ message: "Đã xóa thói quen thành công" })
  } catch (error) {
    console.error("❌ Lỗi khi xóa thói quen:", error)
    res.status(500).json({ error: "Không thể xóa thói quen" })
  }
})

// API lấy tiến độ theo ngày
app.get("/api/progress", async (req, res) => {
  try {
    const date = req.query.date
    console.log("📊 Nhận yêu cầu lấy tiến độ cho ngày:", date)

    const progress = await readData(progressFile)

    // Lọc tiến độ theo ngày
    const filteredProgress = date ? progress.filter((p) => p.date === date) : progress

    res.json(filteredProgress)
  } catch (error) {
    console.error("❌ Lỗi khi lấy tiến độ:", error)
    res.status(500).json({ error: "Không thể lấy tiến độ" })
  }
})

// API cập nhật tiến độ
app.post("/api/progress", async (req, res) => {
  try {
    const { habitId, date, value } = req.body

    console.log("📈 Nhận yêu cầu cập nhật tiến độ:", req.body)

    // Kiểm tra dữ liệu đầu vào
    if (!habitId) {
      console.error("❌ Thiếu habitId:", req.body)
      return res.status(400).json({ error: "Thiếu habitId" })
    }

    if (habitId === "") {
      console.error("❌ habitId không hợp lệ (rỗng):", req.body)
      return res.status(400).json({ error: "habitId không hợp lệ (rỗng)" })
    }

    if (!date) {
      console.error("❌ Thiếu date:", req.body)
      return res.status(400).json({ error: "Thiếu date" })
    }

    if (value === undefined) {
      console.error("❌ Thiếu value:", req.body)
      return res.status(400).json({ error: "Thiếu value" })
    }

    // Kiểm tra thói quen tồn tại
    const habits = await readData(habitsFile)
    const habit = habits.find((h) => h.id === habitId)

    if (!habit) {
      console.error("❌ Không tìm thấy thói quen:", habitId)
      return res.status(404).json({ error: "Không tìm thấy thói quen" })
    }

    const progress = await readData(progressFile)

    // Tìm tiến độ hiện tại
    const index = progress.findIndex((p) => p.habitId === habitId && p.date === date)

    if (index === -1) {
      // Tạo mới nếu chưa có
      const newProgress = {
        id: `progress_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        habitId,
        date,
        value,
        updatedAt: new Date().toISOString(),
      }
      progress.push(newProgress)
    } else {
      // Cập nhật nếu đã có
      progress[index].value = value
      progress[index].updatedAt = new Date().toISOString()
    }

    // Lưu vào file
    await writeData(progressFile, progress)

    console.log("✅ Đã cập nhật tiến độ thành công:", { habitId, date, value })

    res.json({ message: "Đã cập nhật tiến độ thành công" })
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật tiến độ:", error)
    res.status(500).json({ error: "Không thể cập nhật tiến độ" })
  }
})
