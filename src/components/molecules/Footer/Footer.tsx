import styles from './Footer.module.css'

export default function Footer() {
  console.log('Footer rendering')
  return (
    <footer className={styles.footer} style={{ border: '5px solid red', minHeight: '100px', display: 'block' }}>
      <div className={styles.container}>
        {/* Lead Capture Section */}
        <div className={styles.leadSection}>
          <h2 className={styles.title}>Publica tus cupones en n1coDeals</h2>
          <p className={styles.subtitle}>Únete a los comercios que ya ofrecen descuentos con n1co.</p>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre de tu negocio</label>
              <input type="text" placeholder="Nombre del negocio" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tu nombre</label>
              <input type="text" placeholder="Nombre completo" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Teléfono</label>
              <input type="tel" placeholder="Teléfono de contacto" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo electrónico</label>
              <input type="email" placeholder="Correo de contacto" className={styles.input} />
            </div>

            <button type="submit" className={styles.submitButton}>
              Enviar
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className="flex flex-col items-center">
            <span className={styles.poweredBy}>Desarrollado por</span>
            <img src="/n1coDeals-white.svg" alt="n1coBusiness" className={styles.n1coLogo} />
          </div>

          <div className={styles.links}>
            <a href="#" className={styles.link}>
              Privacidad
            </a>
            <a href="#" className={styles.link}>
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
