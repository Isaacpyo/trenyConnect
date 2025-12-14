import React from 'react';
import { Truck, Map, Globe, Package } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl tracking-wider flex gap-2 items-center"><Globe /> TRENY CONNECT</div>
          <div className="text-sm text-blue-200">Global Logistics Platform</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-700">Track Shipment</h2>
            <input type="text" placeholder="Enter Tracking ID (e.g., TR-8842)" className="w-full p-3 border border-slate-300 rounded mb-4" />
            <button className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">Track Now</button>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Smart Route Optimization</h3>
            <p className="text-sm text-blue-800/70">AI-driven routing saves up to 14% on fuel costs and reduces delivery times by average 22%.</p>
          </div>
        </div>

        {/* Map UI Simulation */}
        <div className="lg:col-span-2 bg-slate-200 rounded-lg border border-slate-300 h-[500px] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
          <div className="z-10 bg-white p-4 rounded shadow-lg absolute top-1/2 left-1/3">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-1"><Truck size={16} /> In Transit</div>
            <div className="text-xs text-slate-500">Location: Hamburg, DE</div>
            <div className="text-xs text-slate-500">ETA: 4h 20m</div>
          </div>
           <div className="z-10 bg-white p-4 rounded shadow-lg absolute bottom-1/4 right-1/4">
            <div className="flex items-center gap-2 text-amber-500 font-bold mb-1"><Package size={16} /> Customs</div>
            <div className="text-xs text-slate-500">Location: New York, USA</div>
            <div className="text-xs text-slate-500">Status: Clearance Pending</div>
          </div>
        </div>
      </div>
    </main>
  );
}
