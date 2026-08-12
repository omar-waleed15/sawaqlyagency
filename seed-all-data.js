import { createClient } from '@supabase/supabase-js';

const url = 'https://omysootvprkkyhhdiicc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXNvb3R2cHJra3loaGRpaWNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQ2MDkyNywiZXhwIjoyMTAyMDM2OTI3fQ.XttWgccITdkzt9HzK3WDIWY4g0C_98Rmx7u0n7ZVYUE';

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seed() {
  console.log('--- Starting full database seeding ---');

  // 1. Website Copy
  console.log('Seeding website_copy...');
  const { error: copyErr } = await supabase.from('website_copy').upsert([{
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
  if (copyErr) console.error('website_copy error:', copyErr.message);
  else console.log('website_copy done!');

  // 2. Social Media
  console.log('Seeding social_media...');
  const { error: smErr } = await supabase.from('social_media').upsert([{
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
  if (smErr) console.error('social_media error:', smErr.message);
  else console.log('social_media done!');

  // 3. Services
  console.log('Seeding services...');
  const { data: existingServices, error: srvErr } = await supabase.from('services').select('*');
  if (srvErr) {
    console.error('services fetch error:', srvErr.message);
  } else if (existingServices.length === 0) {
    const { error: insErr } = await supabase.from('services').insert([
      { title_en: 'Digital Marketing & Growth', title_ar: 'التسويق الرقمي والنمو', description_en: 'Data-driven marketing campaigns designed to scale customer acquisition and ROI.', description_ar: 'حملات تسويقية مدعومة بالبيانات مصممة لزيادة جذب العملاء والعائد على الاستثمار.', icon: 'Megaphone', sort_order: 0 },
      { title_en: 'Brand Strategy & Visual Identity', title_ar: 'استراتيجية العلامة التجارية والهوية البصرية', description_en: 'Crafting memorable brand identities, voice, and visual assets that stand out.', description_ar: 'صناعة هويات تجارية متميزة ولغة بصرية تترك انطباعاً فريداً.', icon: 'PenTool', sort_order: 1 },
      { title_en: 'Social Media Management', title_ar: 'إدارة وسائل التواصل الاجتماعي', description_en: 'End-to-end content production, scheduling, community management, and growth.', description_ar: 'إنتاج المحتوى الكامل، الجدولة، إدارة المجتمعات والتفاعل.', icon: 'Share2', sort_order: 2 },
      { title_en: 'Video Production & Motion', title_ar: 'إنتاج الفيديو والموشن جرافيك', description_en: 'High-quality promotional videos, reels, and motion graphics for maximum engagement.', description_ar: 'فيديوهات ترويجية عالية الجودة، ريلز، وموشن جرافيك لأعلى درجات التفاعل.', icon: 'Video', sort_order: 3 }
    ]);
    if (insErr) console.error('Error seeding services:', insErr.message);
    else console.log('services seeded!');
  } else {
    console.log('services already populated.');
  }

  // 4. Brands
  console.log('Seeding brands...');
  const { data: existingBrands, error: brErr } = await supabase.from('brands').select('*');
  if (brErr) {
    console.error('brands fetch error:', brErr.message);
  } else if (existingBrands.length === 0) {
    const { error: insErr } = await supabase.from('brands').insert([
      { name: 'APEX GLOBAL', logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', sort_order: 1 },
      { name: 'LUMINA TECH', logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80', sort_order: 2 },
      { name: 'VELOCITY MEDIA', logo_url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200&auto=format&fit=crop&q=80', sort_order: 3 },
      { name: 'NEXUS CORP', logo_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&auto=format&fit=crop&q=80', sort_order: 4 }
    ]);
    if (insErr) console.error('Error seeding brands:', insErr.message);
    else console.log('brands seeded!');
  } else {
    console.log('brands already populated.');
  }

  // 5. Team
  console.log('Seeding team...');
  const { data: existingTeam, error: tmErr } = await supabase.from('team').select('*');
  if (tmErr) {
    console.error('team fetch error:', tmErr.message);
  } else if (existingTeam.length === 0) {
    const { error: insErr } = await supabase.from('team').insert([
      { name: 'Ahmed Hassan', name_en: 'Ahmed Hassan', name_ar: 'أحمد حسن', role: 'Creative Director', role_en: 'Creative Director', role_ar: 'المدير الإبداعي', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', sort_order: 1 },
      { name: 'Nour El-Din', name_en: 'Nour El-Din', name_ar: 'نور الدين', role: 'Head of Growth & Performance', role_en: 'Head of Growth & Performance', role_ar: 'رئيس نمو واستراتيجيات التسويق', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', sort_order: 2 },
      { name: 'Sarah Khaled', name_en: 'Sarah Khaled', name_ar: 'سارة خالد', role: 'Lead Brand Strategist', role_en: 'Lead Brand Strategist', role_ar: 'أخصائية استراتيجيات العلامة التجارية', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80', sort_order: 3 },
      { name: 'Omar Waleed', name_en: 'Omar Waleed', name_ar: 'عمر وليد', role: 'Art Director & Motion Lead', role_en: 'Art Director & Motion Lead', role_ar: 'مدير فني ومخرج موشن جرافيك', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', sort_order: 4 }
    ]);
    if (insErr) console.error('Error seeding team:', insErr.message);
    else console.log('team seeded!');
  } else {
    console.log('team already populated.');
  }

  // 6. Projects
  console.log('Seeding projects...');
  const { data: existingProjects, error: prjErr } = await supabase.from('projects').select('*');
  if (prjErr) {
    console.error('projects fetch error:', prjErr.message);
  } else if (existingProjects.length === 0) {
    const { data: srvData } = await supabase.from('services').select('id, title_en');
    const getSrvId = (title) => srvData?.find(s => s.title_en?.includes(title))?.id || null;

    const { error: insErr } = await supabase.from('projects').insert([
      {
        title_en: 'Apex Luxury Brand Identity & Rebrand',
        title_ar: 'إعادة رسم الهوية البصرية لعلامة أبكس الفاخرة',
        description_en: 'A comprehensive brand transformation for a high-end luxury timepieces brand.',
        description_ar: 'تحول شامل للهوية البصرية لعلامة تجارية متخصصة في الساعات الفاخرة.',
        client_en: 'Apex Luxury Group',
        client_ar: 'مجموعة أبكس الفاخرة',
        year: '2025',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        service_id: getSrvId('Brand'),
        tags: ['Branding', 'Visual Identity', 'UI/UX'],
        sort_order: 1
      },
      {
        title_en: 'Horizon Financial 300% ROI Growth Campaign',
        title_ar: 'حملة النمو والتسويق الرقمي لمؤسسة هورايزون المالية',
        description_en: 'Performance marketing & customer acquisition strategy scaling user growth across digital platforms.',
        description_ar: 'استراتيجية الأداء والتسويق الرقمي التي ضاعفت قاعدة مستخدمي هورايزون عبر القنوات الرقمية.',
        client_en: 'Horizon Financial Tech',
        client_ar: 'هورايزون للتكنولوجيا المالية',
        year: '2024',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        service_id: getSrvId('Digital Marketing'),
        tags: ['Growth Marketing', 'Paid Ads', 'Conversion Rate'],
        sort_order: 2
      }
    ]);
    if (insErr) console.error('Error seeding projects:', insErr.message);
    else console.log('projects seeded!');
  } else {
    console.log('projects already populated.');
  }

  console.log('--- Seeding check completed ---');
}

seed();
