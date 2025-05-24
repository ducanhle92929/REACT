// Script test đơn giản
import fetch from "node-fetch"

const baseUrl = "http://localhost:3000"

async function testServer() {
  try {
    console.log("🧪 Test 1: Kiểm tra server có hoạt động không...")

    const testResponse = await fetch(`${baseUrl}/api/test`)
    const testData = await testResponse.json()

    console.log("📥 Test response:", testData)

    if (testData.version === "NEW_VERSION_WITH_DEBUG") {
      console.log("✅ Server đang chạy code mới!")
    } else {
      console.log("❌ Server có thể đang chạy code cũ!")
    }

    console.log("\n🧪 Test 2: Kiểm tra tạo ID...")

    const idResponse = await fetch(`${baseUrl}/api/test-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const idData = await idResponse.json()
    console.log("📥 ID test response:", idData)

    if (idData.id && idData.id !== "") {
      console.log("✅ Tạo ID thành công!")
    } else {
      console.log("❌ Tạo ID thất bại!")
    }
  } catch (error) {
    console.error("❌ Lỗi test:", error)
  }
}

testServer()
