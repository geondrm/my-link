import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <Image
          src="/profile_avatar.png"
          alt="Profile Avatar"
          width={120}
          height={120}
          className={styles.avatar}
          priority
        />
        
        <h1 className={styles.name}>홍길동</h1>
        <p className={styles.bio}>
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 
          아름답고 직관적인 UI/UX에 관심이 많습니다.
        </p>

        <div className={styles.links}>
          <a href="https://github.com/geondrm" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
            GitHub 프로필
          </a>
          <a href="#" className={styles.linkButton}>
            블로그 (준비 중)
          </a>
          <a href="#" className={styles.linkButton}>
            포트폴리오
          </a>
        </div>
      </div>
    </main>
  );
}
