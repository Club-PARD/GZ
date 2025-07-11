import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Next.js 이미지 최적화 경고 비활성화
      "@next/next/no-img-element": "off",
      // TypeScript any 타입 사용 경고를 에러에서 경고로 변경
      "@typescript-eslint/no-explicit-any": "warn",
      // React hooks 의존성 경고를 경고로 유지 (완전히 끄지 않음)
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
