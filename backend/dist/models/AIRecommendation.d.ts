import mongoose, { Document } from 'mongoose';
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
    tokensUsed: {
        input: number;
        output: number;
        total: number;
    };
    processingTimeMs: number;
    cost?: number;
    isSuccessful: boolean;
    errorMessage?: string;
    userRating?: number;
    userFeedback?: string;
    createdAt: Date;
}
export declare const AIRecommendation: mongoose.Model<IAIRecommendation, {}, {}, {}, mongoose.Document<unknown, {}, IAIRecommendation, {}, {}> & IAIRecommendation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AIRecommendation.d.ts.map