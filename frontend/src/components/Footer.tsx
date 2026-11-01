import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary-dark">Kerala Digital Health</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Digital Health Records for migrant workers, aligned with ABDM & SDGs. Ensuring health equity and continuity of care for all.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary-dark font-bold">
                        <MapPin className="w-5 h-5 text-primary" />
                        Address
                    </div>
                    <p className="text-gray-600 text-sm">
                        Health & Family Welfare Dept, Govt. of Kerala<br />
                        Thiruvananthapuram, Kerala
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary-dark font-bold">
                        <Phone className="w-5 h-5 text-primary" />
                        Contact
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                            <Mail className="w-4 h-4" />
                            helpdesk@keralahealth.gov
                        </div>
                        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                            <Phone className="w-4 h-4" />
                            0471-000-0000
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
                © 2025 Kerala Digital Health Record Management System. All Rights Reserved. Aligned with ABDM.
            </div>
        </footer>
    );
};

export default Footer;
