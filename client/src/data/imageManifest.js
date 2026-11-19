/**
 * Shlloka Yatra 2027 — Centralized Image Manifest
 * Exclusively powered by the 165 authentic photographs from Ameet ji's Kailash Mansarovar collection.
 * 
 * STRICT COMPLIANCE:
 * - 0 Video backgrounds or embeds
 * - 0 Stock or placeholder images
 * - All photos point directly to /assets/shlloka-yatra/images/
 */

// =========================================================================
// 1. HERO PHOTOGRAPHS
// =========================================================================
export const heroImages = {
  // Primary Master Hero Photo: Majestic Snow-Capped Himalayan Mountain Range
  mainHero: {
    id: 'sy_img_banner_mountain',
    src: '/assets/shlloka-yatra/images/sy_img_banner_mountain.jpg',
    title: 'Majestic Himalayan Snow Range & Sacred Kailash Peaks',
    alt: 'Majestic Snow-Capped Himalayan Mountain Range towering into dramatic clouds along the Kailash Yatra Route',
    category: 'Hero photographs',
  },
  // Secondary Hero: Golden Sunset Darshan
  goldenSummit: {
    id: 'sy_img_065',
    src: '/assets/shlloka-yatra/images/sy_img_065.jpg',
    title: 'Mount Kailash Golden Sunset Darshan',
    alt: 'Golden sun rays illuminating the holy snow peak of Mount Kailash',
    category: 'Hero photographs',
  },
  // Tertiary Hero: Turquoise Lake Manasarovar
  lakeManasarovar: {
    id: 'sy_img_066',
    src: '/assets/shlloka-yatra/images/sy_img_066.jpg',
    title: 'Sacred Lake Manasarovar & Snow Peaks',
    alt: 'Holy waters of Lake Manasarovar reflecting the vast Himalayan skies',
    category: 'Hero photographs',
  },
};

// =========================================================================
// 2. DESTINATION SHOWCASE PHOTOGRAPHS
// =========================================================================
export const destinationImages = {
  kailashSouthFace: {
    id: 'sy_img_116',
    src: '/assets/shlloka-yatra/images/sy_img_116.jpg',
    title: 'Mount Kailash Geological Striations',
    alt: 'Horizontal rock bands and glacial terraces of Mount Kailash',
    category: 'Kailash Mansarovar landscapes',
  },
  manasarovarShores: {
    id: 'sy_img_063',
    src: '/assets/shlloka-yatra/images/sy_img_063.jpg',
    title: 'Lake Manasarovar Serene Waters',
    alt: 'Crystal shoreline of holy Lake Manasarovar under cumulus clouds',
    category: 'Kailash Mansarovar landscapes',
  },
  rakshasTal: {
    id: 'sy_img_077',
    src: '/assets/shlloka-yatra/images/sy_img_077.jpg',
    title: 'Lake Rakshas Tal Shoreline',
    alt: 'Vast expanse of Rakshas Tal with backdrop of barren mountain peaks',
    category: 'Kailash Mansarovar landscapes',
  },
  dirapukValley: {
    id: 'sy_img_121',
    src: '/assets/shlloka-yatra/images/sy_img_121.jpg',
    title: 'Dirapuk High Valley Campsite',
    alt: 'Yatri camps and lodges positioned immediately beneath the North Face',
    category: 'Kailash Mansarovar landscapes',
  },
};

// =========================================================================
// 3. CURATED ROUTE CARDS PHOTOGRAPHS
// =========================================================================
export const routeImages = {
  option1_bus: {
    id: 'sy_img_007',
    src: '/assets/shlloka-yatra/images/sy_img_007.jpg',
    title: 'Package 1: Overland Bus via Kerung Border',
    alt: 'Himalayan mountain canyon and border transit road across Nepal and Tibet',
    category: 'Travel and expedition photographs',
  },
  option2_lhasa: {
    id: 'sy_img_066',
    src: '/assets/shlloka-yatra/images/sy_img_066.jpg',
    title: 'Package 2: Fly to Lhasa, Drive to Kailash',
    alt: 'Lake Manasarovar turquoise shores and snow-capped peaks under clear blue sky',
    category: 'Travel and expedition photographs',
  },
  option3_ali: {
    id: 'sy_img_037',
    src: '/assets/shlloka-yatra/images/sy_img_037.jpg',
    title: 'Package 3: Fly to Lhasa & Ali (Fastest Route)',
    alt: 'Trans-Himalayan snow peaks along the Ngari Gunsa aerial corridor',
    category: 'Mountain scenery',
  },
};

