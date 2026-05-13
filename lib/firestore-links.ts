import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "@/data/links";

/** Firestore 내 사용자의 링크 컬렉션 경로: users/{uid}/links */
const linksCollectionRef = (uid: string) =>
  collection(db, "users", uid, "links");

/**
 * Firestore에서 링크 목록을 가져옵니다.
 * createdAt 기준 내림차순 정렬(최신 링크가 맨 위에 표시됨).
 */
export async function fetchLinks(uid: string): Promise<Link[]> {
  const q = query(linksCollectionRef(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title as string,
      url: data.url as string,
      clickCount: (data.clickCount as number) ?? 0,
      updatedAt: data.updatedAt ? data.updatedAt.toMillis() : undefined,
    };
  });
}

/**
 * Firestore에 새 링크를 저장합니다.
 * Firestore가 생성한 문서 ID를 포함한 Link 객체를 반환합니다.
 */
export async function addLink(
  uid: string,
  link: Omit<Link, "id">,
): Promise<Link> {
  const docRef = await addDoc(linksCollectionRef(uid), {
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

/**
 * Firestore에 링크를 업데이트합니다.
 * 업데이트된 시각의 대략적인 밀리초 값을 반환합니다.
 */
export async function updateLink(uid: string, id: string, updates: Partial<Omit<Link, "id">>): Promise<number> {
  const docRef = doc(db, "users", uid, "links", id);
  const now = Date.now();
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  return now;
}

/**
 * Firestore에서 링크를 삭제합니다.
 */
export async function deleteLink(uid: string, id: string): Promise<void> {
  const docRef = doc(db, "users", uid, "links", id);
  await deleteDoc(docRef);
}
