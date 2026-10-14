import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#0B0F19] text-slate-300 py-10 border-t border-slate-800">
            <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand Overview */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="SINEX Logo" className="w-10 h-10 rounded-full object-cover border border-[#00d7c0]/50" />
                        <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent">SINEX</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        SirArleayous Innovation Nexus Ltd (SINEX) is a multi-country digital opportunity, task, research, and rewards ecosystem.
                    </p>
                </div>

                {/* Quick Navigation */}
                <div>
                    <h3 className="font-bold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-[#00d7c0]">Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#00d7c0]">About SINEX</Link></li>
                        <li><Link to="/contact" className="hover:text-[#00d7c0]">Contact Us</Link></li>
                        <li><Link to="/dashboard" className="hover:text-[#00d7c0]">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Terminology / Role Links */}
                <div>
                    <h3 className="font-bold text-white mb-3">Ecosystem</h3>
                    <ul className="space-y-2 text-sm">
                        <li><span className="text-slate-400">For Users (Tasks & Rewards)</span></li>
                        <li><span className="text-slate-400">For Clients & Businesses</span></li>
                        <li><span className="text-slate-400">Multi-Country Operations</span></li>
                        <li><span className="text-slate-400">Developer API Hub</span></li>
                    </ul>
                </div>

                {/* Social & Corporate Info */}
                <div className="col-span-2 md:col-span-1">
                    <h3 className="font-bold text-white mb-3">Connect With Us</h3>
                    <div className="flex gap-3 mb-4 text-lg">
                        {[
                            { href: "https://facebook.com", icon: <FaFacebook /> },
                            { href: "https://twitter.com", icon: <FaTwitter /> },
                            { href: "https://linkedin.com", icon: <FaLinkedin /> },
                            { href: "https://github.com", icon: <FaGithub /> },
                        ].map((s) => (
                            <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-[#111827] border border-slate-800 flex items-center justify-center hover:text-[#00d7c0] hover:border-[#00d7c0]/50 transition-colors">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">
                        Powered by SirArleayous Innovation Nexus Ltd
                    </p>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} SINEX (SirArleayous Innovation Nexus Ltd). All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;