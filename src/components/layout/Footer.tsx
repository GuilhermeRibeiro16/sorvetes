"use client"

import { Mail, MapPin, Phone, IceCreamBowl, User, User2,  } from "lucide-react";

const company = [
    "Sobre nós",
    "Carreira",
];

const services = [
    "sorvete",
    "açai",
    "picole",
    "milk-shake",
];

export default function Footer() {
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
    
    return (
<footer
  className="relative overflow-hidden py-20"
  style={{
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    paddingBottom: '6rem', // espaço para a bottom nav
  }}
>
            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* LOGO */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="relative">
                            <IceCreamBowl className="w-8 h-8 text-pink-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Uffy
                            </h3>
                        </div>

                        <p className=" mb-6 leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                        >
                           soverteria, acai e picole. direto da fabrica para sua casa, com a qualidade que você merece.
                        </p>

                        {/* SOCIAL */}
                        <h4 className="text-lg font-bold mb-4 text-white "
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        >Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <a 
                                href="https://linkedin.com/in/seu-perfil" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 text-white bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <User size={18} />
                            </a>
                            <a 
                                href="https://instagram.com/seu-perfil" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 text-white bg-linear-to-r from-pink-700 to-red-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <User2 size={18} />
                            </a>
                            <a 
                                href="https://wa.me/5582999615095" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 text-white bg-linear-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
                                aria-label="WhatsApp"
                            >
                                <Phone size={18} />
                            </a>
                        </div>
                    </div>

                    {/* SERVIÇOS */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white"
                        style={{ color: 'var(--color-text)' }}
                        >Serviços</h4>
                        <ul className="space-y-3">
                            {services.map((item, index) => (
                                <li key={index}>
                                    <a 
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-all duration-300"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* EMPRESA */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 "
                        style={{ color: 'var(--color-text)' }}
                        >Empresa</h4>
                        <ul className="space-y-3">
                            {company.map((com, comindex) => (
                                <li key={comindex}>
                                    <a 
                                        href={`#${com.toLowerCase()}`}
                                        className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-all duration-300"></span>
                                        {com}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTATO */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-black">Entre Em Contato</h4>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <Mail size={16} />
                                </div>
                                <a 
                                    href="mailto:guilherme.ribeiro1617@gmail.com"
                                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 font-medium "
                                >
                                    Uffy@gmail.com
                                </a>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <Phone size={16} />
                                </div>
                                <a 
                                    href="tel:+5582999615095"
                                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 font-medium "
                                >
                                    +55 (82) 99961-5095
                                </a>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin size={16} />
                                </div>
                                <a
                                    href="https://www.google.com/maps/place/Alagoas,+Brasil"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 font-medium hover:text-purple-400 transition-all duration-300"
                                >
                                    Luziápolis, Av.Wilson lopes N 333
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-b border-gray-300" />
                
                {/* COPYRIGHT */}
                <div className="border-t border-gray-700/50 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-800 text-sm text-center md:text-left">
                            &copy; {new Date().getFullYear()} Uffy. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-4 text-gray-800 text-sm">
                            <a href="#privacidade" className="hover:text-purple-400 transition-colors">Privacidade</a>
                            <span>•</span>
                            <a href="#termos" className="hover:text-purple-400 transition-colors">Termos</a>
                            <span>•</span>
                            <a href="#cookies" className="hover:text-purple-400 transition-colors">Cookies</a>
                        </div>
                    </div>

                    {/* BUTTON TOP */}

                    <div className="animate-bounce mt-8 flex justify-center md:justify-end">
                    <button 
                        onClick={scrollToTop} 
                        className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-medium flex items-center gap-2"
                        aria-label="Voltar ao topo"
                    >
                        <span>↑</span> Voltar ao topo
                    </button>
                    </div>

                </div>
                                            <a   
        href="/admin/login"
        className="text-xs text-black text-center mt-8 block"
        style={{ color: 'var(--color-border)' }}
>
          Acesso administrativo
        </a>
            </div>
        </footer>
    );
}