import express from 'express';
import {
  getSections,
  getSectionById,
  getEconomy,
  getGlobal,
  getCulture,
  getTimeline,
  getMap,
  getStats,
  updateSection,
  updateEconomy,
  updateGlobal,
  updateCulture,
  updateTimelineEvent,
  updateMapRegion,
  updateStat
} from '../controllers/apiController.js';

const router = express.Router();

// GET routes
router.get('/sections', getSections);
router.get('/section/:id', getSectionById);
router.get('/economy', getEconomy);
router.get('/global', getGlobal);
router.get('/culture', getCulture);
router.get('/timeline', getTimeline);
router.get('/map', getMap);
router.get('/stats', getStats);

// PUT admin routes
router.put('/section/:id', updateSection);
router.put('/economy', updateEconomy);
router.put('/global', updateGlobal);
router.put('/culture', updateCulture);
router.put('/timeline/:id', updateTimelineEvent);
router.put('/map/:id', updateMapRegion);
router.put('/stats/:id', updateStat);

export default router;
