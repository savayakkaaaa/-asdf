import { useState, useRef } from 'react'

// ДЕМО-авторизация. Никакие реальные SMS не отправляются и не проверяются.
// Пин-код фиксированный (0000) только для показа интерфейса.
const DEMO_CODE = '0000'

export default function Login({ onLogin }) {
  const [step, setStep] = useState('phone') // phone -> code
  const [phone, setPhone] = useState('')
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const inputs = useRef([])

  const sendCode = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Введите номер телефона')
      return
    }
    setError('')
    setStep('code')
  }

  const onDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 3) inputs.current[i + 1]?.focus()
    if (next.every((d) => d !== '')) {
      if (next.join('') === DEMO_CODE) onLogin()
      else {
        setError('Неверный код. Демо-код: 0000')
        setDigits(['', '', '', ''])
        inputs.current[0]?.focus()
      }
    }
  }

  return (
    <div className="login">
      <div className="logo">Kaspi.kz</div>
      <div className="sub">Веб-версия · демо-прототип</div>

      <div className="card-login">
        {step === 'phone' ? (
          <>
            <div className="field">
              <label>Номер телефона</label>
              <input
                inputMode="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {error && <div className="hint" style={{ color: 'var(--kaspi-red)' }}>{error}</div>}
            <button className="btn mt8" onClick={sendCode}>Получить код</button>
            <div className="hint">
              🔒 Демо. Настоящая версия использовала бы SMS / биометрию / eGov.
              Реальные данные не вводите.
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label>Код из SMS (демо: 0000)</label>
              <div className="otp">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => onDigit(i, e.target.value)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>
            {error && <div className="hint" style={{ color: 'var(--kaspi-red)' }}>{error}</div>}
            <button className="btn ghost mt8" onClick={() => setStep('phone')}>Изменить номер</button>
            <div className="hint">Введите 0000, чтобы войти в демонстрацию.</div>
          </>
        )}
      </div>
    </div>
  )
}
