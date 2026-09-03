import { Button, Input, InputOtp, Spinner } from "@heroui/react";
import { FiArrowLeft } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import cover from "../assets/images/cover.webp";
import logo from "../assets/images/logo.webp";
import { useState, useEffect } from "react";

type AuthView = "login" | "forgot-email" | "forgot-otp" | "forgot-new-password";

const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [view, setView] = useState<AuthView>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [generalError, setGeneralError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [resetGeneralError, setResetGeneralError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpGeneralError, setOtpGeneralError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const [newPasswordErrors, setNewPasswordErrors] = useState<{
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [newPasswordGeneralError, setNewPasswordGeneralError] = useState("");
  const [newPasswordSuccess, setNewPasswordSuccess] = useState("");
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const [countdown, setCountdown] = useState(600);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (view === "forgot-otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, view]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email wajib diisi.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format email tidak valid.";
      isValid = false;
    } else if (email.length > 100) {
      newErrors.email = "Email maksimal 100 karakter.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    } else if (password.length > 16) {
      newErrors.password = "Password maksimal 16 karakter.";
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setGeneralError(
          responseData.message || "Login gagal, periksa kembali data Anda!",
        );
        setLoading(false);
        return;
      }

      const { access_token, refresh_token, user } = responseData.data;
      const userRole = user.role;

      document.cookie = `token=${access_token}; path=/;`;
      document.cookie = `refresh_token=${refresh_token}; path=/;`;
      document.cookie = `role=${userRole}; path=/;`;

      if (userRole?.toLowerCase() === "client") {
        navigate("/ClientDashboard");
      } else {
        navigate("/AdminDashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setGeneralError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleGoToForgotPassword = () => {
    setGeneralError("");
    setValidationErrors({});
    setResetEmail(email);
    setResetEmailError("");
    setResetGeneralError("");
    setView("forgot-email");
  };

  const handleBackToLogin = () => {
    setResetEmail("");
    setResetEmailError("");
    setResetGeneralError("");
    setOtp("");
    setOtpError("");
    setOtpGeneralError("");
    setNewPassword("");
    setConfirmNewPassword("");
    setNewPasswordErrors({});
    setNewPasswordGeneralError("");
    setNewPasswordSuccess("");
    setView("login");
  };

  const handleSendOtp = async () => {
    setResetGeneralError("");

    if (!resetEmail) {
      setResetEmailError("Email wajib diisi.");
      return;
    } else if (!emailRegex.test(resetEmail)) {
      setResetEmailError("Format email tidak valid.");
      return;
    } else {
      setResetEmailError("");
    }

    setResetLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setResetGeneralError(
          responseData.message || "Gagal mengirim kode OTP, periksa kembali email Anda!",
        );
        setResetLoading(false);
        return;
      }

      setView("forgot-otp");
      setCountdown(600);
    } catch (err) {
      console.error("Send OTP Error:", err);
      setResetGeneralError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotEmailKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleSendOtp();
    }
  };

  const handleBackToForgotEmail = () => {
    setOtp("");
    setOtpError("");
    setOtpGeneralError("");
    setView("forgot-email");
  };

  const handleVerifyOtp = async () => {
    setOtpGeneralError("");

    if (!otp || otp.length < 4) {
      setOtpError("Kode OTP wajib diisi 6 digit.");
      return;
    } else {
      setOtpError("");
    }

    setOtpLoading(true);

    // OTP will be verified in the next step together with the new password
    setTimeout(() => {
      setOtpLoading(false);
      setView("forgot-new-password");
    }, 600);
  };

  const validateNewPasswordForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};
    let isValid = true;

    if (!newPassword) {
      newErrors.newPassword = "Password baru wajib diisi.";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password minimal 8 karakter.";
      isValid = false;
    } else if (newPassword.length > 16) {
      newErrors.newPassword = "Password maksimal 16 karakter.";
      isValid = false;
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Konfirmasi password wajib diisi.";
      isValid = false;
    } else if (confirmNewPassword !== newPassword) {
      newErrors.confirmNewPassword = "Konfirmasi password tidak cocok.";
      isValid = false;
    }

    setNewPasswordErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async () => {
    setNewPasswordGeneralError("");
    setNewPasswordSuccess("");

    if (!validateNewPasswordForm()) {
      return;
    }

    setNewPasswordLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          code: otp,
          new_password: newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setNewPasswordGeneralError(
          responseData.message || "Gagal mereset password, periksa kembali data Anda!",
        );
        setNewPasswordLoading(false);
        return;
      }

      setNewPasswordSuccess("Password berhasil direset. Silakan login kembali.");
      setTimeout(() => {
        handleBackToLogin();
      }, 1500);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setNewPasswordGeneralError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setNewPasswordLoading(false);
    }
  };

  const handleNewPasswordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleResetPassword();
    }
  };

  const handleBackArrowClick = () => {
    if (view === "forgot-email") {
      handleBackToLogin();
    } else if (view === "forgot-otp") {
      handleBackToForgotEmail();
    } else if (view === "forgot-new-password") {
      handleBackToLogin();
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <div className="hidden lg:flex w-1/2 relative bg-[#122C93] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={cover}
            alt="Background"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#122C93] to-blue-900/90 mix-blend-multiply" />
        </div>

        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="w-30 h-30 flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Sistem Keamanan Terpadu
          </h1>
          <p className="text-base text-blue-100 font-light leading-relaxed opacity-90">
            PT. Bima Global Security System.
            <br />
            Kelola operasional keamanan dengan efisien dan aman.
          </p>
        </div>
      </div>

      <div className="form-section relative w-1/2 flex flex-col items-start justify-center px-[100px] lg:px-[200px]">
        {view !== "login" && (
          <button
            type="button"
            onClick={handleBackArrowClick}
            className="absolute top-8 left-12 flex items-center justify-center w-10 h-10 text-[#122C93]"
          >
            <div className="button-section flex flex-row items-center gap-2">
              {" "}
              <FiArrowLeft size={24} />
              <h2>Kembali</h2>
            </div>
          </button>
        )}

        {view === "login" && (
          <>
            <h2 className="font-bold text-[33px] text-[#122C93]">Login</h2>

            <h2 className="font-semibold text-[20px] mt-20 text-[#122C93]">
              Email
            </h2>
            <Input
              variant="bordered"
              type="email"
              size="lg"
              placeholder="Masukkan Email Anda"
              className="mt-5"
              minLength={5}
              maxLength={101}
              value={email}
              isInvalid={!!validationErrors.email}
              errorMessage={validationErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({
                    ...validationErrors,
                    email: undefined,
                  });
                }
              }}
              onKeyDown={handleLoginKeyDown}
            />

            <h2 className="font-semibold text-[20px] mt-5 text-[#122C93]">
              Password
            </h2>
            <Input
              type={isVisible ? "text" : "password"}
              size="lg"
              placeholder="Masukkan Password Anda"
              variant="bordered"
              maxLength={17}
              minLength={8}
              className="mt-5"
              value={password}
              isInvalid={!!validationErrors.password}
              errorMessage={validationErrors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({
                    ...validationErrors,
                    password: undefined,
                  });
                }
              }}
              onKeyDown={handleLoginKeyDown}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            {generalError && (
              <p className="text-red-500 mt-3 font-medium text-sm bg-red-50 p-2 rounded w-full">
                {generalError}
              </p>
            )}

            <h2
              className="text-[#122C93] text-[15px] cursor-pointer font-semibold mt-5"
              onClick={handleGoToForgotPassword}
            >
              Lupa Password ?{" "}
            </h2>

            <Button
              variant="solid"
              color="primary"
              size="lg"
              className="mt-10 w-full font-semibold bg-[#122C93] flex items-center justify-center"
              onClick={handleLogin}
              isDisabled={loading}
            >
              {loading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <span className="ml-2">Memproses...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </>
        )}

        {view === "forgot-email" && (
          <>
            <h2 className="font-bold text-[33px] text-[#122C93]">
              Atur Ulang Kata Sandi
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Masukkan email akun Anda. Kode OTP akan dikirim untuk reset
              password
            </p>

            <h2 className="font-semibold text-[20px] mt-16 text-[#122C93]">
              Email
            </h2>
            <Input
              variant="bordered"
              type="email"
              size="lg"
              placeholder="Masukkan Email Anda"
              className="mt-5"
              minLength={5}
              maxLength={101}
              value={resetEmail}
              isInvalid={!!resetEmailError}
              errorMessage={resetEmailError}
              onChange={(e) => {
                setResetEmail(e.target.value);
                if (resetEmailError) {
                  setResetEmailError("");
                }
              }}
              onKeyDown={handleForgotEmailKeyDown}
            />

            {resetGeneralError && (
              <p className="text-red-500 mt-3 font-medium text-sm bg-red-50 p-2 rounded w-full">
                {resetGeneralError}
              </p>
            )}

            <Button
              variant="solid"
              color="primary"
              size="lg"
              className="mt-10 w-full font-semibold bg-[#122C93] flex items-center justify-center"
              onClick={handleSendOtp}
              isDisabled={resetLoading}
            >
              {resetLoading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <span className="ml-2">Mengirim...</span>
                </>
              ) : (
                "Kirim OTP"
              )}
            </Button>
          </>
        )}

        {view === "forgot-otp" && (
          <>
            <h2 className="font-bold text-[33px] text-[#122C93]">
              Verifikasi Akun
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Masukkan kode verifikasi yang telah kami kirimkan ke {resetEmail}.
            </p>

            <div className="mt-16">
              <h2 className="font-semibold text-md text-[#122C93]">Kode</h2>
              <InputOtp
                length={6}
                variant="bordered"
                size="lg"
                value={otp}
                onValueChange={(value) => {
                  setOtp(value);
                  if (otpError) {
                    setOtpError("");
                  }
                }}
                isInvalid={!!otpError}
                errorMessage={otpError}
              />
            </div>

            {otpGeneralError && (
              <p className="text-red-500 mt-3 font-medium text-sm bg-red-50 p-2 rounded w-full">
                {otpGeneralError}
              </p>
            )}

            <h2 className="text-sm font-light mt-5">
              Tidak menerima kode?{" "}
              <span
                className={`font-semibold cursor-pointer transition-colors duration-200 ${
                  resetLoading ? "text-gray-400" : "text-[#122C93] hover:text-[#0d1f69]"
                }`}
                onClick={resetLoading ? undefined : handleSendOtp}
              >
                {resetLoading
                  ? "Mengirim..."
                  : countdown > 0
                  ? `Kirim Ulang (${formatTime(countdown)})`
                  : "Kirim Ulang"}
              </span>
            </h2>

            <Button
              variant="solid"
              color="primary"
              size="lg"
              className="mt-10 w-full font-semibold bg-[#122C93] flex items-center justify-center"
              onClick={handleVerifyOtp}
              isDisabled={otpLoading}
            >
              {otpLoading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <span className="ml-2">Memverifikasi...</span>
                </>
              ) : (
                "Verifikasi OTP"
              )}
            </Button>
          </>
        )}

        {view === "forgot-new-password" && (
          <>
            <h2 className="font-bold text-[33px] text-[#122C93]">
              Buat Kata Sandi Baru
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Buat kata sandi yang kuat untuk mengamankan akses akun Anda.
            </p>

            <h2 className="font-semibold text-[20px] mt-16 text-[#122C93]">
              Password Baru
            </h2>
            <Input
              type={isNewPasswordVisible ? "text" : "password"}
              size="lg"
              placeholder="Masukkan Password Baru Anda"
              variant="bordered"
              maxLength={17}
              minLength={8}
              className="mt-5"
              value={newPassword}
              isInvalid={!!newPasswordErrors.newPassword}
              errorMessage={newPasswordErrors.newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (newPasswordErrors.newPassword) {
                  setNewPasswordErrors({
                    ...newPasswordErrors,
                    newPassword: undefined,
                  });
                }
              }}
              onKeyDown={handleNewPasswordKeyDown}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleNewPasswordVisibility} aria-label="toggle new password visibility">
                  {isNewPasswordVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            <h2 className="font-semibold text-[20px] mt-5 text-[#122C93]">
              Konfirmasi Password Baru
            </h2>
            <Input
              type={isConfirmPasswordVisible ? "text" : "password"}
              size="lg"
              placeholder="Konfirmasi Password Baru Anda"
              variant="bordered"
              maxLength={17}
              minLength={8}
              className="mt-5"
              value={confirmNewPassword}
              isInvalid={!!newPasswordErrors.confirmNewPassword}
              errorMessage={newPasswordErrors.confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                if (newPasswordErrors.confirmNewPassword) {
                  setNewPasswordErrors({
                    ...newPasswordErrors,
                    confirmNewPassword: undefined,
                  });
                }
              }}
              onKeyDown={handleNewPasswordKeyDown}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleConfirmPasswordVisibility} aria-label="toggle confirm password visibility">
                  {isConfirmPasswordVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            {newPasswordGeneralError && (
              <p className="text-red-500 mt-3 font-medium text-sm bg-red-50 p-2 rounded w-full">
                {newPasswordGeneralError}
              </p>
            )}

            {newPasswordSuccess && (
              <p className="text-green-600 mt-3 font-medium text-sm bg-green-50 p-2 rounded w-full">
                {newPasswordSuccess}
              </p>
            )}

            <Button
              variant="solid"
              color="primary"
              size="lg"
              className="mt-10 w-full font-semibold bg-[#122C93] flex items-center justify-center"
              onClick={handleResetPassword}
              isDisabled={newPasswordLoading}
            >
              {newPasswordLoading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <span className="ml-2">Memproses...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
