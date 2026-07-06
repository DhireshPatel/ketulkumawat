import { supabase } from "./supabase";

export async function uploadImage(file, fileName) {
  const { error } = await supabase.storage
    .from("ebook-images")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("ebook-images").getPublicUrl(fileName);

  return data.publicUrl;
}

export async function uploadPdf(file, fileName) {
  const { data, error } = await supabase.storage
    .from("ebook-pdfs")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  return data.path;
}
