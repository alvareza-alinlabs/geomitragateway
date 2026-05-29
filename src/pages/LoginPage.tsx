import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Server, UserCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FormEvent, useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';
import { Trans, useTranslation } from "../lib/LanguageContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [recentLogins, setRecentLogins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const handleSocialLogin = () => {
    t("Tahap Pengembangan").then(setToastMessage);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const storedLogins = localStorage.getItem("recentLogins");
    if (storedLogins) {
      try {
        setRecentLogins(JSON.parse(storedLogins));
      } catch (e) {}
    }
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create a dummy user session if needed, but since we are bypassing auth, we can just set it true.
      // And we use the DEFAULT_USER from auth.ts
      
      const user = {
        id: 1,
        nama: "Admin Utama",
        email: "admin@gmgconsole.id",
        password: "password123",
        hak_akses: {
          ringkasan: "Super Admin",
          peta: "Super Admin",
          mitra: "Super Admin",
          penjualan: "Super Admin",
          transaksi: "Super Admin",
          produk: "Super Admin",
          jadwal: "Super Admin",
          akses: "Super Admin",
        }
      };

      // Save login session
      localStorage.setItem("device_verified", "true");
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      // Show welcome popup only on fresh login
      sessionStorage.setItem("showWelcomePopup", "true");
      
      // Dispatch storage event to update other components
      window.dispatchEvent(new Event("storage"));

      navigate("/dashboard");
    } catch (err) {
      t("Terjadi kesalahan sistem. Silakan hubungi administrator.").then(setError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentLoginClick = async (savedEmail: string) => {
    setEmail(savedEmail);
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch('/data/users.json');
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const users = await res.json();

      const user = users.find((u: any) => u.email === savedEmail);

      if (user) {
        const updatedLogins = [savedEmail, ...recentLogins.filter(e => e !== savedEmail)].slice(0, 3);
        localStorage.setItem("recentLogins", JSON.stringify(updatedLogins));
        
        localStorage.setItem("device_verified", "true");
            localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Show welcome popup only on fresh login
        sessionStorage.setItem("showWelcomePopup", "true");
        
        window.dispatchEvent(new Event("storage"));

        navigate("/dashboard");
      } else {
        t("Akun tidak ditemukan. Silakan masuk manual.").then(setError);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan hubungi administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      t("Silakan masukkan email Anda yang terdaftar.").then(setError);
      return;
    }
    
    if (cooldown > 0) {
      setError(`Sistem dalam masa tunggu. Coba lagi dalam ${Math.floor(cooldown/60)}:${(cooldown%60).toString().padStart(2, '0')}`);
      return;
    }

    if (isOtpStep && countdown > 0) {
      return;
    }

    if (isOtpStep && resendCount >= 3) {
      setCooldown(300);
      t("Batas pengiriman ulang tercapai. Silakan tunggu 5 menit.").then(setError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch('/data/users.json');
      const users = await res.json();
      const user = users.find((u: any) => u.email === email);

      if (!user) {
         t("Akun dengan email tersebut tidak ditemukan.").then(setError);
         setIsLoading(false);
         return;
      }

      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(generated);

      const templateParams = {
        to_email: email,
        email: email,
        otp_code: generated,
        otp: generated,
        subject: `[${generated}] Kode OTP Geo Mitra`,
        message: `[${generated}] adalah kode verifikasi Anda. Jangan berikan kode ini kepada siapapun.`
      };

      await emailjs.send(
        'gmg-otp',
        'gmg-otp',
        templateParams,
        '7afeCxNtF1U9QA0JL'
      );

      if (isOtpStep) {
        setResendCount(prev => prev + 1);
      }
      setIsOtpStep(true);
      setCountdown(90);
      setError("");
    } catch (err) {
      console.error("EmailJS Error:", err);
      t("Gagal mengirim OTP. Silakan periksa koneksi Anda.").then(setError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOtpStep && otp.every(digit => digit !== '')) {
      handleVerifyOtp();
    }
  }, [otp, isOtpStep]);

  const handleVerifyOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
       setIsLoading(true);
       try {
         const res = await fetch('/data/users.json');
         const users = await res.json();
         const user = users.find((u: any) => u.email === email);
         
         if (user) {
           const updatedLogins = [email, ...recentLogins.filter((e) => e !== email)].slice(0, 3);
           localStorage.setItem("recentLogins", JSON.stringify(updatedLogins));
           localStorage.setItem("device_verified", "true");
            localStorage.setItem("userLoggedIn", "true");
           localStorage.setItem("currentUser", JSON.stringify(user));
           sessionStorage.setItem("showWelcomePopup", "true");
           window.dispatchEvent(new Event("storage"));
           navigate("/dashboard");
         } else {
           t("Terjadi kesalahan, pengguna tidak ditemukan.").then(setError);
         }
       } catch (error) {
         t("Sistem sedang gangguan.").then(setError);
       } finally {
         setIsLoading(false);
       }
    } else {
       t("Kode OTP salah. Silakan periksa kembali email Anda.").then(setError);
       setOtp(['', '', '', '', '', '']);
       if (otpRefs.current[0]) otpRefs.current[0].focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextEmpty = newOtp.findIndex(val => val === '');
      if (nextEmpty !== -1 && otpRefs.current[nextEmpty]) {
        otpRefs.current[nextEmpty]?.focus();
      } else if (otpRefs.current[5]) {
        otpRefs.current[5]?.focus();
      }
      return;
    }
    
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value !== '' && index < 5 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.kunci_data === 'Backspace' && otp[index] === '' && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#00172D] md:bg-[#f8fafc] dark:md:bg-[#000A15] flex flex-col md:flex-row font-sans relative overflow-hidden transition-colors duration-300"
    >
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900 border border-gray-700 text-white px-6 py-3 rounded-full shadow-2xl font-bold tracking-wide text-xs flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            {toastMessage}
          </motion.div>
        </div>
      )}

      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#35ACDF] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[150px]" />
      </div>

      {/* Top Mobile Header / Left Desktop Panel */}
      <div className="flex flex-col w-full min-h-[35vh] md:min-h-0 md:w-auto md:flex-1 bg-[#00172D] text-white px-6 pb-12 pt-6 md:p-12 relative z-0 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00172D] via-transparent to-transparent md:block hidden"></div>
        
        <div className="max-w-md w-full relative z-20 flex flex-col items-center md:items-start">
          {/* Mobile Specific Header Content */}
          <div className="md:hidden flex flex-col items-center mb-0 w-full pt-0">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-blue-400/60 uppercase mb-0 text-center">
              Geo Mitra Gateway
            </h2>
            <div className="w-64 h-40 sm:w-72 sm:h-48 opacity-80 flex justify-center -mt-2">
              <DotLottieReact
                src="/lottie/indonesian-maps-blue.lottie"
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="hidden md:flex flex-row items-center justify-start gap-3 mb-10">
             <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
               <img src="/gambar/icon-dashboard-white.png" alt="Dashboard Logo" className="w-full h-full object-contain" />
             </div>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Geo Mitra <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#35ACDF]">Gateway</span>
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
              Portal ini ditujukan bagi mitra distribusi terpilih untuk mengelola operasional bisnis dan mengeksplorasi portfolio katalog eksklusif.
            </p>

            <div className="w-full">
              <DotLottieReact
                src="/lottie/indonesian-maps-blue.lottie"
                loop
                autoplay
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form (Bottom Sheet on Mobile) */}
      <div className="flex-[1.2] flex flex-col justify-start md:justify-center items-center py-8 md:py-10 px-6 sm:p-12 relative z-10 bg-white dark:bg-[#001428] md:bg-transparent dark:md:bg-transparent border-t border-transparent dark:border-slate-600/5 md:border-none rounded-t-[2.5rem] md:rounded-none -mt-12 md:mt-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-none md:shadow-none min-h-[75vh] md:min-h-0 transition-all duration-300">
        
        {/* Mobile drag indicator (decorative) */}
        <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700/80 rounded-full mb-8 md:hidden mx-auto flex-shrink-0"></div>

        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-[#00172D] dark:text-white tracking-tight"><Trans>Masuk</Trans></h1>
            {(isOtpStep || isForgotPassword) && (
              <p className="text-gray-500 dark:text-gray-400 mt-1.5 md:mt-2 text-xs md:text-sm font-medium px-4 md:px-0">
                 {isOtpStep 
                   ? <Trans>Masukkan 6 digit kode OTP yang kami kirim ke email Anda.</Trans> 
                   : <Trans>Masukkan email Anda untuk kami kirimi instruksi reset sandi.</Trans>}
              </p>
            )}
          </div>

          {/*
          {!isForgotPassword && !isOtpStep && recentLogins.length > 0 && (
            <div className="mb-6 md:mb-8 space-y-3">
              <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Akun Terakhir Digunakan</Trans></label>
              <div className="flex flex-col gap-2">
                {recentLogins.map((savedEmail, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRecentLoginClick(savedEmail)}
                    className={`flex items-center gap-3 p-2.5 md:p-3 rounded-xl border transition-all ${
                      email === savedEmail 
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-[#35ACDF]' 
                        : 'bg-white dark:bg-[#001428] border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <UserCircle2 className={`w-7 h-7 md:w-8 md:h-8 ${email === savedEmail ? 'text-[#35ACDF]' : 'text-gray-400 dark:text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-bold truncate max-w-[180px] md:max-w-[200px]">{savedEmail}</p>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60"><Trans>Ketuk untuk pilih</Trans></p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          */}

          <form onSubmit={isOtpStep ? handleVerifyOtp : isForgotPassword ? handleSendOtp : handleLogin} className="space-y-5 md:space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 p-3 rounded-xl text-xs md:text-sm font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}
            
            {/*
            {!isOtpStep && (
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Email Perusahaan</Trans></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 bg-white dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-gray-400 dark:placeholder-gray-500 transition-all font-medium text-xs md:text-sm shadow-sm hover:border-gray-300 dark:hover:border-slate-500"
                    placeholder="admin@gmgconsole.id"
                  />
                </div>
              </div>
            )}

            {!isForgotPassword && !isOtpStep && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Kata Sandi</Trans></label>
                  <button 
                     type="button"
                     onClick={() => { setIsForgotPassword(true); setError(""); }}
                     className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#35ACDF] hover:text-blue-500 transition-colors"
                  >
                     Lupa Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 md:pl-12 pr-12 py-3 md:py-3.5 bg-white dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-gray-400 dark:placeholder-gray-500 transition-all font-medium text-xs md:text-sm shadow-sm hover:border-gray-300 dark:hover:border-slate-500"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>
            )}
            */}
            
            {isOtpStep && (
              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 text-center block"><Trans>Kode Verifikasi (OTP)</Trans></label>
                   <div className="flex justify-center gap-2 md:gap-3">
                     {otp.map((digit, index) => (
                       <input
                         key={index}
                         ref={el => otpRefs.current[index] = el}
                         type="tel"
                         inputMode="numeric"
                         pattern="[0-9]*"
                         maxLength={6}
                         value={digit}
                         onChange={e => handleOtpChange(index, e.target.value)}
                         onKeyDown={e => handleOtpKeyDown(index, e)}
                         className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-black bg-white dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all shadow-sm hover:border-gray-300 dark:hover:border-slate-500"
                       />
                     ))}
                   </div>
                 </div>
                 
                 <div className="text-center">
                   {cooldown > 0 ? (
                     <p className="text-xs text-red-500 font-medium tracking-wide">
                        Kirim ulang ditangguhkan: {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
                     </p>
                   ) : countdown > 0 ? (
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                        Kirim ulang OTP dalam {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                     </p>
                   ) : (
                     <button
                       type="button"
                       onClick={() => handleSendOtp()}
                       className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#35ACDF] hover:text-blue-500 transition-colors"
                     >
                       Kirim Ulang OTP
                     </button>
                   )}
                 </div>
              </div>
            )}

            {!isOtpStep && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 md:py-4 mt-6 bg-[#00172D] dark:bg-white dark:text-[#000A15] hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-[#000A15] font-black uppercase tracking-widest text-[11px] md:text-xs rounded-xl md:rounded-2xl shadow-lg shadow-[#00172D]/20 dark:shadow-none transition-all border border-transparent disabled:opacity-75"
              >
                {isLoading ? <Trans>Memproses...</Trans> : isForgotPassword ? <Trans>Kirim OTP</Trans> : <Trans>Masuk Ekosistem</Trans>}
              </motion.button>
            )}
            
            {(isForgotPassword || isOtpStep) && (
               <div className="text-center mt-4">
                  <button 
                     type="button"
                     onClick={() => { setIsForgotPassword(false); setIsOtpStep(false); setError(""); setOtp(['','','','','','']); setCountdown(0); setResendCount(0); }}
                     className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#00172D] dark:hover:text-white hover:underline uppercase tracking-widest transition-all"
                  >
                     Kembali ke Log In
                  </button>
               </div>
            )}

            {/*
            {!isForgotPassword && !isOtpStep && (
              <>
                <div className="relative mt-8 mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-400 dark:border-slate-600/5"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white dark:bg-[#001428] md:bg-transparent md:dark:bg-transparent text-gray-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest"><Trans>Atau masuk dengan</Trans></span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button type="button" onClick={handleSocialLogin} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border border-gray-400 dark:border-slate-600 bg-white dark:bg-[#001c38] hover:bg-gray-50 dark:hover:bg-[#002447] hover:border-[#35ACDF]/30 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] group">
                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button type="button" onClick={handleSocialLogin} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border border-gray-400 dark:border-slate-600 bg-white dark:bg-[#001c38] hover:bg-gray-50 dark:hover:bg-[#002447] hover:border-[#35ACDF]/30 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] group">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button type="button" onClick={handleSocialLogin} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border border-gray-400 dark:border-slate-600 bg-white dark:bg-[#001c38] hover:bg-gray-50 dark:hover:bg-[#002447] hover:border-[#35ACDF]/30 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] group">
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z"/>
                      <path fill="#81bc06" d="M12 0h11v11H12z"/>
                      <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                      <path fill="#ffba08" d="M12 12h11v11H12z"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
            */}

            {!isForgotPassword && !isOtpStep && (
              <div className="mt-5 text-center">
                <Link to="/" className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#00172D] dark:hover:text-white hover:underline uppercase tracking-widest transition-all">
                  Kembali ke Beranda
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
