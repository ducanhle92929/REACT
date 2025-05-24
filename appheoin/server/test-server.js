// Script test để kiểm tra server
import fetch from "node-fetch"

const baseUrl = "http://localhost:3000"

async function testCreateHabit() {
  try {
    console.log("🧪 Bắt đầu test tạo thói quen...")

    const testHabit = {
      name: "Test Habit",
      category: "health",
      iconIndex: 0,
      target: 5,
      unit: "Ly",
      frequency: "Hằng ngày",
      reminders: "8:00",
      color: "blue",
    }

    console.log("📤 Gửi request:", JSON.stringify(testHabit, null, 2))

    const response = await fetch(`${baseUrl}/api/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testHabit),
    })

    console.log("📥 Response status:", response.status)

    const responseData = await response.json()
    console.log("📥 Response data:", JSON.stringify(responseData, null, 2))

    if (responseData.id && responseData.id !== "") {
      console.log("✅ Test thành công! ID:", responseData.id)
    } else {
      console.log("❌ Test thất bại! ID rỗng hoặc không tồn tại")
    }
  } catch (error) {
    console.error("❌ Lỗi test:", error)
  }
}

// Chạy test
testCreateHabit()
