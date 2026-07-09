import { supabaseAdmin } from "./supabase-admin";

// export async function uploadPdf(file, fileName) {
//   const { data, error } = await supabaseAdmin.storage
//     .from("ebook-pdfs")
//     .upload(fileName, file, {
//       upsert: true,
//     });

//   if (error) throw error;

//   return data.path;
// }

// new for free download ->
export async function uploadPdf(file, fileName) {
  const { error } = await supabaseAdmin.storage
    .from("ebook-pdfs")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("ebook-pdfs")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function uploadImage(file, fileName) {
  const { error } = await supabaseAdmin.storage
    .from("ebook-images")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("ebook-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
