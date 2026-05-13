/**
 * 서버 사이드에서 Firestore REST API를 통해 데이터를 조회하는 유틸리티입니다.
 * OG 이미지 생성 등 서버 컴포넌트에서 Firestore 데이터가 필요할 때 사용합니다.
 */

interface FirestoreDocument {
  fields: Record<string, FirestoreValue>;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  mapValue?: { fields: Record<string, FirestoreValue> };
  arrayValue?: { values: FirestoreValue[] };
}

interface FirestoreQueryResult {
  document?: {
    name: string;
    fields: Record<string, FirestoreValue>;
  };
}

export interface ServerUserProfile {
  uid: string;
  username: string;
  slug: string;
  bio: string;
  photoURL?: string;
}

export interface ServerLink {
  id: string;
  title: string;
  url: string;
}

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/**
 * slug를 통해 사용자 프로필을 서버에서 조회합니다.
 */
export async function getProfileBySlugServer(
  slug: string,
): Promise<ServerUserProfile | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId: "users" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "slug" },
          op: "EQUAL",
          value: { stringValue: slug },
        },
      },
      limit: 1,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const results: FirestoreQueryResult[] = await res.json();

  if (!results[0]?.document) return null;

  const fields = results[0].document.fields;
  // 문서 이름에서 uid 추출: .../users/{uid}
  const docPath = results[0].document.name;
  const uid = docPath.split("/").pop() || "";

  return {
    uid,
    username: fields.username?.stringValue || "사용자",
    slug: fields.slug?.stringValue || slug,
    bio: fields.bio?.stringValue || "",
    photoURL: fields.photoURL?.stringValue,
  };
}

/**
 * 특정 사용자의 링크 목록을 서버에서 조회합니다.
 */
export async function getLinksServer(uid: string): Promise<ServerLink[]> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}/links?pageSize=20&orderBy=createdAt%20desc`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  if (!data.documents) return [];

  return data.documents.map(
    (doc: { name: string; fields: Record<string, FirestoreValue> }) => {
      const id = doc.name.split("/").pop() || "";
      return {
        id,
        title: doc.fields.title?.stringValue || "",
        url: doc.fields.url?.stringValue || "",
      };
    },
  );
}
