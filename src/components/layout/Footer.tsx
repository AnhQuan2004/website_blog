
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Newsletter', href: '/newsletter' },
        { name: 'Events', href: '/events' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];
  
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-secondary py-12 mt-20">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded mr-1">Tech</span>
              <span>Tales</span>
            </Link>
            
            <p className="mt-4 text-muted-foreground max-w-md">
              Exploring the cutting edge of technology through insightful articles, tutorials, and analysis.
            </p>
            
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium text-sm tracking-wider uppercase mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TechTales. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
