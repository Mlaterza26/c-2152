interface FutureLogoProps {
  className?: string;
}

export default function FutureLogo({ className = "" }: FutureLogoProps) {
  return (
    <div className={`flex items-center gap-1 select-none ${className}`}>
      <span className="text-current font-bold tracking-[0.15em] text-[1em] leading-none"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <span className="opacity-70">[</span>
        FUTURE
        <span className="opacity-70">]</span>
      </span>
    </div>
  );
}
