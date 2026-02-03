# Load Testing Scripts cho Voting System

## 📋 Mục đích

Scripts này giúp test hệ thống voting với nhiều người dùng đồng thời để kiểm tra:
- Performance của server
- Khả năng xử lý concurrent requests
- Phát hiện bottlenecks
- Kiểm tra tính ổn định của database

## 🚀 Scripts có sẵn

### 1. load-test-voting.js (Basic)

Script cơ bản để test với số lượng voters cố định.

**Chạy:**
```bash
node scripts/load-test-voting.js
```

**Cấu hình trong file:**
- `BASE_URL`: URL của ứng dụng (mặc định: http://localhost:3000)
- `CATEGORY`: 'queen' hoặc 'king'
- `NUM_VOTERS`: Số lượng voters (mặc định: 500)
- `BATCH_SIZE`: Số requests đồng thời (mặc định: 10)
- `BATCH_DELAY`: Delay giữa các batch (ms)

### 2. advanced-load-test.js (Advanced)

Script nâng cao với nhiều options và statistics chi tiết.

**Chạy với options:**

```bash
# Test với production URL
node scripts/advanced-load-test.js --voters=500 --category=queen --url=https://green-yellow.vercel.app

# Test với 1000 voters
node scripts/advanced-load-test.js --voters=1000

# Test tất cả vote cho 1 candidate cụ thể
node scripts/advanced-load-test.js --voters=500 --target=<candidate_id>

# Custom batch size và delay
node scripts/advanced-load-test.js --voters=500 --batch=20 --delay=50
```

**Options:**
- `--voters`: Số lượng voters (mặc định: 500)
- `--category`: queen hoặc king (mặc định: queen)
- `--url`: Base URL (mặc định: http://localhost:3000)
- `--batch`: Batch size - số requests đồng thời (mặc định: 10)
- `--delay`: Delay giữa các batch (ms) (mặc định: 100)
- `--target`: ID của candidate cụ thể để vote

**Kết quả hiển thị:**
- ✅ Tỷ lệ thành công/thất bại
- ⏱️ Response time statistics (min, avg, p50, p95, p99, max)
- ⚡ Throughput (votes/second)
- 📊 Phân bố votes cho mỗi candidate
- ❌ Chi tiết errors (nếu có)

## 📊 Ví dụ Output

```
╔════════════════════════════════════════════════════════╗
║        VOTING LOAD TEST - ADVANCED VERSION             ║
╚════════════════════════════════════════════════════════╝

📍 URL:       https://green-yellow.vercel.app
👑 Category:  queen
👥 Voters:    500
📦 Batch:     10 concurrent requests
⏱️  Delay:     100ms between batches

[████████████████████████████████████████] 100.0% (500/500)

╔════════════════════════════════════════════════════════╗
║                     KẾT QUẢ TEST                       ║
╚════════════════════════════════════════════════════════╝

📊 THỐNG KÊ TỔNG QUÁT:
   ✅ Thành công:     498/500 (99.60%)
   ❌ Thất bại:       2/500 (0.40%)
   ⏱️  Tổng thời gian: 12.34s
   ⚡ Throughput:     40.52 votes/s

⏱️  RESPONSE TIME:
   Min:     145ms
   Average: 234.56ms
   P50:     220ms
   P95:     350ms
   P99:     450ms
   Max:     523ms

📊 PHÂN BỐ VOTES:
    1. Candidate A              156 (31.2%) ██████████████████
    2. Candidate B              142 (28.4%) ████████████████
    3. Candidate C              112 (22.4%) █████████████
    4. Candidate D               90 (18.0%) ██████████
```

## ⚙️ Tuning Parameters

### Batch Size
- **Nhỏ (5-10)**: Ít tải hơn, phù hợp với server yếu hoặc testing cẩn thận
- **Trung bình (10-20)**: Cân bằng tốt cho hầu hết các trường hợp
- **Lớn (20-50)**: Tải cao, test performance giới hạn

### Batch Delay
- **0ms**: Maximum stress test
- **50-100ms**: Moderate load, realistic scenario
- **200-500ms**: Light load, giống user thật

### Số lượng Voters
- **100-500**: Quick test
- **500-1000**: Standard load test
- **1000-5000**: Heavy load test
- **5000+**: Stress test

## 🔍 Scenarios Test

### 1. Normal Load Test
Mô phỏng tải bình thường:
```bash
node scripts/advanced-load-test.js --voters=500 --batch=10 --delay=100
```

### 2. Stress Test
Test giới hạn của server:
```bash
node scripts/advanced-load-test.js --voters=2000 --batch=50 --delay=0
```

### 3. Peak Time Simulation
Mô phỏng giờ cao điểm:
```bash
node scripts/advanced-load-test.js --voters=1000 --batch=20 --delay=50
```

### 4. Single Candidate Test
Test vote bombing cho 1 candidate:
```bash
node scripts/advanced-load-test.js --voters=1000 --target=<candidate_id>
```

### 5. Production Test
Test trên production:
```bash
node scripts/advanced-load-test.js \
  --voters=500 \
  --category=queen \
  --url=https://green-yellow.vercel.app \
  --batch=10 \
  --delay=100
```

## 🎯 Lưu ý quan trọng

### Test trên Production
⚠️ **CẨN THẬN** khi test trên production:
- Dữ liệu sẽ được lưu thật vào database
- Có thể ảnh hưởng đến performance cho user thật
- Nên test ngoài giờ cao điểm
- Backup database trước khi test

### Test trên Local/Staging
✅ Recommend:
- Test kỹ trên local trước
- Dùng staging environment nếu có
- Kiểm tra database connection limits
- Monitor server resources (CPU, RAM)

### Rate Limiting
Nếu server có rate limiting:
- Tăng `--delay` để tránh bị block
- Giảm `--batch` size
- Test với số lượng ít hơn trước

## 📈 Phân tích kết quả

### Response Time
- **< 200ms**: Excellent
- **200-500ms**: Good
- **500ms-1s**: Acceptable
- **> 1s**: Cần optimize

### Success Rate
- **> 99%**: Excellent
- **95-99%**: Good
- **< 95%**: Cần investigation

### Throughput
- So sánh với expected traffic
- Tính toán capacity planning
- Xác định cần scale hay không

## 🛠️ Troubleshooting

### Connection Errors
```
Error: connect ECONNREFUSED
```
→ Kiểm tra server có đang chạy không

### Timeout
```
Error: Request timeout
```
→ Tăng timeout hoặc giảm batch size

### Database Errors
```
Error: MongoError: Too many connections
```
→ Kiểm tra connection pool size

### Rate Limited
```
Error: Too many requests
```
→ Tăng delay giữa các batch

## 📝 Customize Scripts

Bạn có thể modify scripts để:
- Thay đổi phân bố votes (weighted distribution)
- Add custom headers
- Simulate different user behaviors
- Add logging chi tiết hơn
- Export results to file

## 🔗 Resources

- [MongoDB Connection Limits](https://docs.mongodb.com/manual/reference/connection-string/)
- [Node.js Fetch API](https://nodejs.org/docs/latest-v18.x/api/globals.html#fetch)
- [Load Testing Best Practices](https://www.nginx.com/blog/load-testing-best-practices/)
