import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.name}>홍길동<br />Developer</h1>
        <div className={styles.bio}>
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 
          아름답고 직관적인 UI/UX에 관심이 많으며, 강렬한 색상과 대비를 사랑합니다.
        </div>
      </section>

      <section className={styles.linksContainer}>
        <a href="https://github.com/geondrm" target="_blank" rel="noopener noreferrer" className={styles.linkBox}>
          <span>GitHub</span>
          <span className={styles.arrow}>→</span>
        </a>
        <a href="#" className={styles.linkBox}>
          <span>Blog</span>
          <span className={styles.arrow}>→</span>
        </a>
        <a href="#" className={styles.linkBox}>
          <span>Portfolio</span>
          <span className={styles.arrow}>→</span>
        </a>
      </section>
    </main>
  );
}
