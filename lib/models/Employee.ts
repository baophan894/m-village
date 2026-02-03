import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  _id: string;
  employeeCode: string; // Mã nhân viên (MV1061)
  name: string; // Họ và tên
  department: string; // Phòng ban
  hasWonPrize: boolean; // Đã trúng giải chưa
  prizeType?: string; // Loại giải đã trúng
  wonAt?: Date; // Thời gian trúng giải
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeCode: {
      type: String,
      required: [true, 'Vui lòng nhập mã nhân viên'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên nhân viên'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Vui lòng nhập phòng ban'],
      trim: true,
    },
    hasWonPrize: {
      type: Boolean,
      default: false,
    },
    prizeType: {
      type: String,
      enum: ['special', 'first', 'second', 'third', 'consolation'],
    },
    wonAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
EmployeeSchema.index({ employeeCode: 1 });
EmployeeSchema.index({ hasWonPrize: 1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