// =========================================================================
// 4. JOURNEY EXPERIENCE TIMELINE PHOTOGRAPHS
// =========================================================================
export const experienceImages = {
  stage1_prep: {
    id: 'sy_img_032',
    src: '/assets/shlloka-yatra/images/sy_img_032.jpg',
    title: 'Stage 1: Preparation & Valley Rest',
    alt: 'Quiet valley resort in the Himalayan foothills for initial briefing',
  },
  stage2_kathmandu: {
    id: 'sy_img_002',
    src: '/assets/shlloka-yatra/images/sy_img_002.jpg',
    title: 'Stage 2: Arrival & Green Valleys',
    alt: 'Terraced verdant valleys of Nepal surrounding Kathmandu',
  },
  stage3_ascent: {
    id: 'sy_img_067',
    src: '/assets/shlloka-yatra/images/sy_img_067.jpg',
    title: 'Stage 3: Trans-Himalayan Plateau Highway',
    alt: 'Smooth highway ascending across the vast Tibetan plateau',
  },
  stage4_manasarovar: {
    id: 'sy_img_064',
    src: '/assets/shlloka-yatra/images/sy_img_064.jpg',
    title: 'Stage 4: Lake Manasarovar Snan & Puja',
    alt: 'Holy shorelines where yatris perform morning snan and water offering',
  },
  stage5_parikrama: {
    id: 'sy_img_143',
    src: '/assets/shlloka-yatra/images/sy_img_143.jpg',
    title: 'Stage 5: Dolma La Pass at 5,630 Meters',
    alt: 'Crest of Dolma La Pass adorned with sacred Tibetan Buddhist prayer flags',
  },
  stage6_return: {
    id: 'sy_img_044',
    src: '/assets/shlloka-yatra/images/sy_img_044.jpg',
    title: 'Stage 6: Homeward Gratitude & Vistas',
    alt: 'Sunlit panoramic sweep of Himalayan ridges upon triumphant return',
  },
};

