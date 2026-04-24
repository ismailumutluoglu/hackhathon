import mongoose, { Document, Schema } from 'mongoose';

export interface IAIRecommendation extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  sessionId: string;
  healthProfileSnapshot: {
    conditions: string[];
    goals: string[];
    dietaryRestrictions: string[];
    allergies: string[];
    age?: number;
    weight?: number;
    height?: number;
  };
  userQuery?: string;
  builtPrompt: string;
  response: {
    recommendations: {
      product: mongoose.Types.ObjectId;
      productName: string;
      reason: string;
      benefitScore: number;
    }[];
    avoidList: {
      product: mongoose.Types.ObjectId;
      productName: string;
      reason: string;
    }[];
    summary: string;
    dietaryAdvice: string;
    disclaimer: string;
  };
  aiProvider: 'openai' | 'anthropic';
  aiModel: string;
  tokensUsed: { input: number; output: number; total: number };
  processingTimeMs: number;
  cost?: number;
  isSuccessful: boolean;
  errorMessage?: string;
  userRating?: number;
  userFeedback?: string;
  createdAt: Date;
}

const AIRecommendationSchema = new Schema<IAIRecommendation>(
  {
    user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true },
    healthProfileSnapshot: {
      conditions:          [String],
      goals:               [String],
      dietaryRestrictions: [String],
      allergies:           [String],
      age:    Number,
      weight: Number,
      height: Number,
    },
    userQuery:   String,
    builtPrompt: { type: String, required: true, select: false },
    response: {
      recommendations: [{
        product:      { type: Schema.Types.ObjectId, ref: 'Product' },
        productName:  String,
        reason:       String,
        benefitScore: Number,
      }],
      avoidList: [{
        product:     { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        reason:      String,
      }],
      summary:       String,
      dietaryAdvice: String,
      disclaimer:    { type: String, default: 'Bu öneriler tıbbi tavsiye değildir. Lütfen doktorunuza danışın.' },
    },
    aiProvider: { type: String, enum: ['openai', 'anthropic'], required: true },
    aiModel:    { type: String, required: true },
    tokensUsed: {
      input:  { type: Number, default: 0 },
      output: { type: Number, default: 0 },
      total:  { type: Number, default: 0 },
    },
    processingTimeMs: { type: Number, required: true },
    cost:             Number,
    isSuccessful:     { type: Boolean, required: true },
    errorMessage:     String,
    userRating:       { type: Number, min: 1, max: 5 },
    userFeedback:     String,
  },
  { timestamps: true }
);

AIRecommendationSchema.index({ user: 1, createdAt: -1 });
AIRecommendationSchema.index({ isSuccessful: 1 });

export const AIRecommendation = mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
