import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  stat: { type: String, required: true },
  metric: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // lucide icon name
  color: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Stats', StatSchema);
