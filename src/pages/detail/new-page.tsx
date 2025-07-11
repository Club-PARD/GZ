"use client";
import React, { useState } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import ImageUploadSection, {
  PreviewImage,
} from "@/components/home/ImageUploadSection";
import FormSection from "@/components/home/FormSection";

export default function NewPage() {
  const [images, setImages] = useState<PreviewImage[]>([]);

  return (
    <div className="bg-white pt-16">
      <Header />
      <main className="max-w-5xl mx-auto pt-20 flex gap-12 mb-20 px-8">
        <ImageUploadSection images={images} setImages={setImages} />
        <FormSection images={images} />
      </main>
      <Footer />
    </div>
  );
}
