interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className = "", children }: React.PropsWithChildren<CardProps>) {
    return (
        <div className={`group relative bg-white dark:bg-[#1a1a1a] hover:bg-gradient-to-b hover:dark:from-white/10 hover:dark:to-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default dark:border-t-1 border-t-white/30 flex flex-col gap-2 ${className}`}>
            {children}
        </div>
    );
}