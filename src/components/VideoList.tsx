import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentItem } from '../types';
import { Play, FileText, ChevronRight } from 'lucide-react';
import WhatsAppPopup from './WhatsAppPopup';

interface VideoListProps {
  videos: ContentItem[];
  currentVideoId: string;
  onSelect: (video: ContentItem) => void;
}

export default function VideoList({ videos, currentVideoId, onSelect }: VideoListProps) {
  const [activeTab, setActiveTab] = useState<'lectures' | 'pdf'>('lectures');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return videos.filter(item => 
      activeTab === 'lectures' ? item.type === 'video' : item.type === 'pdf'
    );
  }, [videos, activeTab]);

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const handleContinue = () => {
    if (selectedItem) {
      onSelect(selectedItem);
    }
    setIsPopupOpen(false);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      <WhatsAppPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onContinue={handleContinue}
        actionText={selectedItem?.type === 'pdf' ? "Continue to PDF" : "Continue to Video Lecture"}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-[#0f1014] p-1 rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'lectures' 
              ? 'bg-accent text-white shadow-lg shadow-accent/20' 
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          Lectures
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'pdf' 
              ? 'bg-accent text-white shadow-lg shadow-accent/20' 
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          PDF
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              {filteredItems.map((item, index) => {
                const isActive = item.id === currentVideoId;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group flex items-center gap-4 p-3 bg-[#0f1014] border border-white/5 rounded-xl transition-all hover:bg-[#16181d] active:scale-[0.99] text-left ${
                      isActive ? 'border-accent/50 bg-accent/5' : ''
                    }`}
                  >
                    {/* Play Icon Circle */}
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 transition-colors">
                      <Play className={`w-4 h-4 ${isActive ? 'text-accent fill-accent' : 'text-zinc-400 group-hover:text-accent'}`} />
                    </div>
                    
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[13px] font-bold leading-snug truncate ${isActive ? 'text-accent' : 'text-white/90'}`}>
                        {item.title}
                      </h4>
                    </div>
                    
                    {/* Document Icon */}
                    <div className="flex-shrink-0 mr-2">
                      <FileText className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-zinc-600"
            >
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">No {activeTab} available</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

