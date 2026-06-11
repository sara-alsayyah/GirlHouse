import { BRAND_NAME } from "@/app/lib/brand";
import "./Logo.css";

export function BrandLogo(){
  const src = "/GH-Logo.png";
  return (
   
       <img src={src} alt="GIRL HOUSE" className="h-20 w-auto object-contain" />
  );
}