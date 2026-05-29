import { useState, useEffect } from "react";
import { useScroll, useTransform } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";

import BottomNavigation from "./BottomNavigation";
import Header from "./Header";
import Hero from "./Hero";
import ProductsSection from "./ProductsSection";
import PartnersMapSection from "./PartnersMapSection";
import InsightsAndValuesSection from "./InsightsAndValuesSection";
import Footer from "./Footer";

export interface Product {
  id: string;
  nama: string;
  kategori: string;
  merek: string;
  target_bulanan: number;
  tercapai: number;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const skipRedirect = queryParams.get("skip") === "true";

  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    volumeUnit: 24500,
    roomCollab: 8200,
    tenderSuccess: 99.4,
    volumePercent: 85,
    roomPercent: 65,
  });

  const [landingData, setLandingData] = useState<any>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    // Apabila masuk ke beranda, kita otomatis set logout agar "bisa langsung keluar"
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("device_verified");
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json"),
      fetch("/data/transactions.json"),
      fetch("/data/schedules.json"),
      fetch("/data/landing.json")
    ])
      .then(async ([prodRes, transRes, schedRes, landingRes]) => {
        const prodData = await prodRes.json();
        const transData = await transRes.json();
        const landingJson = await landingRes.json().catch(() => null);

        setLandingData(landingJson);
        
        setProducts(prodData);

        const totalUnits = transData
          .filter((t: any) => t.status === "Selesai")
          .reduce((acc: number, curr: any) => acc + (Number(curr.jumlah_unit) || 0), 0);
          
        const dynamicVolume = 24500 + totalUnits;
        const dynamicRooms = 8200; 
        
        let tenderSuccess = 99.4;
        let volumePercent = 85;
        let roomPercent = 65;
        
        if (transData.length > 0) {
          const finished = transData.filter((t: any) => t.status === "Selesai").length;
          const calculatedSuccess = (finished / transData.length) * 100;
          if (!Number.isNaN(calculatedSuccess)) {
            tenderSuccess = Number(calculatedSuccess.toFixed(1));
          }
        }

        setStats({
          volumeUnit: dynamicVolume || 24500,
          roomCollab: dynamicRooms || 8200,
          tenderSuccess: tenderSuccess > 0 ? tenderSuccess : 99.4,
          volumePercent: volumePercent || 85,
          roomPercent: roomPercent || 65
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#000A15] font-sans flex flex-col overflow-x-hidden text-[#00172D] dark:text-gray-100 pb-16 md:pb-0 transition-colors duration-300">
      <Header />
      <Hero y={y} data={landingData?.beranda_utama} />
      <PartnersMapSection />
      <ProductsSection products={products} />
      <InsightsAndValuesSection statistik={stats} data={landingData?.nilai_perusahaan} />
      <Footer data={landingData?.catatan_kaki} />
      <BottomNavigation />
    </div>
  );
}
