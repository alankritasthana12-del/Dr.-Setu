import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVitals {
  temp: number;
  bp: string;
  pulse: number;
  spO2: number;
}

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
  contact: string;
  symptoms: string[];
  vitals: IVitals;
  aiSummary: string;
  recommendedFirstAid: string;
  aiPrescription?: string;
  doctorNotes?: string;
  requiresDoctor: boolean;
  triageLevel: 'RED' | 'YELLOW' | 'GREEN';
  status: 'waiting' | 'in-consultation' | 'completed';
  videoRoomUrl?: string;
  imageUrl?: string;
  workerId?: string;
  preferredLanguage?: string;
}

const PatientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, default: 'N/A' },
    symptoms: { type: [String], default: [] },
    vitals: {
      temp: { type: Number },
      bp: { type: String },
      pulse: { type: Number },
      spO2: { type: Number },
    },
    aiSummary: { type: String, default: '' },
    recommendedFirstAid: { type: String, default: '' },
    aiPrescription: { type: String, default: '' },
    doctorNotes: { type: String, default: '' },
    requiresDoctor: { type: Boolean, default: false },
    triageLevel: {
      type: String,
      enum: ['RED', 'YELLOW', 'GREEN'],
      default: 'GREEN',
    },
    status: {
      type: String,
      enum: ['waiting', 'in-consultation', 'completed'],
      default: 'waiting',
    },
    videoRoomUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    workerId: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'EN' },
  },
  {
    timestamps: true,
  }
);

const Patient: Model<IPatient> =
  mongoose.models.Patient ||
  mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
