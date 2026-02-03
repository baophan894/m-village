import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  _id: string;
  name: string;
  image: string;
  cloudinaryId: string;
  category: 'queen' | 'king';
  votes: number;
  lastVotedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['queen', 'king'],
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    lastVotedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
