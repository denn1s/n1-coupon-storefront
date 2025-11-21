import { Outlet } from '@tanstack/react-router'
import Navbar from '@components/molecules/Navbar'
import Footer from '@components/molecules/Footer'
import styles from './Main.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
