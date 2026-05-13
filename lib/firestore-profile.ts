import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  username: string; // 표시되는 실제 이름
  slug: string;     // URL에 사용되는 고유 아이디 (displayname)
  bio: string;      // 한 줄 소개
  photoURL?: string;
}

/**
 * Firestore에서 특정 사용자의 프로필을 가져옵니다.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
}

/**
 * Firestore에서 slug(displayname)를 통해 사용자 프로필을 가져옵니다.
 */
export async function getUserProfileBySlug(slug: string): Promise<UserProfile | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].data() as UserProfile;
  }
  return null;
}

/**
 * 사용자 프로필을 생성하거나 업데이트합니다.
 */
export async function saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, profile, { merge: true });
}

const RESERVED_SLUGS = ["login", "admin", "api", "dashboard"];

/**
 * 주어진 slug(displayname)가 사용 가능한지(중복되지 않는지) 확인합니다.
 * 본인이 이미 사용 중인 slug라면 true를 반환합니다.
 */
export async function isSlugAvailable(slug: string, currentUid: string): Promise<boolean> {
  // 예약어 방지 로직
  if (RESERVED_SLUGS.includes(slug)) {
    return false;
  }

  // slug는 영문 소문자, 숫자, 밑줄, 하이픈만 허용하도록 정규식 검사
  if (!/^[a-z0-9_-]+$/.test(slug)) {
    return false;
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return true; // 아무도 사용하지 않음
  }

  // 문서가 존재할 경우, 그 문서가 현재 로그인한 사용자의 문서인지 확인
  let available = true;
  snapshot.forEach((doc) => {
    if (doc.id !== currentUid) {
      available = false; // 다른 사용자가 이미 사용 중임
    }
  });

  return available;
}
