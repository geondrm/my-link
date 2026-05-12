import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "@/data/links";

/** Firestore 내 익명 사용자의 링크 컬렉션 경로: users/anonymous/links */
const linksCollectionRef = () =>
  collection(db, "users", "anonymous", "links");

/**
 * Firestore에서 링크 목록을 가져옵니다.
 * createdAt 기준 내림차순 정렬(최신 링크가 맨 위에 표시됨).
 */
export async function fetchLinks(): Promise<Link[]> {
  const q = query(linksCollectionRef(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title as string,
      url: data.url as string,
      clickCount: (data.clickCount as number) ?? 0,
    };
  });
}

/**
 * Firestore에 새 링크를 저장합니다.
 * Firestore가 생성한 문서 ID를 포함한 Link 객체를 반환합니다.
 */
export async function addLink(
  link: Omit<Link, "id">,
): Promise<Link> {
  const docRef = await addDoc(linksCollectionRef(), {
    title: link.title,
    url: link.url,
    clickCount: link.clickCount ?? 0,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title: link.title,
    url: link.url,
    clickCount: link.clickCount ?? 0,
  };
}
