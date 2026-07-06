import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  tagline: { type: String, required: true },
  mainImage: { type: String, required: true },
  description: { type: String, required: true },
  gallery: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.model('Timeline', TimelineEventSchema);
