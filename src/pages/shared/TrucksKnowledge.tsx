import React from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Trucks Knowledge — training PDFs for every caller desk (DWC / WCT / MM).
 * A list of titles; clicking one opens that PDF inside the CRM (browser's
 * built-in viewer in an iframe), not as a download. The open document is kept
 * in ?doc= so the browser Back button returns to the list.
 *
 * PDFs live in Web_CRM/public/training and ship with the build.
 */

interface KnowledgeDoc {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  icon: string;
}

const DOCS: KnowledgeDoc[] = [
  {
    id: 'complete-truck-knowledge',
    title: 'Complete Truck Knowledge for Telecalling Team',
    subtitle: 'Truck types, body types, axles, models, documents & job matching',
    file: 'complete-truck-knowledge.pdf',
    icon: 'local_shipping',
  },
  {
    id: 'employee-training-hindi',
    title: 'TruckMitr Employee Training (Hindi)',
    subtitle: 'हिंदी में कर्मचारी प्रशिक्षण गाइड',
    file: 'employee-training-hindi.pdf',
    icon: 'school',
  },
  {
    id: 'truckmitr-trucking-ecosystem',
    title: "TruckMitr — Revolutionising India's Trucking Ecosystem",
    subtitle: 'Company overview, mission & how the platform works',
    file: 'truckmitr-trucking-ecosystem.pdf',
    icon: 'hub',
  },
];

const pdfUrl = (file: string) => `${import.meta.env.BASE_URL}training/${file}`;

const TrucksKnowledge: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const active = DOCS.find((d) => d.id === params.get('doc')) ?? null;

  const open = (id: string) => setParams({ doc: id });
  const close = () => setParams({});

  if (active) {
    return (
      // Exactly fills the layout's content area (100vh − 56px topbar − 2×12px
      // padding) so there's no outer scroll and the PDF gets every pixel —
      // agents are on 1366×768 screens.
      <div className="h-[calc(100vh-80px)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 border-b border-slate-200 shrink-0">
          <button
            onClick={close}
            className="flex items-center gap-1 text-[12px] font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md px-2 py-0.5 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
          </button>
          <span className="material-symbols-outlined text-[18px] text-indigo-600 shrink-0">picture_as_pdf</span>
          <span className="flex-1 min-w-0 truncate text-sm font-bold text-slate-800">{active.title}</span>
        </div>
        <iframe
          key={active.id}
          // Fit one whole page on screen: `view=Fit` for Chrome/Edge,
          // `zoom=page-fit` for Firefox; each viewer ignores the other's.
          src={`${pdfUrl(active.file)}#zoom=page-fit&view=Fit&pagemode=none`}
          title={active.title}
          className="flex-1 min-h-0 w-full border-0 bg-slate-100"
        />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-200 text-slate-800 font-bold text-sm">
          <span className="material-symbols-outlined text-[18px] text-indigo-600">menu_book</span>
          Trucks Knowledge
        </div>
        <div className="p-3 sm:p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOCS.map((d) => (
            <button
              key={d.id}
              onClick={() => open(d.id)}
              className="group text-left flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[28px] text-indigo-600 shrink-0">{d.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] font-bold text-slate-800 group-hover:text-indigo-700">{d.title}</span>
                <span className="block text-[11.5px] text-slate-500 mt-1">{d.subtitle}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 mt-2">
                  <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span> Open PDF
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrucksKnowledge;
