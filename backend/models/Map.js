import mongoose from 'mongoose';

const RegionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  coords: {
    x: { type: Number },
    y: { type: Number }
  },
  culture: { type: String, required: true },
  attractions: { type: [String], required: true },
  festivals: { type: [String], required: true },
  cuisine: { type: [String], required: true },
  fact: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Map', RegionSchema);
