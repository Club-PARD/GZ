// src/pages/api/user/mypost.ts
import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { url } = req.query

  // 1) url 파라미터가 있으면 → 이미지 프록시
  if (url && typeof url === "string") {
    const base = process.env.NEXT_PUBLIC_API_URL || "https://gz-zigu.store/"
    if (!url.startsWith(base)) {
      return res.status(400).json({ message: "Invalid image URL" })
    }

    try {
      const forwardHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (compatible; ZiguApp/1.0)",
        Accept: "image/*,*/*;q=0.8",
        "Cache-Control": "max-age=3600",
      }
      if (req.headers.cookie) {
        forwardHeaders["Cookie"] = req.headers.cookie
      }
      if (req.headers.authorization) {
        forwardHeaders["Authorization"] = req.headers.authorization
      }

      const backendResponse = await fetch(url, {
        method: "GET",
        headers: forwardHeaders,
      })

      if (!backendResponse.ok) {
        return res
          .status(backendResponse.status)
          .json({ message: `Failed to load image: ${backendResponse.statusText}` })
      }

      const contentType = backendResponse.headers.get("content-type")
      if (contentType) {
        res.setHeader("Content-Type", contentType)
      }
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600")

      const buffer = Buffer.from(await backendResponse.arrayBuffer())
      res.setHeader("Content-Length", buffer.length)
      return res.send(buffer)
    } catch (err: any) {
      console.error("Image proxy error:", err)
      return res.status(500).json({
        message: "Internal server error",
        error: err.message ?? "Unknown error",
      })
    }
  }

  // 2) url 파라미터가 없으면 → 내 게시물 조회
  try {
    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (req.headers.cookie) {
      forwardHeaders["Cookie"] = req.headers.cookie
    }
    if (req.headers.authorization) {
      forwardHeaders["Authorization"] = req.headers.authorization
    }

    const backendResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/mypost`,
      {
        headers: forwardHeaders,
        validateStatus: () => true,
      }
    )

    const setCookie = backendResponse.headers["set-cookie"]
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie)
    }

    res.status(backendResponse.status).json(backendResponse.data)
  } catch (err: any) {
    console.error("내 물건 목록 요청 실패:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: err.message ?? "Unknown error",
    })
  }
}
