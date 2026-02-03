import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  _id: string;
  candidateId: string;
  ipAddress: string;
  category: 'queen' | 'king';
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    candidateId: {
      type: String,
      required: true,
      ref: 'Candidate',
    },
    ipAddress: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['queen', 'king'],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries only (no uniqueness constraint)
VoteSchema.index({ candidateId: 1 });
VoteSchema.index({ category: 1 });

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
