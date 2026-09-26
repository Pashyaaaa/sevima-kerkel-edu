import Dither from "@/components/Dither";
import TechText from "@/components/TechText";

function Hero() {
  return (
    <header
      id="landing-page"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* LAYER 1: ANIMASI BACKGROUND (z-0) */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.1}
          waveFrequency={3}
          waveSpeed={0.05}
          backgroundColor={[3 / 255, 25 / 255, 38 / 255]}
        />
      </div>

      {/* LAYER 2: TEKS & CTA (z-10) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {/* Wadah TechText: Kecilkan height agar tidak menyisakan ruang kosong di bawah */}
        <div
          className="w-full relative flex items-center justify-center"
          style={{ height: "200px" }}
        >
          <TechText
            text="Koreksian"
            fontWeight={600}
            fontSize={150}
            reveal="letter"
            dashLength={4}
            dashGap={2}
            specks={15}
            fontFamily=""
            color="#E0E1DD"
            accentColor="#FFFFFF"
            letterSpacing={-0.05}
            reach={200}
            softness={0.7}
            strokeWidth={1.5}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
          />
        </div>

        {/* Area CTA: Tambahkan pointer-events-auto agar tombol bisa diklik */}
        <div className="cta flex gap-4 mt-6 pointer-events-auto">
          <a
            href="/login"
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:cursor-crosshair hover:bg-gray-200 transition-colors"
          >
            Get Started
          </a>
          <a
            href="demo"
            className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:cursor-crosshair hover:bg-white/10 transition-colors"
          >
            Demo
          </a>
        </div>
      </div>
    </header>
  );
}

export default Hero;
