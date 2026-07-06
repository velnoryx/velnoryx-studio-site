import mongoose from 'mongoose';

const ChartDataPointSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "2020" or "Jan"
  value: { type: Number, required: true },
  secondaryValue: { type: Number } // Optional secondary metric (e.g. funding)
});

const EconomySchema = new mongoose.Schema({
  gdpGrowth: {
    rate: { type: Number, required: true },
    description: { type: String, required: true },
    chartData: [ChartDataPointSchema]
  },
  unicorns: {
    count: { type: Number, required: true },
    description: { type: String, required: true },
    chartData: [ChartDataPointSchema] // year, count, funding
  },
  upiVolume: {
    volume: { type: Number, required: true },
    description: { type: String, required: true },
    chartData: [ChartDataPointSchema]
  },
  exports: {
    total: { type: Number, required: true },
    description: { type: String, required: true },
    categories: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        percentage: { type: Number, required: true }
      }
    ]
  }
}, { timestamps: true });

export default mongoose.model('Economy', EconomySchema);
