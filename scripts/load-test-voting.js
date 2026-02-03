/**
 * Script test voting với 500 người
 * Chạy: node scripts/load-test-voting.js
 */

const BASE_URL = 'https://green-yellow.vercel.app'; // Thay đổi nếu cần
const CATEGORY = 'queen'; // hoặc 'king'
const NUM_VOTERS = 500;

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  try {
    const response = await fetch(`${BASE_URL}/api/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Mô phỏng IP khác nhau cho mỗi voter
        'X-Forwarded-For': `192.168.${Math.floor(voterIndex / 255)}.${voterIndex % 255}`,
      },
      body: JSON.stringify({
        candidateId,
        category: CATEGORY,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true, votes: data.votes };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main function
async function runLoadTest() {
  console.log(`🚀 Bắt đầu test voting với ${NUM_VOTERS} người...`);
  console.log(`📍 URL: ${BASE_URL}`);
  console.log(`👑 Category: ${CATEGORY}`);
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
    console.log(`   ${idx + 1}. ${c.name} (${c.votes} votes)`);
  });
  console.log('');

  // Phân bố vote ngẫu nhiên cho các candidates
  const voteDistribution = {};
  candidates.forEach(c => {
    voteDistribution[c._id] = 0;
  });

  // Thống kê
  let successCount = 0;
  let failCount = 0;

  console.log(`🎯 Bắt đầu gửi ${NUM_VOTERS} votes...`);
  console.log('');

  // Gửi votes với batches để tránh quá tải
  const BATCH_SIZE = 10; // Số requests đồng thời
  const BATCH_DELAY = 100; // ms delay giữa các batch

  for (let i = 0; i < NUM_VOTERS; i += BATCH_SIZE) {
    const batchPromises = [];
    
    for (let j = 0; j < BATCH_SIZE && (i + j) < NUM_VOTERS; j++) {
      const voterIndex = i + j;
      // Random chọn một candidate để vote
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      voteDistribution[randomCandidate._id]++;
      
      batchPromises.push(
        vote(randomCandidate._id, voterIndex).then(result => {
          if (result.success) {
            successCount++;
            if ((voterIndex + 1) % 50 === 0) {
              console.log(`   ✓ ${voterIndex + 1}/${NUM_VOTERS} votes completed`);
            }
          } else {
            failCount++;
            console.log(`   ✗ Vote ${voterIndex + 1} failed: ${result.error}`);
          }
          return result;
        })
      );
    }

    await Promise.all(batchPromises);
    
    // Delay giữa các batch
    if (i + BATCH_SIZE < NUM_VOTERS) {
      await delay(BATCH_DELAY);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('📊 KẾT QUẢ TEST');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Thành công: ${successCount}/${NUM_VOTERS}`);
  console.log(`❌ Thất bại: ${failCount}/${NUM_VOTERS}`);
  console.log(`📈 Tỷ lệ thành công: ${((successCount / NUM_VOTERS) * 100).toFixed(2)}%`);
  console.log('');
  console.log('📊 Phân bố votes (dự kiến):');
  candidates.forEach(c => {
    const expectedVotes = voteDistribution[c._id];
    const percentage = ((expectedVotes / NUM_VOTERS) * 100).toFixed(1);
    console.log(`   ${c.name}: ${expectedVotes} votes (${percentage}%)`);
  });
  console.log('');
  console.log('💡 Tip: Refresh trang để xem kết quả thực tế!');
  console.log('═══════════════════════════════════════');
}

// Chạy test
runLoadTest().catch(console.error);
