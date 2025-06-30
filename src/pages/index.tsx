import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => router.push("/home")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        홈으로 가기
      </button>
    </main>
  );
}
