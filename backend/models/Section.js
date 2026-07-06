import mongoose from 'mongoose';

const KeyAchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  stat: { type: String },
  metric: { type: String },
  description: { type: String, required: true },
  icon: { type: String }
});

const TimelineMilestoneSchema = new mongoose.Schema({
  date: { type: String, required: true },
  event: { type: String, required: true },
  description: { type: String, required: true }
});

const LearnMoreSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
});

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  introduction: { type: [String], required: true }, // 2-3 paragraphs
  importance: { type: String, required: true },
  historicalContext: { type: String, required: true },
  indiasContribution: { type: String, required: true },
  interestingFacts: { type: [String], required: true }, // 5-10 facts
  keyAchievements: [KeyAchievementSchema],
  timeline: [TimelineMilestoneSchema],
  gallery: { type: [String], required: true }, // Image URLs
  learnMore: [LearnMoreSchema]
}, { timestamps: true });

export default mongoose.model('Section', SectionSchema);
