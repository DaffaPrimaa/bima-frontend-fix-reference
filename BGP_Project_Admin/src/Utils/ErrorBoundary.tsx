import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
          {/* Background Animation (Merah & Orange untuk Error) */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-yellow-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-2xl w-full">
            {/* Judul Error */}
            <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 animate-pulse">
              Oops!
            </h1>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl tracking-tight">
              Terjadi Kesalahan Sistem
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Aplikasi mengalami kendala tak terduga. Tim kami telah
              dinotifikasi.
            </p>

            {/* Kotak Error Detail (Glassmorphism) */}
            <div className="mt-8 p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-left overflow-auto max-h-40 shadow-2xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                Error Log:
              </p>
              <code className="text-red-400 font-mono text-sm block whitespace-pre-wrap">
                {this.state.error?.toString()}
              </code>
            </div>

            {/* Tombol Reload */}
            <div className="mt-10">
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-8 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-1 cursor-pointer"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>

          {/* Style Animasi (Sama seperti 404) */}
          <style>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
