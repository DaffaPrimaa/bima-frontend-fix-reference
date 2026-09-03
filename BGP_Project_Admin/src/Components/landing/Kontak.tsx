import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import AnimatedContent from "../ui/AnimatedContent";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export const Kontak = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Pesan dari ${formData.nama} via Website`);
    const body = encodeURIComponent(
      `Nama: ${formData.nama}\nEmail: ${formData.email}\n\nPesan:\n${formData.pesan}`
    );
    window.location.href = `mailto:marketing@bimasecurity.co.id?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="kontak"
      className="py-24 sm:py-32 bg-white/50 dark:bg-slate-900/50 relative overflow-hidden"
    >
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col text-left">
            <AnimatedContent distance={20} direction="vertical" duration={0.6} ease="easeOut">
              <h2 className="text-xl font-bold text-[#122C93] dark:text-[#4b6bff] mb-6 tracking-widest uppercase font-geist-mono">
                {t('kontak.section_title')}
              </h2>
            </AnimatedContent>

            <AnimatedContent distance={20} direction="vertical" delay={0.1} duration={0.6} ease="easeOut">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white mb-6">
                {t('kontak.main_title')}
              </h3>
            </AnimatedContent>

            <AnimatedContent distance={20} direction="vertical" delay={0.2} duration={0.6} ease="easeOut">
              <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl leading-relaxed font-medium max-w-lg mb-10">
                {t('kontak.desc')}
              </p>
            </AnimatedContent>

            <AnimatedContent distance={20} direction="vertical" delay={0.3} duration={0.6} ease="easeOut">
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/6285797219631"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </a>
                <a
                  href="https://instagram.com/ptbimaglobal"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <FaInstagram className="w-5 h-5" />
                  <span className="font-medium">Instagram</span>
                </a>
              </div>
            </AnimatedContent>
          </div>

          {/* Right Column (Form) */}
          <AnimatedContent distance={40} direction="vertical" delay={0.2} duration={0.8} ease="power2.out">
            <div className="bg-white dark:bg-[#111727] p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{t('kontak.form_submit')}</h4>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2"
                  >
                    NAMA
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder={t('kontak.form_name')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0f1d] text-gray-900 dark:text-white focus:outline-none focus:border-[#122C93] dark:focus:border-[#4b6bff] focus:ring-1 focus:ring-[#122C93] dark:focus:ring-[#4b6bff] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2"
                  >
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('kontak.form_email')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0f1d] text-gray-900 dark:text-white focus:outline-none focus:border-[#122C93] dark:focus:border-[#4b6bff] focus:ring-1 focus:ring-[#122C93] dark:focus:ring-[#4b6bff] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pesan"
                    className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2"
                  >
                    PESAN
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={t('kontak.form_msg')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0f1d] text-gray-900 dark:text-white focus:outline-none focus:border-[#122C93] dark:focus:border-[#4b6bff] focus:ring-1 focus:ring-[#122C93] dark:focus:ring-[#4b6bff] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#122C93] dark:bg-white text-white dark:text-gray-900 py-4 rounded-lg font-bold hover:bg-[#0e2170] dark:hover:bg-gray-200 transition-colors mt-2"
                >
                  {t('kontak.form_submit')}
                </button>
              </form>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};
