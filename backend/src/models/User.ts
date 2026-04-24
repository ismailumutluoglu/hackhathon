import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface IHealthProfile {
  conditions: string[];
  goals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  age?: number;
  weight?: number;
  height?: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'admin' | 'producer';
  avatar?: string;
  addresses: IAddress[];
  healthProfile: IHealthProfile;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  title:        { type: String, required: true },
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  city:         { type: String, required: true },
  district:     { type: String, required: true },
  neighborhood: { type: String, required: true },
  fullAddress:  { type: String, required: true },
  isDefault:    { type: Boolean, default: false },
}, { _id: true });

const HealthProfileSchema = new Schema<IHealthProfile>({
  conditions:          { type: [String], default: [] },
  goals:               { type: [String], default: [] },
  dietaryRestrictions: { type: [String], default: [] },
  allergies:           { type: [String], default: [] },
  age:    { type: Number, min: 1, max: 120 },
  weight: { type: Number, min: 20, max: 300 },
  height: { type: Number, min: 50, max: 250 },
}, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true, minlength: 8, select: false },
    phone:           { type: String, trim: true },
    role:            { type: String, enum: ['customer', 'admin', 'producer'], default: 'customer' },
    avatar:          { type: String },
    addresses:       { type: [AddressSchema], default: [] },
    healthProfile:   { type: HealthProfileSchema, default: () => ({ conditions: [], goals: [], dietaryRestrictions: [], allergies: [] }) },
    isEmailVerified: { type: Boolean, default: false },
    isActive:        { type: Boolean, default: true },
    lastLogin:       { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
