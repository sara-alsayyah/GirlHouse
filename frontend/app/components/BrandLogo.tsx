import "./Logo.css";

export function BrandLogo() {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/GH-logo.png"
        alt="Girl House"
        className="h-11 w-auto object-contain"
      />

      <h1 className="logo-title">
        GIRL HOUSE
      </h1>

      <div className="shop-line ">
        <span></span>

        <p className="shop-text">Shop</p>

        <span></span>
      </div>
    </div>
  );
}