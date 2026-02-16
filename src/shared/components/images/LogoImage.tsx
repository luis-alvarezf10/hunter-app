interface LogoImageProps {
  className?: string;
}

export function LogoImage({ className = '' }: LogoImageProps) {

  return (
    <div className="logo">
      <img
        src="/complete-logo.png"
        alt="hunter"
        className={`w-auto object-contain dark:block hidden ${className}`}
      />
      {/* Logo para light mode */}
      <img
        src="/complete-logo-black.png"
        alt="hunter"
        className={`w-auto object-contain dark:hidden block ${className}`}
      />
    </div>
  );
}