'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  Download, 
  Image as ImageIcon, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  CreditCard,
  Tv,
  Layers,
  Info,
  Maximize2,
  Lock
} from 'lucide-react';

const PRESET_TAGS = [
  "Retro Monster", 
  "8-Bit RPG Hero", 
  "Cyberpunk Potion", 
  "Pixel Floating Island", 
  "16-Bit Space Cruiser", 
  "Mecha Robot Head"
];

const STYLE_OPTIONS = [
  { id: '16bit', name: '16-bit SNES Style', desc: 'Vibrant colors & detailed shading' },
  { id: '8bit', name: '8-bit NES Classic', desc: 'Limited palette & high contrast' },
  { id: 'gameboy', name: 'Game Boy Green', desc: '4-color nostalgic monochrome' },
  { id: 'pc98', name: 'PC-98 Retro PC', desc: 'Dithered classic Japanese PC look' },
];

const CANVAS_SIZES = [
  { id: '32', label: '32 x 32', badge: 'Fast' },
  { id: '64', label: '64 x 64', badge: 'Standard' },
  { id: '128', label: '128 x 128', badge: 'HD Pixel' },
];

const PixelArtPreview = ({ isGenerating, currentImage, size, style, showWatermark }) => {
  if (isGenerating) {
    return (
      <div className="w-full h-80 bg-slate-950/80 rounded-xl border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-cyan-400 font-mono text-sm tracking-wider animate-pulse">GENERATING PIXEL ART...</p>
          <p className="text-slate-500 text-xs font-mono">Running AI Diffusion model ({size}x{size} grid)</p>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="w-full h-80 bg-slate-950/50 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600 border border-slate-800">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-400 font-medium text-sm">No Pixel Art Generated Yet</p>
          <p className="text-slate-600 text-xs mt-1">Enter a prompt and click "Generate Pixel Art"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 rounded-xl border-2 border-slate-800 flex items-center justify-center p-4 overflow-hidden group">
      {/* Pixelated Art Preview Frame */}
      <div className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl rounded overflow-hidden">
        <img 
          src={currentImage} 
          alt="Generated Pixel Art" 
          className="max-h-72 max-w-full object-contain filter drop-shadow-md"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Watermark Overlay for Unpaid/Free Preview Mode */}
        {showWatermark && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none select-none">
            <div className="transform -rotate-12 bg-yellow-500/90 text-slate-950 text-xs font-black font-mono px-4 py-1.5 rounded border-2 border-slate-900 shadow-lg tracking-widest uppercase">
              PREVIEW ONLY • PIXELCRAFT AI
            </div>
          </div>
        )}
      </div>

      {/* Info Badge */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        {size}x{size} px | {style.toUpperCase()}
      </div>
    </div>
  );
};

