import mongoose, { Schema, Document } from 'mongoose';

export interface IVotingSession extends Document {
  _id: string;
  category: 'queen' | 'king';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VotingSessionSchema = new Schema<IVotingSession>(
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

export default mongoose.models.VotingSession || mongoose.model<IVotingSession>('VotingSession', VotingSessionSchema);
