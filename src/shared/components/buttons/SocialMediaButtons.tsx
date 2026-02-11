import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

const SocialMedias = {
  instagram: {
    name: "Instagram",
    url: "https://www.instagram.com/diazandresoficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: <SiInstagram />
  },
  titktok: {
    name: "Tiktok",
    url: "",
    icon: <SiTiktok />
  },
  whatsapp: {
    name: "WhatsApp",
    url: "",
    icon: <SiWhatsapp />
  }
}

export function SocialMediaButtons() {
  return <div className="w-full h-auto py-8 flex items-center justify-center gap-2 flex-wrap">
    {Object.values(SocialMedias).map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300 p-4 rounded-lg "
        aria-label={social.name}
      >
        {social.icon}
      </a>
    ))}
  </div>;
}