export default function App() {
  /* State Variables */
  const [tokens, setTokens] = useState(5); // Simulated Credits/Quota
  const [prompt, setPrompt] = useState('a cute retro pixel art dragon, 16-bit game style, white background');
  const [selectedStyle, setSelectedStyle] = useState('16bit');
  const [selectedSize, setSelectedSize] = useState('64');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanlines, setScanlines] = useState(false);
  const [showWatermark, setShowWatermark] = useState(false);
  const [notification, setNotification] = useState(null);

  /* Helper: Notification Toast */
  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt first!', 'error');
      return;
    }

    if (tokens <= 0) {
      setIsModalOpen(true);
      showToast('No tokens remaining! Please buy credits to continue.', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      // サーバーサイドのReplicate APIルートを呼び出す
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size: selectedSize,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setCurrentImage(data.imageUrl);
      setTokens(prev => prev - 1);
      showToast('Pixel art generated successfully! 1 Token used.', 'success');
    } catch (error) {
      console.error('Generation Error:', error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBuyTokens = () => {
    // Simulating instant success from Stripe Micro-payment
    setTokens(prev => prev + 10);
    setIsModalOpen(false);
    showToast('Payment successful! Added 10 Tokens (¥500).', 'success');
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 relative ${scanlines ? 'before:pointer-events-none before:absolute before:inset-0 before:z-50 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] before:bg-[length:100%_4px]' : ''}`}>
      
      {}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                PixelCraft AI
              </h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">No-Account Pixel Generator</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Scanline Toggle */}
            <button 
              onClick={() => setScanlines(!scanlines)}
              className={`p-2 rounded-lg text-xs font-mono transition flex items-center gap-1.5 border ${scanlines ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
              title="Toggle CRT Scanline Effect"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">CRT</span>
            </button>

            {/* Token / Quota Display */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
              <Coins className="w-4 h-4 text-yellow-400 animate-bounce" />
              <div className="text-xs font-mono">
                <span className="text-slate-400">Tokens: </span>
                <span className={`font-bold ${tokens > 0 ? 'text-yellow-400' : 'text-red-400'}`}>{tokens}</span>
              </div>
            </div>

            {/* Buy Credits Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-lg shadow-yellow-500/10 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Buy Tokens (¥500)</span>
            </button>
          </div>
        </div>
      </header>

      {}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border bg-slate-900 border-slate-700 shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-bottom-5">
          {notification.type === 'error' ? (
            <Info className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Prompting & Controls (7 Cols) */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Prompt Input Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Prompt Description
              </label>
              <span className="text-[11px] text-slate-500">English prompt works best</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your pixel art character, item, or scene..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition resize-none font-mono"
            />

            {/* Quick Tag Chips */}
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 font-mono">Quick Preset Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPrompt(prev => prev ? `${prev}, ${tag}` : tag)}
                    className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50 transition font-mono"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style & Resolution Selectors */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-5 shadow-xl">
            
            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Art Style
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedStyle === style.id
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-semibold">{style.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Size */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Canvas Resolution
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {CANVAS_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      selectedSize === size.id
                        ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{size.label}</span>
                    <span className="text-[9px] text-slate-500 uppercase mt-0.5">{size.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold font-mono rounded-2xl shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-2 transition transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>GENERATING PIXEL ART...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>GENERATE PIXEL ART (1 TOKEN)</span>
              </>
            )}
          </button>
        </section>

        {}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-5 shadow-xl">
            
            {/* Header & Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Canvas Output
              </h2>
              
              {/* Watermark Toggle (Demonstrating Free/Paid Preview Mode) */}
              <button 
                onClick={() => setShowWatermark(!showWatermark)}
                className={`text-[11px] font-mono px-2 py-1 rounded border transition ${showWatermark ? 'bg-yellow-950/50 border-yellow-600/50 text-yellow-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                {showWatermark ? 'Watermark: ON' : 'Watermark: OFF'}
              </button>
            </div>

            {/* Pixel Canvas Component */}
            <PixelArtPreview 
              isGenerating={isGenerating} 
              currentImage={currentImage} 
              size={selectedSize} 
              style={selectedStyle}
              showWatermark={showWatermark}
            />

            {/* Action Download Buttons */}
            {currentImage && !isGenerating && (
              <div className="space-y-2.5 animate-in fade-in">
                <a
                  href={currentImage}
                  download={`pixelcraft_${selectedSize}x${selectedSize}.svg`}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-lg shadow-emerald-600/10"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD HIGH-RES PNG</span>
                </a>
                
                <p className="text-[10px] text-center text-slate-500 font-mono">
                  Transparent background enabled • Commercial usage allowed
                </p>
              </div>
            )}
          </div>

          {/* Architecture Concept Explainer Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Login Architecture</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              No passwords or personal data stored. Tokens are mapped directly via Stripe Checkout metadata or anonymous IP quota.
            </p>
          </div>
        </section>
      </main>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-slate-100">Buy Token Pack</h3>
                  <p className="text-xs text-slate-500">Pay-as-you-go • No Account Required</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 font-mono text-lg"
              >
                ✕
              </button>
            </div>

            {/* Offer Card */}
            <div className="bg-slate-950 border-2 border-yellow-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs text-slate-400 uppercase">Starter Pack</span>
                <span className="font-mono text-xl font-black text-yellow-400">¥500</span>
              </div>
              
              <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-slate-900 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>10 High-Res AI Generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Commercial Use Rights Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Personal Data Collected</span>
                </div>
              </div>
            </div>

            {/* Simulated Checkout Button */}
            <div className="space-y-3">
              <button
                onClick={handleBuyTokens}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold font-mono rounded-xl shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>Simulate Pay with Apple Pay / Card</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
                <Lock className="w-3 h-3 text-slate-600" />
                <span>Secured via Stripe Checkout</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
