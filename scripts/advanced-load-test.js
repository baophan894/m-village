/**
 * Advanced Load Test Script cho Voting System
 * 
 * Cách sử dụng:
 * node scripts/advanced-load-test.js --voters=500 --category=queen --url=https://green-yellow.vercel.app
 * 
 * Options:
 * --voters: Số lượng voters (mặc định: 500)
 * --category: queen hoặc king (mặc định: queen)
 * --url: Base URL (mặc định: http://localhost:3000)
 * --batch: Batch size (mặc định: 10)
 * --delay: Delay giữa các batch ms (mặc định: 100)
 * --target: ID của candidate cụ thể để vote (nếu muốn test 1 candidate)
 */

// Parse arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=');
  acc[key] = value;
  return acc;
}, {});

const BASE_URL = args.url || 'http://localhost:3000';
const CATEGORY = args.category || 'queen';
const NUM_VOTERS = parseInt(args.voters) || 500;
const BATCH_SIZE = parseInt(args.batch) || 10;
const BATCH_DELAY = parseInt(args.delay) || 100;
const TARGET_CANDIDATE = args.target || null;

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Progress bar
function drawProgressBar(current, total, barLength = 40) {
  const progress = current / total;
  const filledLength = Math.round(barLength * progress);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  const percentage = (progress * 100).toFixed(1);
  return `[${bar}] ${percentage}% (${current}/${total})`;
}

// Hàm lấy danh sách candidates
async function getCandidates() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/candidates?category=${CATEGORY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

// Hàm vote cho một candidate
async function vote(candidateId, voterIndex) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': `10.${Math.floor(voterIndex / 65536)}.${Math.floor((voterIndex % 65536) / 256)}.${voterIndex % 256}`,
        'User-Agent': `LoadTestBot/${voterIndex}`,
      },
      body: JSON.stringify({
        candidateId,
        category: CATEGORY,
      }),
    });

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    if (data.success) {
      return { 
        success: true, 
        votes: data.votes, 
        responseTime,
        candidateId 
      };
    } else {
      return { 
        success: false, 
        error: data.error, 
        responseTime,
        candidateId 
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { 
      success: false, 
      error: error.message, 
      responseTime,
      candidateId 
    };
  }
}

