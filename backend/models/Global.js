import mongoose from 'mongoose';

const CoordsSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

const LeadershipAspectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // lucide icon name
  city: { type: String, required: true },
  coords: { type: CoordsSchema, required: true } // destination on SVG map
});

const GlobalSchema = new mongoose.Schema({
  hub: {
    name: { type: String, default: 'India' },
    coords: { type: CoordsSchema, default: { x: 250, y: 160 } }
  },
  aspects: [LeadershipAspectSchema]
}, { timestamps: true });

export default mongoose.model('Global', GlobalSchema);
