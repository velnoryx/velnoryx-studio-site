import { useEffect, useState } from 'react';
import { Save, ArrowLeft, Section as SectionIcon, TrendingUp, Calendar, Map as MapIcon, BarChart3, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { sectionsData as fallbackSections } from '../data/fallbackData';

interface AdminPanelProps {
  onBack: () => void;
}

type TabType = 'sections' | 'economy' | 'timeline' | 'map' | 'stats';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  
  // Data States
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('intro');
  const [economy, setEconomy] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedTimelineId, setSelectedTimelineId] = useState<number>(1);
  const [mapRegions, setMapRegions] = useState<any[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string>('north');
  const [stats, setStats] = useState<any[]>([]);
  const [selectedStatId, setSelectedStatId] = useState<string>('payments');

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all database contents
  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, ecoRes, timeRes, mapRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/sections'),
        fetch('http://localhost:5000/api/economy'),
        fetch('http://localhost:5000/api/timeline'),
        fetch('http://localhost:5000/api/map'),
        fetch('http://localhost:5000/api/stats')
      ]);

      if (secRes.ok) setSections(await secRes.json());
      if (ecoRes.ok) setEconomy(await ecoRes.json());
      if (timeRes.ok) setTimeline(await timeRes.json());
      if (mapRes.ok) setMapRegions(await mapRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.warn('Backend offline or error fetching admin data, falling back to local memory simulation:', err);
      // Fallback local mock simulation
      setSections(fallbackSections);
      setTimeline([]);
      setMapRegions([]);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSection = async (section: any) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/section/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      });
      if (!res.ok) throw new Error('Failed to save section');
      
      const updated = await res.json();
      setSections(prev => prev.map(s => s.id === section.id ? updated : s));
      setSuccessMsg('Section saved successfully! Lives update active.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving section data');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEconomy = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/economy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(economy)
      });
      if (!res.ok) throw new Error('Failed to save economic data');
      
      const updated = await res.json();
      setEconomy(updated);
      setSuccessMsg('Economic statistics saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving economy data');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTimelineEvent = async (event: any) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/timeline/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (!res.ok) throw new Error('Failed to save timeline event');
      
      const updated = await res.json();
      setTimeline(prev => prev.map(e => e.id === event.id ? updated : e));
      setSuccessMsg('Timeline milestone saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving timeline milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMapRegion = async (region: any) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/map/${region.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(region)
      });
      if (!res.ok) throw new Error('Failed to save region');
      
      const updated = await res.json();
      setMapRegions(prev => prev.map(r => r.id === region.id ? updated : r));
      setSuccessMsg('Map region details saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving map region details');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStat = async (stat: any) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/stats/${stat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat)
      });
      if (!res.ok) throw new Error('Failed to save statistic');
      
      const updated = await res.json();
      setStats(prev => prev.map(s => s.id === stat.id ? updated : s));
      setSuccessMsg('Modern India statistic saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving modern India statistic');
    } finally {
      setSaving(false);
    }
  };

  // Find active items for forms
  const activeSection = sections.find(s => s.id === selectedSectionId);
  const activeTimelineEvent = timeline.find(e => e.id === selectedTimelineId);
  const activeMapRegion = mapRegions.find(r => r.id === selectedMapId);
  const activeStat = stats.find(s => s.id === selectedStatId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <div className="border-b border-white/10 bg-gray-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Live Website
          </button>
          <div className="h-6 w-px bg-white/10" />
          <h2 className="font-serif tracking-wider text-xl font-bold bg-gradient-to-r from-saffron to-gold-400 bg-clip-text text-transparent">
            Digital Museum CMS / Admin
          </h2>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] tracking-wider font-mono text-gray-400 uppercase">Live Content Mode</span>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 gap-6">
        
        {/* Left Column: Sidebar tabs */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('sections')}
            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
              activeTab === 'sections' 
                ? 'bg-gold-500 text-gray-950 shadow-lg font-bold' 
                : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <SectionIcon className="w-5 h-5" /> Detailed Sections
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
              activeTab === 'economy' 
                ? 'bg-gold-500 text-gray-950 shadow-lg font-bold' 
                : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <TrendingUp className="w-5 h-5" /> Economy Dashboard
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
              activeTab === 'timeline' 
                ? 'bg-gold-500 text-gray-950 shadow-lg font-bold' 
                : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Calendar className="w-5 h-5" /> Timeline Events
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
              activeTab === 'map' 
                ? 'bg-gold-500 text-gray-950 shadow-lg font-bold' 
                : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <MapIcon className="w-5 h-5" /> Cultural Map Zones
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
              activeTab === 'stats' 
                ? 'bg-gold-500 text-gray-950 shadow-lg font-bold' 
                : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" /> Dashboard Stats
          </button>
        </div>

        {/* Right Column: Editor Workspace */}
        <div className="flex-1 glassmorphism rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl relative min-h-[500px]">
          
          {/* Notifications */}
          {(successMsg || errorMsg) && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              successMsg 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {successMsg ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{successMsg || errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center gap-4 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
              <span className="text-xs tracking-widest font-mono">Connecting to Museum Server...</span>
            </div>
          ) : (
            <div className="flex-1 space-y-8 overflow-y-auto max-h-[70vh] pr-2">
              
              {/* TAB 1: SECTIONS FORM */}
              {activeTab === 'sections' && activeSection && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h4 className="font-serif text-lg font-bold text-white">Edit Museum Section</h4>
                    <select
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      {sections.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Section Title</label>
                      <input 
                        type="text" 
                        value={activeSection.title}
                        onChange={(e) => setSections(prev => prev.map(s => s.id === activeSection.id ? { ...s, title: e.target.value } : s))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Introduction Paragraph 1</label>
                      <textarea 
                        rows={3}
                        value={activeSection.introduction[0] || ''}
                        onChange={(e) => setSections(prev => prev.map(s => {
                          if (s.id !== activeSection.id) return s;
                          const intro = [...s.introduction];
                          intro[0] = e.target.value;
                          return { ...s, introduction: intro };
                        }))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Introduction Paragraph 2</label>
                      <textarea 
                        rows={3}
                        value={activeSection.introduction[1] || ''}
                        onChange={(e) => setSections(prev => prev.map(s => {
                          if (s.id !== activeSection.id) return s;
                          const intro = [...s.introduction];
                          intro[1] = e.target.value;
                          return { ...s, introduction: intro };
                        }))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Importance (Why This Matters)</label>
                      <textarea 
                        rows={3}
                        value={activeSection.importance}
                        onChange={(e) => setSections(prev => prev.map(s => s.id === activeSection.id ? { ...s, importance: e.target.value } : s))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Historical Context</label>
                        <textarea 
                          rows={4}
                          value={activeSection.historicalContext}
                          onChange={(e) => setSections(prev => prev.map(s => s.id === activeSection.id ? { ...s, historicalContext: e.target.value } : s))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">India's Contribution / Global Role</label>
                        <textarea 
                          rows={4}
                          value={activeSection.indiasContribution}
                          onChange={(e) => setSections(prev => prev.map(s => s.id === activeSection.id ? { ...s, indiasContribution: e.target.value } : s))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Exhibit Main Image URL</label>
                      <input 
                        type="text" 
                        value={activeSection.gallery[0] || ''}
                        onChange={(e) => setSections(prev => prev.map(s => {
                          if (s.id !== activeSection.id) return s;
                          const gal = [...s.gallery];
                          gal[0] = e.target.value;
                          return { ...s, gallery: gal };
                        }))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleSaveSection(activeSection)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-gray-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Section
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ECONOMY FORM */}
              {activeTab === 'economy' && economy && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h4 className="font-serif text-lg font-bold text-white">Edit Economy statistics & Growth Rates</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">GDP Growth Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={economy.gdpGrowth.rate}
                        onChange={(e) => setEconomy({
                          ...economy,
                          gdpGrowth: { ...economy.gdpGrowth, rate: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">GDP growth context</label>
                      <input 
                        type="text" 
                        value={economy.gdpGrowth.description}
                        onChange={(e) => setEconomy({
                          ...economy,
                          gdpGrowth: { ...economy.gdpGrowth, description: e.target.value }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Registered Unicorns Count</label>
                      <input 
                        type="number" 
                        value={economy.unicorns.count}
                        onChange={(e) => setEconomy({
                          ...economy,
                          unicorns: { ...economy.unicorns, count: parseInt(e.target.value) }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Unicorn description</label>
                      <input 
                        type="text" 
                        value={economy.unicorns.description}
                        onChange={(e) => setEconomy({
                          ...economy,
                          unicorns: { ...economy.unicorns, description: e.target.value }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">UPI Volume (Billions)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={economy.upiVolume.volume}
                        onChange={(e) => setEconomy({
                          ...economy,
                          upiVolume: { ...economy.upiVolume, volume: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">UPI volume context</label>
                      <input 
                        type="text" 
                        value={economy.upiVolume.description}
                        onChange={(e) => setEconomy({
                          ...economy,
                          upiVolume: { ...economy.upiVolume, description: e.target.value }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Total Exports ($ Billions)</label>
                      <input 
                        type="number" 
                        value={economy.exports.total}
                        onChange={(e) => setEconomy({
                          ...economy,
                          exports: { ...economy.exports, total: parseInt(e.target.value) }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Exports context</label>
                      <input 
                        type="text" 
                        value={economy.exports.description}
                        onChange={(e) => setEconomy({
                          ...economy,
                          exports: { ...economy.exports, description: e.target.value }
                        })}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={handleSaveEconomy}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-gray-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Economy Stats
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: TIMELINE FORM */}
              {activeTab === 'timeline' && activeTimelineEvent && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h4 className="font-serif text-lg font-bold text-white">Edit Historical Event</h4>
                    <select
                      value={selectedTimelineId}
                      onChange={(e) => setSelectedTimelineId(parseInt(e.target.value))}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      {timeline.map(e => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Event Title</label>
                        <input 
                          type="text" 
                          value={activeTimelineEvent.title}
                          onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, title: e.target.value } : ev))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Date / Time period</label>
                        <input 
                          type="text" 
                          value={activeTimelineEvent.date}
                          onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, date: e.target.value } : ev))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Category</label>
                        <input 
                          type="text" 
                          value={activeTimelineEvent.category}
                          onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, category: e.target.value } : ev))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Tagline / Motto</label>
                        <input 
                          type="text" 
                          value={activeTimelineEvent.tagline}
                          onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, tagline: e.target.value } : ev))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Event Image URL</label>
                      <input 
                        type="text" 
                        value={activeTimelineEvent.mainImage}
                        onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, mainImage: e.target.value } : ev))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Detailed Description</label>
                      <textarea 
                        rows={4}
                        value={activeTimelineEvent.description}
                        onChange={(e) => setTimeline(prev => prev.map(ev => ev.id === activeTimelineEvent.id ? { ...ev, description: e.target.value } : ev))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleSaveTimelineEvent(activeTimelineEvent)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-gray-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Event
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: MAP ZONE FORM */}
              {activeTab === 'map' && activeMapRegion && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h4 className="font-serif text-lg font-bold text-white">Edit Cultural Map Region</h4>
                    <select
                      value={selectedMapId}
                      onChange={(e) => setSelectedMapId(e.target.value)}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      {mapRegions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Region Name</label>
                      <input 
                        type="text" 
                        value={activeMapRegion.name}
                        onChange={(e) => setMapRegions(prev => prev.map(r => r.id === activeMapRegion.id ? { ...r, name: e.target.value } : r))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Cultural description</label>
                      <textarea 
                        rows={3}
                        value={activeMapRegion.culture}
                        onChange={(e) => setMapRegions(prev => prev.map(r => r.id === activeMapRegion.id ? { ...r, culture: e.target.value } : r))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Cuisine Specialties (comma separated)</label>
                      <input 
                        type="text" 
                        value={activeMapRegion.cuisine.join(', ')}
                        onChange={(e) => setMapRegions(prev => prev.map(r => r.id === activeMapRegion.id ? { ...r, cuisine: e.target.value.split(',').map(x => x.trim()) } : r))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Region cover Image URL</label>
                      <input 
                        type="text" 
                        value={activeMapRegion.image}
                        onChange={(e) => setMapRegions(prev => prev.map(r => r.id === activeMapRegion.id ? { ...r, image: e.target.value } : r))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Fun Fact</label>
                      <input 
                        type="text" 
                        value={activeMapRegion.fact}
                        onChange={(e) => setMapRegions(prev => prev.map(r => r.id === activeMapRegion.id ? { ...r, fact: e.target.value } : r))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleSaveMapRegion(activeMapRegion)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-gray-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Region Details
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: MODERN STATS FORM */}
              {activeTab === 'stats' && activeStat && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h4 className="font-serif text-lg font-bold text-white">Edit Modern India Indicators</h4>
                    <select
                      value={selectedStatId}
                      onChange={(e) => setSelectedStatId(e.target.value)}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      {stats.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Indicator Title</label>
                        <input 
                          type="text" 
                          value={activeStat.title}
                          onChange={(e) => setStats(prev => prev.map(s => s.id === activeStat.id ? { ...s, title: e.target.value } : s))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Big Statistic (Value)</label>
                        <input 
                          type="text" 
                          value={activeStat.stat}
                          onChange={(e) => setStats(prev => prev.map(s => s.id === activeStat.id ? { ...s, stat: e.target.value } : s))}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Metric / Subtitle</label>
                      <input 
                        type="text" 
                        value={activeStat.metric}
                        onChange={(e) => setStats(prev => prev.map(s => s.id === activeStat.id ? { ...s, metric: e.target.value } : s))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Detailed description</label>
                      <textarea 
                        rows={3}
                        value={activeStat.description}
                        onChange={(e) => setStats(prev => prev.map(s => s.id === activeStat.id ? { ...s, description: e.target.value } : s))}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-500 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleSaveStat(activeStat)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-gray-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Indicator Details
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
