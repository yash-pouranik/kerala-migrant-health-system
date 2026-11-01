import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    common: {
                        appName: 'Kerala Digital Health',
                        login: 'Login',
                        logout: 'Logout',
                        register: 'Register Migrant',
                        viewRecords: 'View Records',
                        connectAbha: 'Connect ABHA',
                    },
                    home: {
                        heroTitle: 'Digitizing Care for Migrant Footprints',
                        heroSubtitle: 'Kerala Digital Health Records – ABHA-aligned, privacy-first platform enabling continuity of care for migrant workers across Kerala.',
                        abdmTitle: 'ABDM & ABHA Compliant',
                        securityTitle: 'Privacy & Security',
                        sdgTitle: 'SDG Alignment',
                    }
                }
            },
            ml: {
                translation: {
                    common: {
                        appName: 'കേരള ഡിജിറ്റൽ ഹെൽത്ത്',
                        login: 'ലോഗിൻ',
                        logout: 'ലോഗൗട്ട്',
                        register: 'രജിസ്റ്റർ ചെയ്യുക',
                        viewRecords: 'റെക്കോർഡുകൾ',
                        connectAbha: 'ആഭ ബന്ധിപ്പിക്കുക',
                    },
                    home: {
                        heroTitle: 'അതിഥി തൊഴിലാളികൾക്കായി ഡിജിറ്റൽ പരിചരണം',
                        heroSubtitle: 'കേരള ഡിജിറ്റൽ ഹെൽത്ത് റെക്കോർഡ്സ് - അതിഥി തൊഴിലാളികൾക്കായി ആഭ അധിഷ്ഠിത സുരക്ഷിത പ്ലാറ്റ്ഫോം.',
                    }
                }
            },
            hi: {
                translation: {
                    common: {
                        appName: 'केरल डिजिटल स्वास्थ्य',
                        register: 'प्रवासी पंजीकरण',
                        viewRecords: 'रिकॉर्ड देखें',
                        connectAbha: 'ABHA कनेक्ट करें',
                    }
                }
            }
        }
    });

export default i18n;
