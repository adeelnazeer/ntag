export default function AnimationStyles() {
  return (
    <style>{`
        @keyframes ringWave {
          0% {
            transform: translate(-50%, -50%) scale(0.75);
            opacity: 0.85;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.02);
            opacity: 0.45;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.05;
          }
        }
        @keyframes heroFloatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heroFloatSlower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes avatarRingWave {
          0% {
            transform: translate(-50%, -50%) scale(0.62);
            opacity: 0.9;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.18;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.55);
            opacity: 0;
          }
        }
        .float-slow {
          animation: heroFloatSlow 4.6s ease-in-out infinite;
        }
        .float-slower {
          animation: heroFloatSlow 4.6s ease-in-out 0.9s infinite;
        }
        .wave-ring {
          animation: ringWave 3.8s ease-out infinite;
        }
        .wave-ring-delay-1 {
          animation-delay: 1.2s;
        }
        .wave-ring-delay-2 {
          animation-delay: 2.4s;
        }
        .avatar-ring {
          animation: avatarRingWave 2.4s ease-out infinite;
        }
        .avatar-ring-delay-1 {
          animation-delay: 0.8s;
        }
        .avatar-ring-delay-2 {
          animation-delay: 1.6s;
        }
      `}</style>
  );
}
