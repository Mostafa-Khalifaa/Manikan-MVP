// Manikan — Virtual Try-On Models Data
// Male models use real AI-generated photos.
// Female (hijab) models use styled CSS avatars for the MVP.

export const maleModels = [
  {
    id: 'm1',
    label: 'Slim',
    bodyType: 'slim',
    skin: 'light',
    emoji: '🧍',
    img: `/models/m1.png`,
    description: 'Slim build · Light skin',
  },
  {
    id: 'm2',
    label: 'Slim',
    bodyType: 'slim',
    skin: 'dark',
    emoji: '🧍',
    img: `/models/m2.png`,
    description: 'Slim build · Dark skin',
  },
  {
    id: 'm3',
    label: 'Average',
    bodyType: 'average',
    skin: 'light',
    emoji: '🧍',
    img: `/models/m3.png`,
    description: 'Average build · Light skin',
  },
  {
    id: 'm4',
    label: 'Average',
    bodyType: 'average',
    skin: 'dark',
    emoji: '🧍',
    img: `/models/m4.png`,
    description: 'Average build · Dark skin',
  },
  {
    id: 'm5',
    label: 'Broad',
    bodyType: 'heavy',
    skin: 'light',
    emoji: '🧍',
    img: `/models/m5.png`,
    description: 'Broad build · Light skin',
  },
  {
    id: 'm6',
    label: 'Broad',
    bodyType: 'heavy',
    skin: 'dark',
    emoji: '🧍',
    img: `/models/m6.png`,
    description: 'Broad build · Dark skin',
  },
];

// Female hijab models — using real model photo for all body types (MVP)
const FEMALE_MODEL_PHOTO = `/models/female-model1.png`;

export const femaleModels = [
  {
    id: 'f1',
    label: 'Slim',
    bodyType: 'slim',
    skin: 'light',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#F5D5B0',
    hijabColor: '#7C9E87',
    description: 'Slim build · Light skin',
  },
  {
    id: 'f2',
    label: 'Slim',
    bodyType: 'slim',
    skin: 'dark',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#8D5524',
    hijabColor: '#4A6FA5',
    description: 'Slim build · Dark skin',
  },
  {
    id: 'f3',
    label: 'Average',
    bodyType: 'average',
    skin: 'light',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#E8B88A',
    hijabColor: '#9E7C9E',
    description: 'Average build · Light skin',
  },
  {
    id: 'f4',
    label: 'Average',
    bodyType: 'average',
    skin: 'dark',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#6B3A2A',
    hijabColor: '#C4956A',
    description: 'Average build · Dark skin',
  },
  {
    id: 'f5',
    label: 'Broad',
    bodyType: 'heavy',
    skin: 'light',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#F0C8A0',
    hijabColor: '#5B8A72',
    description: 'Broad build · Light skin',
  },
  {
    id: 'f6',
    label: 'Broad',
    bodyType: 'heavy',
    skin: 'dark',
    img: FEMALE_MODEL_PHOTO,
    skinColor: '#7A4419',
    hijabColor: '#3D6B8A',
    description: 'Broad build · Dark skin',
  },
];

// Helper: pick best-matching model based on measurements
export function suggestModel(gender, heightCm, weightKg) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  let bodyType = 'average';
  if (bmi < 21) bodyType = 'slim';
  else if (bmi > 27) bodyType = 'heavy';

  const pool = gender === 'male' ? maleModels : femaleModels;
  return pool.find((m) => m.bodyType === bodyType) || pool[2];
}
