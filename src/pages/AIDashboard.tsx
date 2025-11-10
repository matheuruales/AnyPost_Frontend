import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const channels = [
  { id: 'youtube', label: 'YouTube', color: '#FF0000', icon: '▶' },
  { id: 'tiktok', label: 'TikTok', color: '#25F4EE', icon: '♪' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '◐' },
  { id: 'custom', label: 'Personalizado', color: '#8B5CF6', icon: '✦' },
];

const AIDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>
      
      {/* Animated mesh gradient overlay */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Enhanced Navbar */}
        <nav className="border-b border-white/5 bg-black/60 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 blur-md opacity-75"></div>
                  <div className="relative h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500"></div>
                </div>
                <p className="text-base font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Anypost
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                {currentUser?.email && (
                  <div className="flex items-center gap-3 rounded-full bg-white/5 px-5 py-2.5 border border-white/10 backdrop-blur-xl">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-green-500 blur-sm"></div>
                      <div className="relative h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="text-gray-500">Conectado como</span>{' '}
                      <span className="font-semibold text-white">{currentUser.email}</span>
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/creator-hub')}
                  className="group relative overflow-hidden rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al hub
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="group relative overflow-hidden rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-105"
                >
                  <span className="relative z-10">Cerrar sesión</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                  Modo experimental
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Laboratorio creativo
              </span>{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                IA
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-3xl">
              Esta experiencia es solo visual por ahora. Pronto podrás generar assets directamente con IA.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Canales sugeridos */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">Canales sugeridos</h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        className="group/channel flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-5 py-3 transition-all duration-300 hover:border-white/30 hover:bg-black/60 hover:scale-105"
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold transition-transform duration-300 group-hover/channel:scale-110"
                          style={{ 
                            backgroundColor: `${channel.color}20`, 
                            color: channel.color,
                            border: `2px solid ${channel.color}40`
                          }}
                        >
                          {channel.icon}
                        </span>
                        <span className="text-sm font-semibold text-white/70 group-hover/channel:text-white transition-colors">
                          {channel.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Idea y Asset Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Idea Principal */}
                <div className="group relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Idea principal</h3>
                      <div className="h-1 w-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                        <p className="font-semibold text-white mb-2">Campaña: Evento nocturno</p>
                        <p className="text-sm text-white/60">
                          "Un teaser para generar hype de un evento futurista."
                        </p>
                      </div>
                      
                      <div className="rounded-xl border border-dashed border-purple-500/30 bg-purple-500/5 p-4 backdrop-blur-xl">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-purple-300 leading-relaxed">
                            Próximamente podrás editar este brief y generar escenas automáticamente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Generado */}
                <div className="group relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Asset generado</h3>
                      <div className="h-1 w-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full"></div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-black/60 to-black/40 py-12 text-center backdrop-blur-xl">
                      <span className="text-6xl opacity-50">🎬</span>
                      <div>
                        <p className="text-sm text-white/80 font-medium mb-1">Previsualización en construcción</p>
                        <p className="text-xs text-white/50">
                          Aquí podrás revisar tus clips generados antes de editarlos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Destacado */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Prompt destacado</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent max-w-[100px]"></div>
                      </div>
                      <p className="text-base text-white/90 leading-relaxed">
                        "Genera un video vertical de 15s con luces neón y texto flotante anunciando una preventa exclusiva."
                      </p>
                    </div>
                    <button className="group/copy relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-black/50">
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar prompt
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/copy:translate-y-0 transition-transform duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Estado */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Estado</span>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-white/10 p-4 backdrop-blur-xl mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <p className="text-lg font-bold text-white">Modo plantilla</p>
                    </div>
                    <p className="text-sm text-white/60">
                      Esta sección es un mockup. No generará archivos todavía.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas Rápidas */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Notas rápidas</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Selecciona "Añadir desde escritorio" para volver al flujo actual.',
                      'Pronto integrarás prompts y escenas automáticas.',
                      'El botón "Subir" servirá para publicar directamente.'
                    ].map((note, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-xl bg-black/40 border border-white/10 p-3 backdrop-blur-xl">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 border border-purple-500/30">
                          {index + 1}
                        </span>
                        <p className="text-sm text-white/70 leading-relaxed">{note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Siguiente Paso */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.12)] text-center">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Siguiente paso</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    Vuelve al hub para elegir otro flujo o continúa experimentando en esta maqueta.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-black/50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Ir al dashboard clásico
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;