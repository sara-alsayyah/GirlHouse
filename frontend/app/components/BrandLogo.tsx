import "./Logo.css";

type BrandLogoProps = {
  nav?: boolean;
};

export function BrandLogo({ nav = false }: BrandLogoProps) {
  return (
    <div
      className={
        nav
          ? "flex items-center gap-3"
          : "flex flex-col items-center"
      }
    >
      <img
        src="public/GH-logo.png"
        alt="Girl House"
        className={nav ? "h-9 w-auto object-contain" : "h-9 w-auto object-contain"}
      />

      <div className={nav ? "flex flex-col items-center" : ""}>
        <h1 className="logo-title #a87b88">
          GIRL HOUSE
        </h1>

        <div className="shop-line">
          <span></span>

          <p className="shop-text">Shop</p>

          <span></span>
        </div>
      </div>
    </div>
  );
}