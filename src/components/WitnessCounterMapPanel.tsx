import React, { useState } from 'react';
import { WitnessMark } from '../types';
import { INITIAL_WITNESS_MARKS } from '../data/londonData';
import { MapPin, Plus, Heart, Check } from 'lucide-react';

interface WitnessCounterMapPanelProps {
  onActivateMarkingMode: () => void;
  isMarkingModeActive: boolean;
}

export const WitnessCounterMapPanel: React.FC<WitnessCounterMapPanelProps> = ({
  onActivateMarkingMode,
  isMarkingModeActive,
}) => {
  const [marks, setMarks] = useState<WitnessMark[]>(INITIAL_WITNESS_MARKS);
  const [userNote, setUserNote] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('Barnet');
  const [userRole, setUserType] = useState('Local Resident & Parent');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleAddWitnessNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNote.trim()) return;

    const newMark: WitnessMark = {
      id: `wm-${Date.now()}`,
      lat: 51.528 + (Math.random() - 0.5) * 0.1,
      lon: -0.15 + (Math.random() - 0.5) * 0.1,
      boroughName: selectedBorough,
      note: userNote.trim(),
      timestamp: new Date().toISOString().split('T')[0],
      userType: userRole,
    };

    setMarks([newMark, ...marks]);
    setUserNote('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#181714] border border-[#282520] p-5 rounded-2xl shadow-xl space-y-6 text-[#f4efe4]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#282520] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#e06c53] uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Participatory Counter-Mapping & Public Witnessing</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold font-serif">
            Witnessing the Absence (Counter-Archive)
          </h2>
          <p className="text-xs text-[#9e988a] mt-1 max-w-2xl leading-relaxed">
            Refusing to substitute missing data with speculative algorithmic guesses. Citizens leave witness marks on unmonitored dark zones to build a collective archive of attention.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="bg-[#141311] border border-[#e06c53]/40 px-4 py-2.5 rounded-xl text-right">
          <span className="text-[10px] text-[#9e988a] uppercase block font-semibold">Total Citizen Marks</span>
          <span className="text-2xl font-bold text-[#e06c53] font-mono leading-none">
            {(2614 + marks.length - 3).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Add Note Form */}
        <div className="bg-[#141311] border border-[#282520] p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#e5c158] font-serif flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Leave a Witness Mark</span>
            </h3>
            <button
              onClick={onActivateMarkingMode}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                isMarkingModeActive
                  ? 'bg-[#e06c53] text-[#141311]'
                  : 'bg-[#22201c] text-[#9e988a] hover:text-[#f4efe4]'
              }`}
            >
              {isMarkingModeActive ? 'Clicking Map Mode' : 'Pin via Map Click'}
            </button>
          </div>

          <form onSubmit={handleAddWitnessNote} className="space-y-3 text-xs">
            <div>
              <label className="text-[#9e988a] block mb-1">Target Borough / Area</label>
              <select
                value={selectedBorough}
                onChange={(e) => setSelectedBorough(e.target.value)}
                className="w-full bg-[#1d1b17] border border-[#282520] rounded-xl p-2 text-[#f4efe4] outline-none font-medium"
              >
                <option value="Barnet">Barnet (Data Desert)</option>
                <option value="Ealing">Ealing (Data Desert)</option>
                <option value="Waltham Forest">Waltham Forest (Data Desert)</option>
                <option value="Croydon">Croydon (Closed Monitors)</option>
                <option value="Barking and Dagenham">Barking & Dagenham</option>
                <option value="Sutton">Sutton</option>
                <option value="Enfield">Enfield</option>
              </select>
            </div>

            <div>
              <label className="text-[#9e988a] block mb-1">Your Perspective</label>
              <select
                value={userRole}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full bg-[#1d1b17] border border-[#282520] rounded-xl p-2 text-[#f4efe4] outline-none font-medium"
              >
                <option value="Local Resident & Parent">Local Resident & Parent</option>
                <option value="School Teacher & Educator">School Teacher & Educator</option>
                <option value="Asthma / Respiratory Patient">Asthma / Respiratory Patient</option>
                <option value="Urban Cyclist & Commuter">Urban Cyclist & Commuter</option>
                <option value="Environmental Justice Advocate">Environmental Justice Advocate</option>
              </select>
            </div>

            <div>
              <label className="text-[#9e988a] block mb-1">Witness Observation & Lived Reality</label>
              <textarea
                rows={3}
                placeholder="Describe local traffic exhaust, unmonitored school gates, or daily concerns..."
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                className="w-full bg-[#1d1b17] border border-[#282520] rounded-xl p-2 text-[#f4efe4] placeholder-[#7d786c] outline-none resize-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#e5c158] hover:bg-[#d4b047] text-[#141311] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Witness Entry</span>
            </button>

            {submittedSuccess && (
              <p className="text-[11px] text-[#7ebf69] flex items-center justify-center gap-1 mt-2">
                <Check className="w-3.5 h-3.5" /> Witness mark recorded in public archive.
              </p>
            )}
          </form>
        </div>

        {/* Right: Citizen Witness Feed */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-semibold text-sm text-[#f4efe4] font-serif border-b border-[#282520] pb-2">
            Citizen Witness Archive Feed
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {marks.map((mark) => (
              <div
                key={mark.id}
                className="bg-[#141311] border border-[#282520] p-3.5 rounded-xl text-xs space-y-2 hover:border-[#e5c158]/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#22201c] pb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e06c53]" />
                    <span className="font-semibold text-[#e5c158] font-serif">{mark.boroughName}</span>
                    <span className="text-[10px] bg-[#22201c] px-2 py-0.5 rounded text-[#9e988a]">
                      {mark.userType}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#858073] font-mono">{mark.timestamp}</span>
                </div>

                <p className="text-[#ccc6b8] italic leading-relaxed">
                  "{mark.note}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#858073] pt-1">
                  <span>Coordinates: {mark.lat.toFixed(3)}, {mark.lon.toFixed(3)}</span>
                  <button className="flex items-center gap-1 text-[#9e988a] hover:text-[#e5c158] transition-colors">
                    <Heart className="w-3 h-3" /> Acknowledge Witness
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
