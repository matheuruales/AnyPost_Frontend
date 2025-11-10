import React, { useMemo, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { backendApi } from '../services/backend';
import Loader from '../components/ui/Loader';

const TARGET_OPTIONS = [
  { value: 'youtube', label: 'YouTube', color: '#FF0000', icon: '▶' },
  { value: 'instagram', label: 'Instagram', color: '#E1306C', icon: '✦' },
  { value: 'facebook', label: 'Facebook', color: '#1877F2', icon: 'f' },
  { value: 'tiktok', label: 'TikTok', color: '#69C9D0', icon: '♪' },
  { value: 'twitter', label: 'Twitter', color: '#1DA1F2', icon: '𝕏' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: 'in' },
] as const;

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://anypostbackend-production.up.railway.app/api';
const UPLOAD_ENDPOINT = `${API_BASE_URL.replace(/\/$/, '')}/videos/upload`;

type TargetValue = (typeof TARGET_OPTIONS)[number]['value'];
type FileType = 'video' | 'image';

const TargetSwitch: React.FC<{
  option: (typeof TARGET_OPTIONS)[number];
  active: boolean;
  onToggle: () => void;
}> = ({ option, active, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        active 
          ? 'bg-white text-black shadow-lg' 
          : 'bg-[#050505] text-gray-400 hover:border-gray-600'
      }`}
      style={{ 
        borderColor: active ? option.color : '#1f1f1f',
        boxShadow: active ? `0 10px 30px ${option.color}40` : 'none'
      }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-all duration-300 group-hover:scale-110"
        style={{ 
          backgroundColor: active ? option.color : '#121213', 
          color: active ? '#050505' : option.color 
        }}
      >
        {option.icon}
      </span>
      <span className="transition-all duration-300">{option.label}</span>
      <span
        className={`ml-auto flex h-6 w-12 items-center rounded-full px-1 transition-all duration-300 ${
          active ? 'bg-green-500' : 'bg-gray-700'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${
            active ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
};

const FileTypeSelector: React.FC<{
  fileType: FileType;
  onChange: (type: FileType) => void;
}> = ({ fileType, onChange }) => {
  return (
    <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
      <button
        type="button"
        onClick={() => onChange('video')}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
          fileType === 'video' 
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🎬 Video
      </button>
      <button
        type="button"
        onClick={() => onChange('image')}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
          fileType === 'image' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🖼️ Imagen
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('1');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>('video');
  const [selectedTargets, setSelectedTargets] = useState<TargetValue[]>(['youtube']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetsPreview = useMemo(() => selectedTargets.join(', '), [selectedTargets]);

  const toggleTarget = (value: TargetValue) => {
    setSelectedTargets((prev) =>
      prev.includes(value) ? prev.filter((target) => target !== value) : [...prev, value]
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);

    // Create file preview
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileTypeChange = (type: FileType) => {
    setFileType(type);
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileAcceptString = () => {
    return fileType === 'video' ? 'video/*' : 'image/*';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!file) {
      setErrorMessage(`Selecciona un archivo de ${fileType === 'video' ? 'video' : 'imagen'} antes de enviar.`);
      return;
    }

    if (!selectedTargets.length) {
      setErrorMessage('Elige al menos una red social.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await backendApi.uploadVideoAsset({
        file,
        title: title.trim(),
        description: description.trim(),
        ownerId: Number(ownerId) || 1,
        targets: targetsPreview,
      });
      setSuccessMessage(response);
      setTitle('');
      setDescription('');
      setOwnerId('1');
      setFile(null);
      setFilePreview(null);
      setSelectedTargets(['youtube']);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo completar la solicitud. Intenta nuevamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 text-white">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#050505] to-[#0a0a0a] p-8 shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500"></div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">AnyPost</p>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Panel de publicación
              </h1>
              <p className="text-gray-400 text-sm max-w-md">Selecciona las redes sociales, completa la información y sube tu contenido para publicar en múltiples plataformas.</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/40 px-5 py-3 font-mono text-xs text-gray-300 backdrop-blur-sm">
              POST <span className="text-blue-400 font-semibold">{UPLOAD_ENDPOINT}</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr,1fr]">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target Selection */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0b0e] to-[#0a0a12] p-6 shadow-2xl shadow-black/40">
                <div className="flex flex-wrap gap-4">
                  {TARGET_OPTIONS.map((option) => (
                    <div key={option.value} className="flex-1 min-w-[200px]">
                      <TargetSwitch
                        option={option}
                        active={selectedTargets.includes(option.value)}
                        onToggle={() => toggleTarget(option.value)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex h-[68px] w-[68px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 text-gray-500 transition-all duration-300 hover:border-white/40 hover:text-white hover:shadow-lg"
                  >
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-110">+</span>
                    <span className="text-xs mt-1 opacity-70">
                      {fileType === 'video' ? '🎬' : '🖼️'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={getFileAcceptString()}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                    Targets seleccionados:
                  </p>
                  <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full">
                    {targetsPreview || 'ninguno'}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0b0e] to-[#0a0a12] p-8 space-y-6 shadow-2xl shadow-black/40">
                {/* File Type Selector */}
                <div>
                  <label className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3 block">
                    Tipo de contenido
                  </label>
                  <FileTypeSelector fileType={fileType} onChange={handleFileTypeChange} />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3 block">
                    Título de la publicación
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder-gray-500 transition-all duration-300 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Ingresa el título de tu campaña"
                    required
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3 block">
                      Descripción
                    </label>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="h-32 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Escribe el copy principal o notas adicionales..."
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3 block">
                        Owner ID
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={ownerId}
                        onChange={(event) => setOwnerId(event.target.value)}
                        className="w-32 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white transition-all duration-300 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3 block">
                        {fileType === 'video' ? 'Video seleccionado' : 'Imagen seleccionada'}
                      </label>
                      <div className={`rounded-xl border border-dashed px-4 py-4 text-sm transition-all duration-300 ${
                        file 
                          ? 'border-green-500/50 bg-green-500/10 text-green-300' 
                          : 'border-white/15 bg-black/20 text-gray-400'
                      }`}>
                        {file ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs opacity-70 ml-auto">
                              {fileType === 'video' ? '🎬' : '🖼️'}
                            </span>
                          </div>
                        ) : (
                          `Ningún archivo de ${fileType === 'video' ? 'video' : 'imagen'} seleccionado`
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {currentUser?.email && (
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <p className="text-xs text-gray-500">
                      Sesión iniciada como <span className="text-gray-300 font-medium">{currentUser.email}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 py-5 text-xl font-bold uppercase tracking-wide text-white shadow-2xl shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-500/50 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Subiendo...
                  </div>
                ) : (
                  `Publicar ${fileType === 'video' ? 'video' : 'imagen'} en redes sociales`
                )}
              </button>
            </form>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#111] to-[#050505] p-6 shadow-2xl shadow-black/60">
                <div className="text-center mb-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Vista previa</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {fileType === 'video' ? 'Video' : 'Imagen'} - {file ? file.name : 'Sin archivo'}
                  </p>
                </div>
                
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-inner">
                  {filePreview ? (
                    fileType === 'video' ? (
                      <video
                        src={filePreview}
                        className="h-full w-full object-cover"
                        controls
                        muted
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : file ? (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-black/70 p-4 text-center">
                      <div className="text-4xl mb-3">
                        {fileType === 'video' ? '🎬' : '🖼️'}
                      </div>
                      <p className="text-sm text-white font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Vista previa no disponible
                      </p>
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 text-center">
                      <div className="text-4xl mb-3 opacity-60">
                        {fileType === 'video' ? '📱' : '🏞️'}
                      </div>
                      <p className="text-sm text-gray-400">
                        Selecciona un {fileType === 'video' ? 'video' : 'imagen'} para previsualizar
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Panel */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-6 shadow-2xl shadow-black/60">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-2 w-2 rounded-full ${
                    successMessage ? 'bg-green-500' : 
                    errorMessage ? 'bg-red-500' : 
                    'bg-yellow-500'
                  }`}></div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Estado del sistema</p>
                </div>
                
                <div className={`rounded-xl p-4 text-sm transition-all duration-300 ${
                  successMessage 
                    ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
                    : errorMessage 
                    ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                    : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                }`}>
                  <p className="font-medium">
                    {successMessage
                      ? '✅ ' + successMessage
                      : errorMessage
                      ? '❌ ' + errorMessage
                      : `⚠️ Listo para enviar. Revisa la información y presiona PUBLICAR.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
