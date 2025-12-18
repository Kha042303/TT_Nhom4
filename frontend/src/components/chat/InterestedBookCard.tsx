export default function InterestedBookCard({
  cover,
  title,
}: {
  cover: string;
  title: string;
}) {
  return (
    <div className="hidden md:flex items-center gap-3 rounded-2xl border bg-slate-50 px-3 py-2">
      <img src={cover} className="h-10 w-10 rounded-xl object-cover" alt={title} />
      <div className="leading-tight">
        <div className="text-[10px] font-semibold text-slate-500">ĐANG QUAN TÂM</div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
    </div>
  );
}
