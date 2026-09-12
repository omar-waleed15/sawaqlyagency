import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const serviceRoleKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET = 'video-portfolio';

const REELS_DATA = [
  {
    id: "reel-1",
    titleEn: "Athletic Conditioning & Form",
    titleAr: "تدريب اللياقة البدنية والأداء الرياضي",
    categoryEn: "Fitness",
    categoryAr: "رياضة ولياقة",
    views: "1Million",
    viewCountNum: 1000000,
    likes: "42.5K",
    shares: "3.2K",
    posterUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/42823/42823-720.mp4",
    duration: "0:24",
  },
  {
    id: "reel-2",
    titleEn: "Alpine Summit High Exploration",
    titleAr: "استكشاف قمم جبال الألب الثلجية",
    categoryEn: "Adventure",
    categoryAr: "مغامرة وطبيعة",
    views: "2Million",
    viewCountNum: 2000000,
    likes: "185K",
    shares: "14.9K",
    posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/42825/42825-720.mp4",
    duration: "0:18",
  },
  {
    id: "reel-3",
    titleEn: "Grace & Motion Ballet Solo",
    titleAr: "فن الحركة ورشاقة الباليه التعبيري",
    categoryEn: "Arts",
    categoryAr: "فنون واستعراض",
    views: "12Million",
    viewCountNum: 12000000,
    likes: "890K",
    shares: "64.2K",
    posterUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/41553/41553-720.mp4",
    duration: "0:30",
  },
  {
    id: "reel-4",
    titleEn: "Sunset Zenith Silhouette",
    titleAr: "رقصة الغروب التعبيرية الخالدة",
    categoryEn: "Viral Campaign",
    categoryAr: "حملة إبداعية واسعة",
    views: "121Million",
    viewCountNum: 121000000,
    likes: "8.4M",
    shares: "940K",
    posterUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/40292/40292-720.mp4",
    duration: "0:15",
  },
  {
    id: "reel-5",
    titleEn: "Midnight Festival Soundstage",
    titleAr: "أجواء الحفل الموسيقي وأضواء المسرح",
    categoryEn: "Entertainment",
    categoryAr: "ترفيه وموسيقى",
    views: "4Million",
    viewCountNum: 4000000,
    likes: "320K",
    shares: "28.5K",
    posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/43529/43529-720.mp4",
    duration: "0:20",
  },
  {
    id: "reel-6",
    titleEn: "Future Vision Athletics",
    titleAr: "رؤية مستقبلية للموضة الرياضية",
    categoryEn: "Fashion Tech",
    categoryAr: "أزياء عصرية",
    views: "4Million",
    viewCountNum: 4000000,
    likes: "410K",
    shares: "36K",
    posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/43527/43527-720.mp4",
    duration: "0:22",
  },
  {
    id: "reel-7",
    titleEn: "Ignite Haute Couture Sparks",
    titleAr: "أزياء سينمائية وتأثيرات ضوئية",
    categoryEn: "Creative Ad",
    categoryAr: "إعلان سينمائي",
    views: "4Million",
    viewCountNum: 4000000,
    likes: "520K",
    shares: "41.8K",
    posterUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/43533/43533-720.mp4",
    duration: "0:19",
  },
  {
    id: "reel-8",
    titleEn: "Skyscrapers & Urban Energy",
    titleAr: "طاقة المدن وأبراج المستقبل",
    categoryEn: "Commercial",
    categoryAr: "إعلان تجاري",
    views: "1Million",
    viewCountNum: 1000000,
    likes: "95K",
    shares: "8.1K",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/42827/42827-720.mp4",
    duration: "0:16",
  },
];

async function migrate() {
  console.log('--- Starting Migration of Video Portfolio to Supabase Storage ---');

  // 1. Verify / Create Bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET || b.id === BUCKET);
  if (!exists) {
    console.log(`Creating bucket ${BUCKET}...`);
    const { error: bErr } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (bErr) console.error('Bucket error:', bErr.message);
  } else {
    console.log(`Bucket ${BUCKET} already exists.`);
  }

  const updatedReels = [];

  for (let i = 0; i < REELS_DATA.length; i++) {
    const reel = REELS_DATA[i];
    console.log(`\nProcessing [${i + 1}/${REELS_DATA.length}]: ${reel.titleEn}...`);

    // 1. Poster
    const posterPath = `posters/${reel.id}.jpg`;
    console.log(`Downloading poster from: ${reel.posterUrl}`);
    const posterRes = await fetch(reel.posterUrl);
    const posterBuf = Buffer.from(await posterRes.arrayBuffer());
    console.log(`Uploading poster (${posterBuf.length} bytes) to ${posterPath}...`);
    const { error: posterErr } = await supabase.storage.from(BUCKET).upload(posterPath, posterBuf, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (posterErr) console.error(`Error uploading poster for ${reel.id}:`, posterErr.message);

    const { data: posterPub } = supabase.storage.from(BUCKET).getPublicUrl(posterPath);
    const supabasePosterUrl = posterPub.publicUrl;

    // 2. Video
    const videoPath = `reels/${reel.id}.mp4`;
    console.log(`Downloading video from: ${reel.videoUrl}`);
    const videoRes = await fetch(reel.videoUrl);
    const videoBuf = Buffer.from(await videoRes.arrayBuffer());
    console.log(`Uploading video (${videoBuf.length} bytes) to ${videoPath}...`);
    const { error: videoErr } = await supabase.storage.from(BUCKET).upload(videoPath, videoBuf, {
      contentType: 'video/mp4',
      upsert: true,
    });
    if (videoErr) console.error(`Error uploading video for ${reel.id}:`, videoErr.message);

    const { data: videoPub } = supabase.storage.from(BUCKET).getPublicUrl(videoPath);
    const supabaseVideoUrl = videoPub.publicUrl;

    updatedReels.push({
      ...reel,
      posterUrl: supabasePosterUrl,
      videoUrl: supabaseVideoUrl,
    });

    console.log(`✅ Reel ${reel.id} uploaded successfully!`);
    console.log(`   Poster: ${supabasePosterUrl}`);
    console.log(`   Video:  ${supabaseVideoUrl}`);
  }

  console.log('\n--- Finished uploading all reels to Supabase Storage! ---');

  // Try to upsert into database video_reels table if it exists
  try {
    const dbPayload = updatedReels.map((r, index) => ({
      id: r.id,
      title_en: r.titleEn,
      title_ar: r.titleAr,
      category_en: r.categoryEn,
      category_ar: r.categoryAr,
      views: r.views,
      view_count_num: r.viewCountNum,
      likes: r.likes,
      shares: r.shares,
      poster_url: r.posterUrl,
      video_url: r.videoUrl,
      duration: r.duration,
      sort_order: index,
    }));

    const { error: dbErr } = await supabase.from('video_reels').upsert(dbPayload);
    if (dbErr) {
      console.log('Notice: Could not insert directly to video_reels table (table might need to be created in SQL editor):', dbErr.message);
    } else {
      console.log('✅ Successfully populated video_reels table in Supabase database!');
    }
  } catch (err) {
    console.log('video_reels table insert note:', err.message);
  }

  // Write the updated reels to mockReelsData.ts
  const mockFileContent = `export interface ReelItem {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  views: string;
  viewCountNum: number;
  likes: string;
  shares: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;
}

export const MOCK_REELS: ReelItem[] = ${JSON.stringify(updatedReels, null, 2)};
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/mockReelsData.ts'), mockFileContent, 'utf8');
  console.log('✅ Updated src/data/mockReelsData.ts with Supabase-hosted URLs!');
}

migrate().catch(console.error);
