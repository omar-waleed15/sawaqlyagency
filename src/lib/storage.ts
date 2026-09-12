import { supabase } from './supabase';

const PRIMARY_BUCKET = 'video-portfolio';
const FALLBACK_BUCKET = 'attachments';

/**
 * Upload a media file directly to Supabase Storage and return its public URL.
 */
export async function uploadMediaFile(
  file: File,
  folder: 'videos' | 'images' | 'attachments' = 'videos'
): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${cleanName}`;
  const contentType = file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg');

  // Try primary bucket first
  let targetBucket = PRIMARY_BUCKET;
  let uploadResult = await supabase.storage
    .from(targetBucket)
    .upload(filePath, file, {
      contentType,
      upsert: true,
    });

  // If primary bucket failed with not found, try fallback
  if (uploadResult.error && uploadResult.error.message?.toLowerCase().includes('bucket not found')) {
    targetBucket = FALLBACK_BUCKET;
    uploadResult = await supabase.storage
      .from(targetBucket)
      .upload(filePath, file, {
        contentType,
        upsert: true,
      });
  }

  if (uploadResult.error) {
    const errorMsg = uploadResult.error.message || 'Unknown upload error';
    const lowerMsg = errorMsg.toLowerCase();

    if (
      lowerMsg.includes('exceeded the maximum') ||
      lowerMsg.includes('too large') ||
      lowerMsg.includes('entity too large') ||
      lowerMsg.includes('payload too large') ||
      errorMsg.includes('413')
    ) {
      throw new Error(
        `This file is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Supabase Free Tier accounts have a hard limit of 50 MB per file. To upload this video: (1) compress it under 50 MB, (2) upgrade your Supabase project to Pro (5 GB limit), or (3) use the "Paste Link" tab to link it directly.`
      );
    }

    if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
      throw new Error(
        `Supabase Storage permission error: ${errorMsg}. Please ensure the '${targetBucket}' storage bucket has public upload policies enabled in Supabase SQL editor.`
      );
    }
    throw new Error(`Upload failed (${targetBucket}): ${errorMsg}`);
  }

  const { data: pubData } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(uploadResult.data.path);

  if (!pubData?.publicUrl) {
    throw new Error('Failed to retrieve public URL from Supabase Storage.');
  }

  return pubData.publicUrl;
}

/**
 * Upload a video file directly to Supabase Storage
 */
export async function uploadVideoFile(file: File): Promise<string> {
  // Check if file is video
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(file.name);
  if (!isVideo) {
    throw new Error('Please select a valid video file (.mp4, .webm, .mov, .m4v).');
  }

  return uploadMediaFile(file, 'videos');
}

/**
 * Upload an image file directly to Supabase Storage
 */
export async function uploadImageFile(file: File): Promise<string> {
  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(file.name);
  if (!isImage) {
    throw new Error('Please select a valid image file (.jpg, .png, .webp, .svg).');
  }

  return uploadMediaFile(file, 'images');
}
