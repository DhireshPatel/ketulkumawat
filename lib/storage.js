// import { supabase } from "./supabase";

// export async function uploadImage(file, fileName) {
//   const { data, error } = await supabase.storage
//     .from("ebook-images")
//     .upload(fileName, file, {
//       upsert: true,
//     });

//   if (error) throw error;

//   const { data: publicUrl } = supabase.storage
//     .from("ebook-images")
//     .getPublicUrl(fileName);

//   return publicUrl.publicUrl;
// }

// export async function uploadPdf(file, fileName) {
//   const { data, error } = await supabase.storage
//     .from("ebook-pdfs")
//     .upload(fileName, file, {
//       upsert: true,
//     });

//   if (error) throw error;

//   return data.path;
// }

// export async function deleteImage(path) {
//   return await supabase.storage.from("ebook-images").remove([path]);
// }

// export async function deletePdf(path) {
//   return await supabase.storage.from("ebook-pdfs").remove([path]);
// }

// export async function getPdfSignedUrl(path) {
//   const { data, error } = await supabase.storage
//     .from("ebook-pdfs")
//     .createSignedUrl(path, 60);

//   if (error) throw error;

//   return data.signedUrl;
// }

import { supabaseAdmin } from "./supabase-admin";

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

export async function uploadPdf(file, fileName) {
  const { data, error } = await supabaseAdmin.storage
    .from("ebook-pdfs")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  return data.path;
}

export async function deleteImage(path) {
  const { error } = await supabaseAdmin.storage
    .from("ebook-images")
    .remove([path]);

  if (error) throw error;
}

export async function deletePdf(path) {
  const { error } = await supabaseAdmin.storage
    .from("ebook-pdfs")
    .remove([path]);

  if (error) throw error;
}

export async function getPdfSignedUrl(path) {
  const { data, error } = await supabaseAdmin.storage
    .from("ebook-pdfs")
    .createSignedUrl(path, 60);

  if (error) throw error;

  return data.signedUrl;
}

export function getImagePathFromUrl(url) {
  const marker = "/storage/v1/object/public/ebook-images/";

  if (!url.includes(marker)) return null;

  return url.split(marker)[1];
}

export function getPdfPath(path) {
  return path;
}
