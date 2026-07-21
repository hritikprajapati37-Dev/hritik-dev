export default function SceneHeading({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center gap-3 font-mono text-xs tracking-widest2 text-crimson-hot">
        <span>SCENE {number}</span>
        <span className="h-px flex-1 max-w-[3rem] bg-crimson-hot/50" />
        <span className="text-ash">{label}</span>
      </div>
      <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
