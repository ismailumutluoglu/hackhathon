import mongoose, { Document, Schema } from 'mongoose';

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
    coordinates: { lat: number; lng: number };
    farmName: string;
    farmSizeHectares?: number;
    farmDescription?: string;
  };
  certificates: ICertificate[];
  farmImages: string[];
  videoUrl?: string;
  specializations: string[];
  farmingMethods: string[];
  socialMedia?: { instagram?: string; youtube?: string; facebook?: string };
  rating: number;
  reviewCount: number;
  totalOrders: number;
  isVerified: boolean;
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>({
  name:        { type: String, required: true },
  issuedBy:    { type: String, required: true },
  issuedAt:    { type: Date, required: true },
  expiresAt:   { type: Date },
  documentUrl: { type: String },
  badgeColor:  { type: String, default: '#4CAF50' },
}, { _id: true });

const ProducerSchema = new Schema<IProducer>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User' },
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true },
    bio:              { type: String, required: true, maxlength: 300 },
    story:            { type: String, required: true },
    avatar:           { type: String, required: true },
    coverImage:       { type: String, required: true },
    location: {
      city:              { type: String, required: true },
      district:          { type: String, required: true },
      village:           String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      farmName:          { type: String, required: true },
      farmSizeHectares:  Number,
      farmDescription:   String,
    },
    certificates:     { type: [CertificateSchema], default: [] },
    farmImages:       { type: [String], default: [] },
    videoUrl:         String,
    specializations:  { type: [String], default: [] },
    farmingMethods:   { type: [String], default: [] },
    socialMedia: {
      instagram: String,
      youtube:   String,
      facebook:  String,
    },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
    totalOrders:  { type: Number, default: 0 },
    isVerified:   { type: Boolean, default: false },
    isActive:     { type: Boolean, default: true },
    joinedAt:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProducerSchema.index({ slug: 1 });
ProducerSchema.index({ 'location.city': 1 });
ProducerSchema.index({ isVerified: 1, isActive: 1 });

export const Producer = mongoose.model<IProducer>('Producer', ProducerSchema);
