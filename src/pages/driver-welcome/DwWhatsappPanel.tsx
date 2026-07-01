import React from 'react';

export const DwWhatsappPanel: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-4xl text-gray-400">info</span>
        <h2 className="text-xl font-bold text-gray-800">This feature is coming soon</h2>
        <p className="text-sm text-gray-500">The WhatsApp integration panel is currently under development.</p>
      </div>
    </div>
  );
};

export default DwWhatsappPanel;