// =========================================================================
// 5. EDITORIAL & GALLERY PHOTO ARCHIVE (165 Unique Images)
// =========================================================================
export const imageManifest = [
  {
    "id": "sy_img_001",
    "src": "/assets/shlloka-yatra/images/sy_img_001.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_001",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_002",
    "src": "/assets/shlloka-yatra/images/sy_img_002.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_002",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_003",
    "src": "/assets/shlloka-yatra/images/sy_img_003.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 3",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 3",
    "width": 1280,
    "height": 591,
    "aspectRatio": "2.17",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_004",
    "src": "/assets/shlloka-yatra/images/sy_img_004.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_004",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_005",
    "src": "/assets/shlloka-yatra/images/sy_img_005.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 5",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 5",
    "width": 1280,
    "height": 591,
    "aspectRatio": "2.17",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_006",
    "src": "/assets/shlloka-yatra/images/sy_img_006.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_006",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_007",
    "src": "/assets/shlloka-yatra/images/sy_img_007.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_007",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_008",
    "src": "/assets/shlloka-yatra/images/sy_img_008.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 8",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 8",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_009",
    "src": "/assets/shlloka-yatra/images/sy_img_009.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 9",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 9",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_010",
    "src": "/assets/shlloka-yatra/images/sy_img_010.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_010",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_011",
    "src": "/assets/shlloka-yatra/images/sy_img_011.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 11",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 11",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_012",
    "src": "/assets/shlloka-yatra/images/sy_img_012.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_012",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_013",
    "src": "/assets/shlloka-yatra/images/sy_img_013.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_013",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_014",
    "src": "/assets/shlloka-yatra/images/sy_img_014.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 14",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 14",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_015",
    "src": "/assets/shlloka-yatra/images/sy_img_015.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_015",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_016",
    "src": "/assets/shlloka-yatra/images/sy_img_016.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_016",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_017",
    "src": "/assets/shlloka-yatra/images/sy_img_017.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 17",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 17",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_018",
    "src": "/assets/shlloka-yatra/images/sy_img_018.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 18",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 18",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_019",
    "src": "/assets/shlloka-yatra/images/sy_img_019.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_019",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_020",
    "src": "/assets/shlloka-yatra/images/sy_img_020.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 20",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 20",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_021",
    "src": "/assets/shlloka-yatra/images/sy_img_021.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_021",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_022",
    "src": "/assets/shlloka-yatra/images/sy_img_022.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_022",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 1102,
    "aspectRatio": "1.16",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_023",
    "src": "/assets/shlloka-yatra/images/sy_img_023.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 23",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 23",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_024",
    "src": "/assets/shlloka-yatra/images/sy_img_024.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 24",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 24",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_025",
    "src": "/assets/shlloka-yatra/images/sy_img_025.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_025",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_026",
    "src": "/assets/shlloka-yatra/images/sy_img_026.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 26",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 26",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_027",
    "src": "/assets/shlloka-yatra/images/sy_img_027.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_027",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_028",
    "src": "/assets/shlloka-yatra/images/sy_img_028.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_028",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_029",
    "src": "/assets/shlloka-yatra/images/sy_img_029.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_029",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_030",
    "src": "/assets/shlloka-yatra/images/sy_img_030.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 30",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 30",
    "width": 1280,
    "height": 803,
    "aspectRatio": "1.59",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_031",
    "src": "/assets/shlloka-yatra/images/sy_img_031.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_031",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_032",
    "src": "/assets/shlloka-yatra/images/sy_img_032.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_032",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_033",
    "src": "/assets/shlloka-yatra/images/sy_img_033.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 33",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 33",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_034",
    "src": "/assets/shlloka-yatra/images/sy_img_034.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_034",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_035",
    "src": "/assets/shlloka-yatra/images/sy_img_035.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 35",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 35",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_036",
    "src": "/assets/shlloka-yatra/images/sy_img_036.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 36",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 36",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_037",
    "src": "/assets/shlloka-yatra/images/sy_img_037.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_037",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 1102,
    "aspectRatio": "1.16",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_038",
    "src": "/assets/shlloka-yatra/images/sy_img_038.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 38",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 38",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_039",
    "src": "/assets/shlloka-yatra/images/sy_img_039.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 39",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 39",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_040",
    "src": "/assets/shlloka-yatra/images/sy_img_040.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_040",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_041",
    "src": "/assets/shlloka-yatra/images/sy_img_041.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 41",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 41",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_042",
    "src": "/assets/shlloka-yatra/images/sy_img_042.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_042",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_043",
    "src": "/assets/shlloka-yatra/images/sy_img_043.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_043",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_044",
    "src": "/assets/shlloka-yatra/images/sy_img_044.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_044",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_045",
    "src": "/assets/shlloka-yatra/images/sy_img_045.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 45",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 45",
    "width": 1280,
    "height": 394,
    "aspectRatio": "3.25",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_046",
    "src": "/assets/shlloka-yatra/images/sy_img_046.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_046",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_047",
    "src": "/assets/shlloka-yatra/images/sy_img_047.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_047",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_048",
    "src": "/assets/shlloka-yatra/images/sy_img_048.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 48",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 48",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_049",
    "src": "/assets/shlloka-yatra/images/sy_img_049.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_049",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_050",
    "src": "/assets/shlloka-yatra/images/sy_img_050.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 50",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 50",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_051",
    "src": "/assets/shlloka-yatra/images/sy_img_051.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 51",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 51",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_052",
    "src": "/assets/shlloka-yatra/images/sy_img_052.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_052",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_053",
    "src": "/assets/shlloka-yatra/images/sy_img_053.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 53",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 53",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_054",
    "src": "/assets/shlloka-yatra/images/sy_img_054.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 54",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 54",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_055",
    "src": "/assets/shlloka-yatra/images/sy_img_055.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_055",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_056",
    "src": "/assets/shlloka-yatra/images/sy_img_056.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 56",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 56",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_057",
    "src": "/assets/shlloka-yatra/images/sy_img_057.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 57",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 57",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_058",
    "src": "/assets/shlloka-yatra/images/sy_img_058.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_058",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_059",
    "src": "/assets/shlloka-yatra/images/sy_img_059.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 59",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 59",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_060",
    "src": "/assets/shlloka-yatra/images/sy_img_060.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 60",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 60",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_061",
    "src": "/assets/shlloka-yatra/images/sy_img_061.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_061",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 847,
    "aspectRatio": "1.51",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_062",
    "src": "/assets/shlloka-yatra/images/sy_img_062.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 62",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 62",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_063",
    "src": "/assets/shlloka-yatra/images/sy_img_063.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_063",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_064",
    "src": "/assets/shlloka-yatra/images/sy_img_064.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_064",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_065",
    "src": "/assets/shlloka-yatra/images/sy_img_065.jpg",
    "category": "Hero photographs",
    "title": "Mount Kailash Golden Sunset Darshan",
    "alt": "Golden sunlight illuminating the holy summit of Mount Kailash",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_066",
    "src": "/assets/shlloka-yatra/images/sy_img_066.jpg",
    "category": "Hero photographs",
    "title": "Holy Lake Manasarovar at Sunrise",
    "alt": "Calm turquoise waters of Lake Manasarovar reflecting the high Himalayas",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_067",
    "src": "/assets/shlloka-yatra/images/sy_img_067.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_067",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_068",
    "src": "/assets/shlloka-yatra/images/sy_img_068.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 68",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 68",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_069",
    "src": "/assets/shlloka-yatra/images/sy_img_069.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 69",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 69",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_070",
    "src": "/assets/shlloka-yatra/images/sy_img_070.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_070",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_071",
    "src": "/assets/shlloka-yatra/images/sy_img_071.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 71",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 71",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_072",
    "src": "/assets/shlloka-yatra/images/sy_img_072.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_072",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_073",
    "src": "/assets/shlloka-yatra/images/sy_img_073.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_073",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_074",
    "src": "/assets/shlloka-yatra/images/sy_img_074.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 74",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 74",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_075",
    "src": "/assets/shlloka-yatra/images/sy_img_075.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_075",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_076",
    "src": "/assets/shlloka-yatra/images/sy_img_076.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_076",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_077",
    "src": "/assets/shlloka-yatra/images/sy_img_077.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_077",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_078",
    "src": "/assets/shlloka-yatra/images/sy_img_078.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 78",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 78",
    "width": 1280,
    "height": 550,
    "aspectRatio": "2.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_079",
    "src": "/assets/shlloka-yatra/images/sy_img_079.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_079",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_080",
    "src": "/assets/shlloka-yatra/images/sy_img_080.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 80",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 80",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_081",
    "src": "/assets/shlloka-yatra/images/sy_img_081.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 81",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 81",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_082",
    "src": "/assets/shlloka-yatra/images/sy_img_082.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_082",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_083",
    "src": "/assets/shlloka-yatra/images/sy_img_083.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 83",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 83",
    "width": 1280,
    "height": 435,
    "aspectRatio": "2.94",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_084",
    "src": "/assets/shlloka-yatra/images/sy_img_084.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 84",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 84",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_085",
    "src": "/assets/shlloka-yatra/images/sy_img_085.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_085",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_086",
    "src": "/assets/shlloka-yatra/images/sy_img_086.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 86",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 86",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_087",
    "src": "/assets/shlloka-yatra/images/sy_img_087.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 87",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 87",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_088",
    "src": "/assets/shlloka-yatra/images/sy_img_088.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_088",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 412,
    "aspectRatio": "3.11",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_089",
    "src": "/assets/shlloka-yatra/images/sy_img_089.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 89",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 89",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_090",
    "src": "/assets/shlloka-yatra/images/sy_img_090.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 90",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 90",
    "width": 1280,
    "height": 1102,
    "aspectRatio": "1.16",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_091",
    "src": "/assets/shlloka-yatra/images/sy_img_091.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_091",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_092",
    "src": "/assets/shlloka-yatra/images/sy_img_092.jpg",
    "category": "Hero photographs",
    "title": "Tibetan Highland Valley & Mountain Vistas",
    "alt": "Vibrant plateau valleys with arid mountain backdrop",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_093",
    "src": "/assets/shlloka-yatra/images/sy_img_093.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 93",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 93",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_094",
    "src": "/assets/shlloka-yatra/images/sy_img_094.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_094",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_095",
    "src": "/assets/shlloka-yatra/images/sy_img_095.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 95",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 95",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_096",
    "src": "/assets/shlloka-yatra/images/sy_img_096.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_096",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_097",
    "src": "/assets/shlloka-yatra/images/sy_img_097.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_097",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_098",
    "src": "/assets/shlloka-yatra/images/sy_img_098.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 98",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 98",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_099",
    "src": "/assets/shlloka-yatra/images/sy_img_099.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 99",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 99",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_100",
    "src": "/assets/shlloka-yatra/images/sy_img_100.jpg",
    "category": "Hero photographs",
    "title": "Mount Kailash North Face (Dirapuk)",
    "alt": "Towering pyramid of Mount Kailash North Face viewed from Dirapuk high camp",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_101",
    "src": "/assets/shlloka-yatra/images/sy_img_101.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 101",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 101",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_102",
    "src": "/assets/shlloka-yatra/images/sy_img_102.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 102",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 102",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_103",
    "src": "/assets/shlloka-yatra/images/sy_img_103.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_103",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_104",
    "src": "/assets/shlloka-yatra/images/sy_img_104.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_104",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_105",
    "src": "/assets/shlloka-yatra/images/sy_img_105.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 105",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 105",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_106",
    "src": "/assets/shlloka-yatra/images/sy_img_106.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_106",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_107",
    "src": "/assets/shlloka-yatra/images/sy_img_107.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 107",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 107",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_108",
    "src": "/assets/shlloka-yatra/images/sy_img_108.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_108",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_109",
    "src": "/assets/shlloka-yatra/images/sy_img_109.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_109",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_110",
    "src": "/assets/shlloka-yatra/images/sy_img_110.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_110",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_111",
    "src": "/assets/shlloka-yatra/images/sy_img_111.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 111",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 111",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_112",
    "src": "/assets/shlloka-yatra/images/sy_img_112.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_112",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_113",
    "src": "/assets/shlloka-yatra/images/sy_img_113.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 113",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 113",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_114",
    "src": "/assets/shlloka-yatra/images/sy_img_114.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 114",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 114",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_115",
    "src": "/assets/shlloka-yatra/images/sy_img_115.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_115",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_116",
    "src": "/assets/shlloka-yatra/images/sy_img_116.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_116",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_117",
    "src": "/assets/shlloka-yatra/images/sy_img_117.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 117",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 117",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_118",
    "src": "/assets/shlloka-yatra/images/sy_img_118.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_118",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_119",
    "src": "/assets/shlloka-yatra/images/sy_img_119.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 119",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 119",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_120",
    "src": "/assets/shlloka-yatra/images/sy_img_120.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 120",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 120",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_121",
    "src": "/assets/shlloka-yatra/images/sy_img_121.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_121",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_122",
    "src": "/assets/shlloka-yatra/images/sy_img_122.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 122",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 122",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_123",
    "src": "/assets/shlloka-yatra/images/sy_img_123.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_123",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_124",
    "src": "/assets/shlloka-yatra/images/sy_img_124.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_124",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_125",
    "src": "/assets/shlloka-yatra/images/sy_img_125.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_125",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_126",
    "src": "/assets/shlloka-yatra/images/sy_img_126.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_126",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_127",
    "src": "/assets/shlloka-yatra/images/sy_img_127.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_127",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_128",
    "src": "/assets/shlloka-yatra/images/sy_img_128.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 128",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 128",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_129",
    "src": "/assets/shlloka-yatra/images/sy_img_129.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_129",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_130",
    "src": "/assets/shlloka-yatra/images/sy_img_130.jpg",
    "category": "Kailash Mansarovar landscapes",
    "title": "Sacred Landscape — sy_img_130",
    "alt": "Panoramic landscape of Mount Kailash and holy Lake Manasarovar",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_131",
    "src": "/assets/shlloka-yatra/images/sy_img_131.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 131",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 131",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_132",
    "src": "/assets/shlloka-yatra/images/sy_img_132.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 132",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 132",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_133",
    "src": "/assets/shlloka-yatra/images/sy_img_133.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_133",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_134",
    "src": "/assets/shlloka-yatra/images/sy_img_134.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_134",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_135",
    "src": "/assets/shlloka-yatra/images/sy_img_135.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_135",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_136",
    "src": "/assets/shlloka-yatra/images/sy_img_136.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_136",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_137",
    "src": "/assets/shlloka-yatra/images/sy_img_137.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_137",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_138",
    "src": "/assets/shlloka-yatra/images/sy_img_138.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 138",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 138",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_139",
    "src": "/assets/shlloka-yatra/images/sy_img_139.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_139",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_140",
    "src": "/assets/shlloka-yatra/images/sy_img_140.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 140",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 140",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_141",
    "src": "/assets/shlloka-yatra/images/sy_img_141.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 141",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 141",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_142",
    "src": "/assets/shlloka-yatra/images/sy_img_142.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_142",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_143",
    "src": "/assets/shlloka-yatra/images/sy_img_143.jpg",
    "category": "Pilgrimage and spiritual moments",
    "title": "Spiritual Milestone — sy_img_143",
    "alt": "Sacred prayer flags, shrines, and devotional moments on the Parikrama path",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_144",
    "src": "/assets/shlloka-yatra/images/sy_img_144.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 144",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 144",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_145",
    "src": "/assets/shlloka-yatra/images/sy_img_145.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_145",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_146",
    "src": "/assets/shlloka-yatra/images/sy_img_146.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 146",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 146",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_147",
    "src": "/assets/shlloka-yatra/images/sy_img_147.jpg",
    "category": "Travel and expedition photographs",
    "title": "Expedition Transit — sy_img_147",
    "alt": "Overland transit, high mountain passes, and Himalayan travel roads",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_148",
    "src": "/assets/shlloka-yatra/images/sy_img_148.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_148",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_149",
    "src": "/assets/shlloka-yatra/images/sy_img_149.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 149",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 149",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_150",
    "src": "/assets/shlloka-yatra/images/sy_img_150.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 150",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 150",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_151",
    "src": "/assets/shlloka-yatra/images/sy_img_151.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_151",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_152",
    "src": "/assets/shlloka-yatra/images/sy_img_152.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 152",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 152",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_153",
    "src": "/assets/shlloka-yatra/images/sy_img_153.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 153",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 153",
    "width": 1280,
    "height": 591,
    "aspectRatio": "2.17",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_154",
    "src": "/assets/shlloka-yatra/images/sy_img_154.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_154",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_155",
    "src": "/assets/shlloka-yatra/images/sy_img_155.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_155",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_156",
    "src": "/assets/shlloka-yatra/images/sy_img_156.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 156",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 156",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_157",
    "src": "/assets/shlloka-yatra/images/sy_img_157.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_157",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_158",
    "src": "/assets/shlloka-yatra/images/sy_img_158.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 158",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 158",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_159",
    "src": "/assets/shlloka-yatra/images/sy_img_159.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_159",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_160",
    "src": "/assets/shlloka-yatra/images/sy_img_160.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_160",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 960,
    "height": 1280,
    "aspectRatio": "0.75",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_161",
    "src": "/assets/shlloka-yatra/images/sy_img_161.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 161",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 161",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_162",
    "src": "/assets/shlloka-yatra/images/sy_img_162.jpg",
    "category": "Group photographs",
    "title": "Pilgrim Devotee Group — sy_img_162",
    "alt": "Devotees and yatra companions gathered on the sacred journey",
    "width": 591,
    "height": 1280,
    "aspectRatio": "0.46",
    "orientation": "portrait"
  },
  {
    "id": "sy_img_163",
    "src": "/assets/shlloka-yatra/images/sy_img_163.jpg",
    "category": "Supporting editorial photographs",
    "title": "Himalayan Detail — sy_img_163",
    "alt": "Authentic high-altitude landscape and texture from Western Tibet",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_164",
    "src": "/assets/shlloka-yatra/images/sy_img_164.jpg",
    "category": "Destination gallery",
    "title": "Kailash Pilgrimage Scene 164",
    "alt": "Sacred Kailash Mansarovar pilgrimage photograph 164",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  },
  {
    "id": "sy_img_165",
    "src": "/assets/shlloka-yatra/images/sy_img_165.jpg",
    "category": "Mountain scenery",
    "title": "Trans-Himalayan Peaks — sy_img_165",
    "alt": "Rugged high-altitude Himalayan mountain terrain and clouds",
    "width": 1280,
    "height": 960,
    "aspectRatio": "1.33",
    "orientation": "landscape"
  }
];

// Helper to look up any image by id
export function getImage(id) {
  return imageManifest.find((img) => img.id === id) || heroImages.mainHero;
}

// Helper to filter images by category
export function getImagesByCategory(category) {
  if (!category || category === 'ALL') return imageManifest;
  return imageManifest.filter((img) => img.category.toLowerCase() === category.toLowerCase());
}

export default imageManifest;
