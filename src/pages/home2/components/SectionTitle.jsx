export default function SectionTitle({ label, title, sub, light = false, white = false, blue = false }) {
  return (
    <div className="mb-10">
      <span
        className={`mb-3 block text-xs font-bold uppercase tracking-[2px] ${
          light ? "text-brand-green-label-light" : white ? "text-white" : blue ? "text-brand-blue" : "text-brand-green-dark"
        }`}
      >
        {label}
      </span>
      <h2
        className={`mb-3 text-2xl font-extrabold leading-tight md:text-4xl ${
          light ? "text-white" : white ? "text-white" : blue ? "text-brand-blue" : " text-black"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`max-w-2xltext-sm md:text-base ${
            light ? "text-white/70" : white ? "text-white/85" : blue ? "text-white" : "text-[#666666]"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
