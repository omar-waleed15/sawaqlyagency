import { createClient } from '@supabase/supabase-js';

const url = 'https://omysootvprkkyhhdiicc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXNvb3R2cHJra3loaGRpaWNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQ2MDkyNywiZXhwIjoyMTAyMDM2OTI3fQ.XttWgccITdkzt9HzK3WDIWY4g0C_98Rmx7u0n7ZVYUE';

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seed() {
  console.log('--- Checking and seeding database ---');

  // 1. Website Copy
  const { data: copy, error: copyErr } = await supabase.from('website_copy').select('*');
  if (copyErr) {
    console.log('website_copy status:', copyErr.message);
  } else if (copy.length === 0) {
    const { error: insErr } = await supabase.from('website_copy').insert([{
      id: 1,
      hero_sub_en: 'We craft digital experiences, high-converting marketing campaigns, and standout brand identities.',
      hero_sub_ar: 'نبتكر تجارب رقمية وحملات تسويقية عالية التحويل وهويات تجارية متميزة.',
      services_title_en: 'Our Expertise',
      services_title_ar: 'خبراتنا',
      services_sub_en: 'Transforming vision into high-impact digital solutions.',
      services_sub_ar: 'تحويل الرؤية إلى حلول رقمية عالية الأثر.',
      contact_title_en: "Let's Build Something Great Together",
      contact_title_ar: 'لنبنِ شيئاً عظيماً معاً',
      contact_sub_en: 'Reach out to start your project or discuss how we can scale your brand.',
      contact_sub_ar: 'تواصل معنا للبدء في مشروعك أو مناقشة كيف يمكننا تطوير علامتك التجارية.',
      footer_tagline_en: 'Propelling brands into the digital future.',
      footer_tagline_ar: 'ندفع العلامات التجارية نحو المستقبل الرقمي.',
      projects_title_en: 'Featured Work',
      projects_title_ar: 'أبرز أعمالنا',
      projects_sub_en: 'Explore our latest client success stories and creative showcases.',
      projects_sub_ar: 'استكشف أحدث قصص نجاح عملائنا واستعراضاتنا الإبداعية.'
    }]);
    if (insErr) console.error('Error seeding website_copy:', insErr.message);
    else console.log('Successfully seeded website_copy.');
  } else {
    console.log('website_copy already contains data.');
  }

  // 2. Social Media
  const { data: sm, error: smErr } = await supabase.from('social_media').select('*');
  if (smErr) {
    console.log('social_media status:', smErr.message);
  } else if (sm.length === 0) {
    const { error: insErr } = await supabase.from('social_media').insert([{
      id: 1,
      office_name: 'Sawaqly HQ',
      office_location: 'Cairo, Egypt',
      office_hours: 'Mon–Fri 9–6',
      map_share_url: 'https://maps.google.com/?q=Cairo,Egypt',
      map_embed_url: 'https://www.google.com/maps?q=Cairo,Egypt&output=embed',
      contact_email: 'hello@sawaqly.com',
      contact_phone: '+20 100 000 0000',
      social_instagram: 'https://instagram.com',
      social_facebook: 'https://facebook.com',
      social_tiktok: 'https://tiktok.com',
      footer_location_title: 'Our Headquarters',
      footer_location_description: 'Located in the heart of Cairo, serving clients worldwide.'
    }]);
    if (insErr) console.error('Error seeding social_media:', insErr.message);
    else console.log('Successfully seeded social_media.');
  } else {
    console.log('social_media already contains data.');
  }

  // 3. Services
  const { data: srv, error: srvErr } = await supabase.from('services').select('*');
  if (srvErr) {
    console.log('services status:', srvErr.message);
  } else if (srv.length === 0) {
    const { error: insErr } = await supabase.from('services').insert([
      { title_en: 'Digital Marketing & Growth', title_ar: 'التسويق الرقمي والنمو', description_en: 'Data-driven marketing campaigns designed to scale customer acquisition and ROI.', description_ar: 'حملات تسويقية مدعومة بالبيانات مصممة لزيادة جذب العملاء والعائد على الاستثمار.', icon: 'Megaphone', sort_order: 0 },
      { title_en: 'Brand Strategy & Visual Identity', title_ar: 'استراتيجية العلامة التجارية والهوية البصرية', description_en: 'Crafting memorable brand identities, voice, and visual assets that stand out.', description_ar: 'صناعة هويات تجارية متميزة ولغة بصرية تترك انطباعاً فريداً.', icon: 'PenTool', sort_order: 1 },
      { title_en: 'Social Media Management', title_ar: 'إدارة وسائل التواصل الاجتماعي', description_en: 'End-to-end content production, scheduling, community management, and growth.', description_ar: 'إنتاج المحتوى الكامل، الجدولة، إدارة المجتمعات والتفاعل.', icon: 'Share2', sort_order: 2 },
      { title_en: 'Video Production & Motion', title_ar: 'إنتاج الفيديو والموشن جرافيك', description_en: 'High-quality promotional videos, reels, and motion graphics for maximum engagement.', description_ar: 'فيديوهات ترويجية عالية الجودة، ريلز، وموشن جرافيك لأعلى درجات التفاعل.', icon: 'Video', sort_order: 3 }
    ]);
    if (insErr) console.error('Error seeding services:', insErr.message);
    else console.log('Successfully seeded services.');
  } else {
    console.log('services already contains data.');
  }
}

seed();
