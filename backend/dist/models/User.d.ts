import mongoose, { Document } from 'mongoose';
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map