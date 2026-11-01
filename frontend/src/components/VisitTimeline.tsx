import { Calendar } from 'lucide-react';

const visits = [
    { date: '2025-12-10', type: 'OPD', complaint: 'Fever and chills', diagnosis: 'Suspected Malaria', treatment: 'Paracetamol + Lab tests ordered', status: 'Follow-up' },
    { date: '2025-11-25', type: 'VACCINATION', complaint: 'Routine Immunization', diagnosis: 'Tetanus Shot', treatment: 'Single dose administered', status: 'Completed' },
];

const VisitTimeline = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary-dark">Clinical Visit History</h3>
                <button className="btn-secondary px-4 py-1 text-xs">+ Add Visit</button>
            </div>

            <div className="relative border-l-2 border-primary/20 ml-3 space-y-8">
                {visits.map((visit, i) => (
                    <div key={i} className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <div className="card !p-4 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                                    {visit.type}
                                </span>
                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {visit.date}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-primary-dark mb-1">{visit.complaint}</p>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="text-[11px]">
                                    <p className="text-gray-400 font-bold uppercase mb-1">Diagnosis</p>
                                    <p className="text-gray-600">{visit.diagnosis}</p>
                                </div>
                                <div className="text-[11px]">
                                    <p className="text-gray-400 font-bold uppercase mb-1">Treatment</p>
                                    <p className="text-gray-600">{visit.treatment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitTimeline;
