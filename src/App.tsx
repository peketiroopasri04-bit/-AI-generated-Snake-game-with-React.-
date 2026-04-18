import SnakeGame from './components/SnakeGame';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative w-full h-full p-4 lg:p-8">
      {/* Dynamic Background Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 mb-8 sm:mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            NEON SERPENT
          </h1>
          <p className="text-cyan-400/80 font-mono text-sm tracking-widest mt-1">v1.0.0 // PROTOCOL_READY</p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 z-10">
        <section className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </section>

        <section className="w-full lg:w-[400px] flex flex-col items-center lg:items-start shrink-0">
          <h2 className="text-2xl font-bold text-white mb-6 text-glow-pink">SYNTH MODULE</h2>
          <AudioPlayer />
          
          <div className="mt-8 text-zinc-500 font-mono text-xs max-w-sm ml-auto mr-auto lg:mx-0 bg-zinc-900/40 p-4 border border-zinc-800 rounded-lg">
            <p className="mb-2 uppercase text-cyan-600 font-bold tracking-widest">Controls</p>
            <ul className="space-y-1">
              <li><span className="text-white">W,A,S,D</span> or <span className="text-white">Arrows</span> : Move</li>
              <li><span className="text-white">Space</span> : Pause (Not active)</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
