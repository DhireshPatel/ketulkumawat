import { supabase } from "./supabase/server";

async function getSignedUpload(bucket, fileName) {
  const res = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucket,
      fileName,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error);
  }

  return result;
}

// export async function uploadPdf(file, fileName) {
//   const { token, path } = await getSignedUpload("ebook-pdfs", fileName);

//   const { error } = await supabase.storage
//     .from("ebook-pdfs")
//     .uploadToSignedUrl(path, token, file);

//   if (error) throw error;

//   return path;
// }
export async function uploadPdf(file, fileName) {
  const { token, path } = await getSignedUpload("ebook-pdfs", fileName);

  const { error } = await supabase.storage
    .from("ebook-pdfs")
    .uploadToSignedUrl(path, token, file);

  if (error) throw error;

  // 👇 Public URL banao
  const { data } = supabase.storage.from("ebook-pdfs").getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadImage(file, fileName) {
  const { token, path } = await getSignedUpload("ebook-images", fileName);

  const { error } = await supabase.storage
    .from("ebook-images")
    .uploadToSignedUrl(path, token, file);

  if (error) throw error;

  const { data } = supabase.storage.from("ebook-images").getPublicUrl(path);

  return data.publicUrl;
}
