import mongoose from 'mongoose';

const CultureAspectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true }, // lucide icon name
  title: { type: String, required: true },
  description: { type: String, required: true },
  colorClass: { type: String, required: true },
  glowClass: { type: String, required: true },
  bgGradient: { type: String, required: true },
  stats: { type: String, required: true }
});

const CultureSchema = new mongoose.Schema({
  aspects: [CultureAspectSchema]
}, { timestamps: true });

export default mongoose.model('Culture', CultureSchema);
