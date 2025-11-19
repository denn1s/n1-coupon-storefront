import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '@stores/authStore'
import { startOTP, verifyOTP } from '@lib/auth/authService'
import PhoneInput from 'react-phone-number-input'
import OtpInput from 'react-otp-input'
import 'react-phone-number-input/style.css'
import styles from './Login.module.css'

/**
 * Login Page - Passwordless OTP Authentication
 *
 * Two-step authentication flow:
 * 1. User enters phone number
 * 2. User enters OTP code received via SMS
 */
export default function Login() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })
  const { setAuthState } = useAuthStore()

  // Form state
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get redirect path from query params or default to /orders
  const redirectTo = (search as { redirect?: string })?.redirect || '/orders'

  /**
   * Step 1: Send OTP to phone
   */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate phone number
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)

    try {
      await startOTP(phone)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Step 2: Verify OTP and login
   */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const response = await verifyOTP(phone, otp)

      // Store auth state (including id_token)
      setAuthState(response.access_token, response.id_token, response.refresh_token, response.user)

      // Redirect to intended page or orders
      navigate({ to: redirectTo })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP')
      setOtp('') // Clear OTP on error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Go back to phone input step
   */
  const handleBackToPhone = () => {
    setStep('phone')
    setOtp('')
    setError(null)
  }

  /**
   * Resend OTP
   */
  const handleResendOTP = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await startOTP(phone)
      setError(null)
      // Show success message briefly
      setError('OTP sent! Check your phone.')
      setTimeout(() => setError(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          {/* Logo/Title */}
          <div className={styles.header}>
            <h1 className={styles.title}>{step === 'phone' ? 'Welcome' : 'Enter Code'}</h1>
            <p className={styles.subtitle}>
              {step === 'phone' ? 'Enter your phone number to get started' : `We sent a code to ${phone}`}
            </p>
          </div>

          {/* Step 1: Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className={styles.form}>
              <div className={styles.formControl}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Phone Number</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={(value) => setPhone(value || '')}
                  className={styles.phoneInput}
                  disabled={isLoading}
                  placeholder="Enter phone number"
                />
              </div>

              {error && (
                <div className={styles.alert}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.alertIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className={styles.button} disabled={isLoading || !phone}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Sending...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className={styles.form}>
              <div className={styles.formControl}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Verification Code</span>
                </label>
                <div className={styles.otpContainer}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <input {...props} className={styles.otpInput} />}
                    inputType="tel"
                    shouldAutoFocus
                    containerStyle={styles.otpInputContainer}
                  />
                </div>
              </div>

              {error && (
                <div className={styles.alert}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.alertIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className={styles.button} disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Verifying...
                  </>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className={styles.actions}>
                <button type="button" onClick={handleBackToPhone} className={styles.linkButton} disabled={isLoading}>
                  ← Change phone number
                </button>
                <button type="button" onClick={handleResendOTP} className={styles.linkButton} disabled={isLoading}>
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
