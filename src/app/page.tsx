"use client"

import { ChatbotUISVG } from "../components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import styles from "./page.module.css"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <div className={styles.page}>
      {/* HEADER: logo on the left, nav links on the right */}
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          {/* Logo (shifted to top-left) */}
          <Link href="/">
            {/* Adjust scale to make it smaller as desired */}
            <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.2}/>
          </Link>
        </div>

        {/* Nav links (GitHub, Login, Sign Up) on the right */}
        <nav className={styles.nav}>
          <Link
            href="https://github.com/immortalshadow007"
            className={styles.githubLink}
          >
            GitHub
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
          <Link href="/signup" className={styles.signupLink}>
            Sign Up
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT: Centered hero section */}
      <main className={styles.main}>
        <h1 className={styles.title}>Empire of Lone Wanderer</h1>

        <Link href="/login" className={styles.startButton}>
          New Chat
          <IconArrowRight size={20} />
        </Link>
      </main>
    </div>
  );
}
