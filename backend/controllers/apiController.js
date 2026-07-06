import Section from '../models/Section.js';
import Economy from '../models/Economy.js';
import Global from '../models/Global.js';
import Culture from '../models/Culture.js';
import Timeline from '../models/Timeline.js';
import Map from '../models/Map.js';
import Stats from '../models/Stats.js';
import mongoose from 'mongoose';

import {
  sectionsData as defaultSections,
  economyData as defaultEconomy,
  globalData as defaultGlobal,
  cultureData as defaultCulture,
  timelineEvents as defaultTimeline,
  mapRegionsData as defaultMap,
  statsData as defaultStats
} from '../data/seedData.js';

// In-Memory storage fallbacks (copy of seed data)
let localSections = JSON.parse(JSON.stringify(defaultSections));
let localEconomy = JSON.parse(JSON.stringify(defaultEconomy));
let localGlobal = JSON.parse(JSON.stringify(defaultGlobal));
let localCulture = JSON.parse(JSON.stringify(defaultCulture));
let localTimeline = JSON.parse(JSON.stringify(defaultTimeline));
let localMap = JSON.parse(JSON.stringify(defaultMap));
let localStats = JSON.parse(JSON.stringify(defaultStats));

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET Handlers
export const getSections = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const sections = await Section.find({});
      res.json(sections);
    } else {
      res.json(localSections);
    }
  } catch (error) {
    next(error);
  }
};

export const getSectionById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const section = await Section.findOne({ id: req.params.id });
      if (!section) {
        return res.status(404).json({ message: 'Section not found' });
      }
      res.json(section);
    } else {
      const section = localSections.find(s => s.id === req.params.id);
      if (!section) {
        return res.status(404).json({ message: 'Section not found (Memory)' });
      }
      res.json(section);
    }
  } catch (error) {
    next(error);
  }
};

export const getEconomy = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const economy = await Economy.findOne({});
      // If DB is connected but not seeded yet, return local
      if (!economy) return res.json(localEconomy);
      res.json(economy);
    } else {
      res.json(localEconomy);
    }
  } catch (error) {
    next(error);
  }
};

export const getGlobal = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const global = await Global.findOne({});
      if (!global) return res.json(localGlobal);
      res.json(global);
    } else {
      res.json(localGlobal);
    }
  } catch (error) {
    next(error);
  }
};

export const getCulture = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const culture = await Culture.findOne({});
      if (!culture) return res.json(localCulture);
      res.json(culture);
    } else {
      res.json(localCulture);
    }
  } catch (error) {
    next(error);
  }
};

export const getTimeline = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const events = await Timeline.find({}).sort({ id: 1 });
      res.json(events);
    } else {
      res.json(localTimeline);
    }
  } catch (error) {
    next(error);
  }
};

export const getMap = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const regions = await Map.find({});
      res.json(regions);
    } else {
      res.json(localMap);
    }
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const stats = await Stats.find({});
      res.json(stats);
    } else {
      res.json(localStats);
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE Handlers (For Admin Panel)
export const updateSection = async (req, res, next) => {
  try {
    // 1. Update Memory
    const idx = localSections.findIndex(s => s.id === req.params.id);
    if (idx !== -1) {
      localSections[idx] = { ...localSections[idx], ...req.body };
    }
    
    // 2. Update DB if connected
    if (isDbConnected()) {
      const section = await Section.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!section) {
        return res.status(404).json({ message: 'Section not found in DB' });
      }
      return res.json(section);
    }
    
    res.json(localSections[idx] || { message: 'Updated in Memory' });
  } catch (error) {
    next(error);
  }
};

export const updateEconomy = async (req, res, next) => {
  try {
    localEconomy = { ...localEconomy, ...req.body };
    
    if (isDbConnected()) {
      const economy = await Economy.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
      return res.json(economy);
    }
    res.json(localEconomy);
  } catch (error) {
    next(error);
  }
};

export const updateGlobal = async (req, res, next) => {
  try {
    localGlobal = { ...localGlobal, ...req.body };
    
    if (isDbConnected()) {
      const global = await Global.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
      return res.json(global);
    }
    res.json(localGlobal);
  } catch (error) {
    next(error);
  }
};

export const updateCulture = async (req, res, next) => {
  try {
    localCulture = { ...localCulture, ...req.body };
    
    if (isDbConnected()) {
      const culture = await Culture.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
      return res.json(culture);
    }
    res.json(localCulture);
  } catch (error) {
    next(error);
  }
};

export const updateTimelineEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const idx = localTimeline.findIndex(e => e.id === id);
    if (idx !== -1) {
      localTimeline[idx] = { ...localTimeline[idx], ...req.body };
    }

    if (isDbConnected()) {
      const event = await Timeline.findOneAndUpdate(
        { id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!event) {
        return res.status(404).json({ message: 'Event not found in DB' });
      }
      return res.json(event);
    }
    res.json(localTimeline[idx] || { message: 'Updated in Memory' });
  } catch (error) {
    next(error);
  }
};

export const updateMapRegion = async (req, res, next) => {
  try {
    const idx = localMap.findIndex(r => r.id === req.params.id);
    if (idx !== -1) {
      localMap[idx] = { ...localMap[idx], ...req.body };
    }

    if (isDbConnected()) {
      const region = await Map.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!region) {
        return res.status(404).json({ message: 'Region not found in DB' });
      }
      return res.json(region);
    }
    res.json(localMap[idx] || { message: 'Updated in Memory' });
  } catch (error) {
    next(error);
  }
};

export const updateStat = async (req, res, next) => {
  try {
    const idx = localStats.findIndex(s => s.id === req.params.id);
    if (idx !== -1) {
      localStats[idx] = { ...localStats[idx], ...req.body };
    }

    if (isDbConnected()) {
      const stat = await Stats.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!stat) {
        return res.status(404).json({ message: 'Stat not found in DB' });
      }
      return res.json(stat);
    }
    res.json(localStats[idx] || { message: 'Updated in Memory' });
  } catch (error) {
    next(error);
  }
};
