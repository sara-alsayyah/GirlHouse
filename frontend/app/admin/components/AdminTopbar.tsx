"use client";

type Props = {
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar?: string;
  };
};

export function AdminTopbar({ user }: Props) {
  const name =
    user?.first_name || user?.last_name
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : user?.email || "Admin";

  return (
    <header className="top-0 z-30 bg-[#fdf8f7]/90 backdrop-blur-xl">
      <div className="flex h-[68px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-5" />

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            
            {/* LOGO */}
            <img
              src="/GH-logoF.png"
              alt="Girl House"
              className="h-11 w-11 rounded-full object-cover border border-[#e6d2d7]"
            />

            <div>
              <p className="font-semibold text-[#4b343a]">
                {name}
              </p>

              <p className="text-xs text-[#8f727a]">Store Owner</p>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}