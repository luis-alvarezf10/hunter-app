interface BaseDialogProps {
  className?: string;
  children?: React.ReactNode;
}

export const BaseDialog = ({ className = "", children }: BaseDialogProps) => {
  return (
    <>
      <style jsx>{`
        .overlay-animate {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dialog-animate {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        :global(.dark) .dialog-animate {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          background: rgba(26, 26, 26, 0.8);
        }
      `}</style>

      <div
        className={`dialog-animate relative bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full mx-4 p-8 border border-white/20 dark:border-white/10 ${className}`}
      >
        {children || <></>}
      </div>
    </>
  );
};
