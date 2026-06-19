"use client";

export function AdminTopbar() {
  return (
    <header className=" top-0 z-40 bg-[#fdf8f7]/90 backdrop-blur-xl">
      <div className="flex h-[88px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-5"></div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#d7b0b9] to-[#b78895]" />

            <div>
              <p className="font-semibold text-[#4b343a]">Admin</p>

              <p className="text-xs text-[#8f727a]">Store Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
