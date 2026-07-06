import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Section from './models/Section.js';
import Economy from './models/Economy.js';
import Global from './models/Global.js';
import Culture from './models/Culture.js';
import Timeline from './models/Timeline.js';
import Map from './models/Map.js';
import Stats from './models/Stats.js';

import {
  sectionsData,
  economyData,
  globalData,
  cultureData,
  timelineEvents,
  mapRegionsData,
  statsData
} from './data/seedData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/india_db';

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected! Clearing existing data...');

    await Section.deleteMany({});
    await Economy.deleteMany({});
    await Global.deleteMany({});
    await Culture.deleteMany({});
    await Timeline.deleteMany({});
    await Map.deleteMany({});
    await Stats.deleteMany({});

    console.log('Seeding new data...');
    await Section.insertMany(sectionsData);
    await Economy.create(economyData);
    await Global.create(globalData);
    await Culture.create(cultureData);
    await Timeline.insertMany(timelineEvents);
    await Map.insertMany(mapRegionsData);
    await Stats.insertMany(statsData);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
