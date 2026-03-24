import React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
}

export const Footer: React.FC<FooterProps> = ({ 
  links = [
    { label: 'Terms of Debate', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Archival Standards', href: '#' },
    { label: 'API Access', href: '#' },
  ]
}) => {
  return (
    <footer className="bg-[#f9f9f9] dark:bg-[#000a1e] w-full border-t border-slate-200 dark:border-slate-800">
      <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif italic text-lg text-[#002147] dark:text-white mb-2">
            The Digital Hansard
          </span>
          <p className="font-label text-sm tracking-wide text-slate-500 dark:text-slate-400">
            © 2024 The Digital Hansard. All parliamentary records preserved under digital vellum protocols.
          </p>
        </div>
        <nav className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-500 dark:text-slate-400 hover:text-[#002147] dark:hover:text-white font-label text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
