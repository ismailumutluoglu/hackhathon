import mongoose, { Document } from 'mongoose';
export interface ICertificate {
    _id?: mongoose.Types.ObjectId;
    name: string;
    issuedBy: string;
    issuedAt: Date;
    expiresAt?: Date;
    documentUrl?: string;
    badgeColor?: string;
}
export interface IProducer extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    bio: string;
    story: string;
    avatar: string;
    coverImage: string;
    location: {
        city: string;
        district: string;
        village?: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        farmName: string;
        farmSizeHectares?: number;
        farmDescription?: string;
    };
    certificates: ICertificate[];
    farmImages: string[];
    videoUrl?: string;
    specializations: string[];
    farmingMethods: string[];
    socialMedia?: {
        instagram?: string;
        youtube?: string;
        facebook?: string;
    };
    rating: number;
    reviewCount: number;
    totalOrders: number;
    isVerified: boolean;
    isActive: boolean;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Producer: mongoose.Model<IProducer, {}, {}, {}, mongoose.Document<unknown, {}, IProducer, {}, {}> & IProducer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Producer.d.ts.map