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
    <footer className="bg-surface/80 backdrop-blur-sm w-full border-t border-outline-variant/40">
      <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif italic text-lg text-primary mb-2">
            The Digital Hansard
          </span>
          <p className="font-label text-sm tracking-wide text-on-surface-variant text-center md:text-left">
            © 2024 The Digital Hansard. All parliamentary records preserved under digital vellum protocols.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary font-label text-sm transition-colors focus-visible:focus-ring rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
