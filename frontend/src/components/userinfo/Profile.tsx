import { Mail, MapPin, Phone, CalendarDays, MessageSquareText, Share2 } from "lucide-react";
import type { UserInfoUI } from "./types";

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} rounded bg-slate-100 animate-pulse`} />;
}

export default function Profile({ user }: { user?: UserInfoUI }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* top banner */}
      <div className="h-24 bg-gradient-to-r from-sky-400 to-sky-700" />

      <div className="p-6">
        {/* avatar */}
        <div className="-mt-14 flex justify-center">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name ?? "user"}
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
              draggable={false}
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow" />
          )}
        </div>

        {/* name */}
        <div className="mt-4 text-center">
          <div className="text-2xl font-extrabold text-slate-900">
            {user?.full_name ?? <span className="inline-block w-44"><SkeletonLine /></span>}
          </div>
          <div className="mt-1 font-semibold text-sky-600">
            {user?.badge ?? <span className="inline-block w-32"><SkeletonLine w="w-32" /></span>}
          </div>
        </div>

        {/* bio */}
        <div className="mt-4 text-slate-600 leading-relaxed">
          {user?.bio ? (
            <p>{user.bio}</p>
          ) : (
            <div className="space-y-2">
              <SkeletonLine />
              <SkeletonLine w="w-11/12" />
              <SkeletonLine w="w-9/12" />
            </div>
          )}
        </div>

        <div className="my-6 h-px bg-slate-200" />

        {/* contact */}
        <div className="font-extrabold text-slate-900 flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <Phone size={18} className="text-sky-600" />
          </span>
          Thông tin liên hệ
        </div>

        <div className="mt-4 space-y-3 text-slate-700">
          <InfoRow
            icon={<Phone size={18} className="text-sky-600" />}
            value={user?.phone ?? ""}
            placeholder
          />
          <InfoRow
            icon={<Mail size={18} className="text-sky-600" />}
            value={user?.email ?? ""}
            placeholder
          />
          <InfoRow
            icon={<MapPin size={18} className="text-sky-600" />}
            value={user?.location ?? ""}
            placeholder
          />
          <InfoRow
            icon={<CalendarDays size={18} className="text-sky-600" />}
            value={user?.joined_text ?? ""}
            placeholder
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl bg-sky-600 px-4 py-3 font-extrabold text-white shadow hover:bg-sky-700 inline-flex items-center justify-center gap-2"
          >
            <MessageSquareText size={18} />
            Nhắn tin
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-extrabold text-slate-800 hover:bg-slate-100 inline-flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  value,
  placeholder,
}: {
  icon: React.ReactNode;
  value: string;
  placeholder?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        {value ? (
          <div className="font-semibold text-slate-700 truncate">{value}</div>
        ) : placeholder ? (
          <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
        ) : null}
      </div>
    </div>
  );
}
