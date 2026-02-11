import { ROUTES } from '@/core/config';

export function Footer() {
  return (
    <div className="grid md:flex gap-6 text-xs text-center text-slate-400 uppercase tracking-widest font-bold">
      <a className="hover:text-[#b06372] transition-colors" href={ROUTES.LEGAL.PRIVACY}>
        Política de Privacidad
      </a>
      <a className="hover:text-[#b06372] transition-colors" href={ROUTES.LEGAL.TERMS}>
        Términos de Servicio
      </a>
      <a className="hover:text-[#b06372] transition-colors" href={ROUTES.LEGAL.SUPPORT}>
        Soporte
      </a>
    </div>
  );
}
