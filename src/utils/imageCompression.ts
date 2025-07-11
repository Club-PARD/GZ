export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");

    img.onload = () => {
      let maxWidth: number, maxHeight: number, quality: number;
      if (file.size > 10 * 1024 * 1024) {
        maxWidth = maxHeight = 800;
        quality = 0.4;
      } else if (file.size > 5 * 1024 * 1024) {
        maxWidth = maxHeight = 1200;
        quality = 0.5;
      } else if (file.size > 2 * 1024 * 1024) {
        maxWidth = maxHeight = 1600;
        quality = 0.6;
      } else {
        maxWidth = maxHeight = 1920;
        quality = 0.8;
      }

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressed = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          if (compressed.size > 3 * 1024 * 1024) {
            canvas.toBlob(
              (b2) => {
                if (b2) {
                  resolve(
                    new File([b2], file.name, {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    })
                  );
                } else resolve(compressed);
              },
              "image/jpeg",
              0.3
            );
          } else {
            resolve(compressed);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = URL.createObjectURL(file);
  });
};