// Main function
async function runAdvancedLoadTest() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        VOTING LOAD TEST - ADVANCED VERSION             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📍 URL:       ${BASE_URL}`);
  console.log(`👑 Category:  ${CATEGORY}`);
  console.log(`👥 Voters:    ${NUM_VOTERS}`);
  console.log(`📦 Batch:     ${BATCH_SIZE} concurrent requests`);
  console.log(`⏱️  Delay:     ${BATCH_DELAY}ms between batches`);
  console.log('');

  // Lấy danh sách candidates
  console.log('📋 Đang lấy danh sách candidates...');
  const candidates = await getCandidates();
  
  if (!candidates || candidates.length === 0) {
    console.error('❌ Không tìm thấy candidates!');
    return;
  }

  console.log(`✅ Tìm thấy ${candidates.length} candidates:`);
  candidates.forEach((c, idx) => {
    console.log(`   ${idx + 1}. ${c.name.padEnd(30)} (${c.votes} votes)`);
  });
  console.log('');

  // Check target candidate
  let targetCandidate = null;
  if (TARGET_CANDIDATE) {
    targetCandidate = candidates.find(c => c._id === TARGET_CANDIDATE);
    if (targetCandidate) {
      console.log(`🎯 Test mode: Tất cả votes sẽ vote cho "${targetCandidate.name}"`);
      console.log('');
    } else {
      console.error(`❌ Không tìm thấy candidate với ID: ${TARGET_CANDIDATE}`);
      return;
    }
  }

  // Statistics
  const stats = {
    success: 0,
    fail: 0,
    responseTimes: [],
    voteDistribution: {},
    errors: {},
  };

  candidates.forEach(c => {
    stats.voteDistribution[c._id] = { name: c.name, count: 0 };
  });

  console.log(`🎯 Bắt đầu gửi ${NUM_VOTERS} votes...`);
  console.log('');

  const testStartTime = Date.now();

  // Gửi votes với batches
  for (let i = 0; i < NUM_VOTERS; i += BATCH_SIZE) {
    const batchPromises = [];
    
    for (let j = 0; j < BATCH_SIZE && (i + j) < NUM_VOTERS; j++) {
      const voterIndex = i + j;
      
      // Chọn candidate để vote
      let selectedCandidate;
      if (targetCandidate) {
        selectedCandidate = targetCandidate;
      } else {
        // Random chọn candidate với phân bố tự nhiên hơn
        const weights = candidates.map((_, idx) => Math.pow(candidates.length - idx, 2));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let k = 0; k < weights.length; k++) {
          random -= weights[k];
          if (random <= 0) {
            selectedIndex = k;
            break;
          }
        }
        
        selectedCandidate = candidates[selectedIndex];
      }
      
      stats.voteDistribution[selectedCandidate._id].count++;
      
      batchPromises.push(
        vote(selectedCandidate._id, voterIndex).then(result => {
          if (result.success) {
            stats.success++;
            stats.responseTimes.push(result.responseTime);
          } else {
            stats.fail++;
            const errorKey = result.error || 'Unknown error';
            stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
          }
          return result;
        })
      );
    }

    await Promise.all(batchPromises);
    
    // Update progress
    const completed = Math.min(i + BATCH_SIZE, NUM_VOTERS);
    process.stdout.write('\r' + drawProgressBar(completed, NUM_VOTERS));
    
    // Delay giữa các batch
    if (i + BATCH_SIZE < NUM_VOTERS) {
      await delay(BATCH_DELAY);
    }
  }

  const totalTestTime = Date.now() - testStartTime;

  console.log('\n');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                     KẾT QUẢ TEST                       ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Success/Fail stats
  console.log('📊 THỐNG KÊ TỔNG QUÁT:');
  console.log(`   ✅ Thành công:     ${stats.success}/${NUM_VOTERS} (${((stats.success / NUM_VOTERS) * 100).toFixed(2)}%)`);
  console.log(`   ❌ Thất bại:       ${stats.fail}/${NUM_VOTERS} (${((stats.fail / NUM_VOTERS) * 100).toFixed(2)}%)`);
  console.log(`   ⏱️  Tổng thời gian: ${(totalTestTime / 1000).toFixed(2)}s`);
  console.log(`   ⚡ Throughput:     ${(NUM_VOTERS / (totalTestTime / 1000)).toFixed(2)} votes/s`);
  console.log('');

  // Response time stats
  if (stats.responseTimes.length > 0) {
    stats.responseTimes.sort((a, b) => a - b);
    const avgResponseTime = stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length;
    const minResponseTime = stats.responseTimes[0];
    const maxResponseTime = stats.responseTimes[stats.responseTimes.length - 1];
    const p50 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.5)];
    const p95 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.95)];
    const p99 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.99)];

    console.log('⏱️  RESPONSE TIME:');
    console.log(`   Min:     ${minResponseTime}ms`);
    console.log(`   Average: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`   P50:     ${p50}ms`);
    console.log(`   P95:     ${p95}ms`);
    console.log(`   P99:     ${p99}ms`);
    console.log(`   Max:     ${maxResponseTime}ms`);
    console.log('');
  }

  // Vote distribution
  console.log('📊 PHÂN BỐ VOTES:');
  const sortedDistribution = Object.values(stats.voteDistribution)
    .sort((a, b) => b.count - a.count);
  
  sortedDistribution.forEach((item, idx) => {
    const percentage = ((item.count / NUM_VOTERS) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(item.count / NUM_VOTERS * 30));
    console.log(`   ${(idx + 1).toString().padStart(2)}. ${item.name.padEnd(25)} ${item.count.toString().padStart(4)} (${percentage.padStart(5)}%) ${bar}`);
  });
  console.log('');

  // Errors
  if (Object.keys(stats.errors).length > 0) {
    console.log('❌ ERRORS:');
    Object.entries(stats.errors).forEach(([error, count]) => {
      console.log(`   ${error}: ${count} occurrences`);
    });
    console.log('');
  }

  console.log('💡 Tip: Refresh trang hoặc kiểm tra database để xem kết quả thực tế!');
  console.log('╚════════════════════════════════════════════════════════╝');
}

// Chạy test
runAdvancedLoadTest().catch(console.error);
