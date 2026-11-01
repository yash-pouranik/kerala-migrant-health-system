import { cn } from "../utils/cn";

interface LogoProps {
    className?: string;
    showText?: boolean;
    variant?: 'light' | 'dark';
    layout?: 'horizontal' | 'vertical';
}

export const Logo = ({ className, showText = true, variant = 'dark', layout = 'vertical' }: LogoProps) => {
    return (
        <div className={cn("flex items-center", layout === 'vertical' ? "flex-col" : "flex-row gap-2.5", className)}>
            {/* Logo Mark */}
            <div className={cn("relative flex items-center justify-center shrink-0",
                layout === 'vertical' ? "w-16 h-16 md:w-20 md:h-20" : "w-10 h-10"
            )}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                    <path
                        d="M20 75C10 60 10 30 35 15C55 5 80 15 90 40C95 65 80 85 55 90C40 92 25 85 20 75"
                        stroke="url(#swoosh_gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path d="M50 40C54 40 57 37 57 33C57 29 54 26 50 26C46 26 43 29 43 33C43 37 46 40 50 40Z" fill="#16a34a" /> {/* Head */}
                    <path d="M50 42C40 42 30 50 25 55C35 60 45 65 50 85C55 65 65 60 75 55C70 50 60 42 50 42Z" fill="#16a34a" /> {/* Body */}
                    <path d="M25 55Q25 70 28 80" stroke="#15803d" strokeWidth="2" strokeLinecap="round" /> {/* Trunk */}
                    <path d="M25 55L20 50M25 55L30 50M25 55L22 45M25 55L28 45" stroke="#15803d" strokeWidth="2" strokeLinecap="round" /> {/* Leaves */}
                    <rect x="70" y="20" width="6" height="6" fill="#fbbf24" opacity="0.8" />
                    <rect x="78" y="15" width="5" height="5" fill="#3b82f6" opacity="0.8" />
                    <rect x="85" y="25" width="4" height="4" fill="#10b981" opacity="0.8" />
                    <rect x="65" y="10" width="5" height="5" fill="#f59e0b" opacity="0.8" />
                    <rect x="75" y="30" width="4" height="4" fill="#06b6d4" opacity="0.8" />
                    <path d="M30 80Q50 85 70 80" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                        <linearGradient id="swoosh_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#84cc16" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Typography */}
            {showText && (
                <div className={cn("flex flex-col", layout === 'vertical' ? "items-center -mt-1" : "items-start")}>
                    <h1 className={cn("font-black tracking-wide leading-none",
                        variant === 'light' ? "text-white" : "text-[#064e3b]",
                        layout === 'vertical' ? "text-xl md:text-2xl" : "text-base md:text-lg"
                    )}>
                        KERALA
                    </h1>
                    <p className={cn("font-bold tracking-[0.1em] uppercase",
                        variant === 'light' ? "text-blue-200" : "text-[#1e3a8a]",
                        layout === 'vertical' ? "text-[10px] md:text-sm" : "text-[8px]"
                    )}>
                        DIGITAL HEALTH
                    </p>
                </div>
            )}
        </div>
    );
};
