const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Simple .env parser (no dotenv needed)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}
loadEnv();

const VotingSessionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['queen', 'king'],
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const VotingSession = mongoose.models.VotingSession || mongoose.model('VotingSession', VotingSessionSchema);

async function enableVoting() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Enable voting for both categories
    await VotingSession.updateOne(
      { category: 'queen' },
      { $set: { isActive: true } },
      { upsert: true }
    );
    console.log('✅ Enabled voting for Queen category');

    await VotingSession.updateOne(
      { category: 'king' },
      { $set: { isActive: true } },
      { upsert: true }
    );
    console.log('✅ Enabled voting for King category');

    console.log('\n🎉 Voting is now enabled for all categories!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

enableVoting();
