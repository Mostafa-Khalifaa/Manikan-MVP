export const products = [
  {
    id: "1",
    name: "Linen Tunic Set",
    brand: "Manikan Modest",
    category: "Dresses",
    price: 680,
    currency: "EGP",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Taupe", "Ivory", "Sage"],
    rating: 4.8,
    reviews: 142,
    fit: "Relaxed",
    fabric: "100% Linen",
    description:
      "A breathable, versatile tunic-and-trouser set in soft linen. The modest long-sleeve tunic pairs with wide-leg trousers for an effortless, put-together look perfect for any occasion.",
    images: [
      "/garments/female-dress.jpg",
    ],
    tags: ["Modest", "Everyday", "Casual", "Sets"],
    gender: "female",
    ar: {
      name: "طقم تونيك من الكتان",
      category: "فساتين",
      fit: "مريح",
      fabric: "100% كتان",
      description: "طقم تونيك وبنطلون عملي ومتعدد الاستخدامات من الكتان الناعم. يأتي التونيك المحتشم بأكمام طويلة مع بنطلون واسع لإطلالة مريحة وأنيقة تناسب جميع المناسبات.",
    }
  },
  {
    id: "2",
    name: "Floral Embroidered Abaya",
    brand: "Manikan Modest",
    category: "Dresses",
    price: 950,
    currency: "EGP",
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Charcoal", "Midnight Blue", "Forest"],
    rating: 4.7,
    reviews: 89,
    fit: "Flowy",
    fabric: "Premium Polyester Crepe",
    description:
      "A stunning full-length abaya with intricate white floral embroidery on the chest and sleeves. The A-line flared silhouette flows beautifully for special occasions and everyday elegance.",
    images: [
      "/garments/female-dress2.jpg",
    ],
    tags: ["Modest", "Event", "Abaya", "Wedding Guest"],
    gender: "female",
    ar: {
      name: "عباءة مطرزة بالزهور",
      category: "فساتين",
      fit: "واسع وانسيابي",
      fabric: "كريب بوليستر ممتاز",
      description: "عباءة كاملة الطول ومذهلة بتطريزات زهور بيضاء دقيقة على الصدر والأكمام. تنسدل بقصة واسعة على شكل حرف A، مما يجعلها مثالية للمناسبات الخاصة والأناقة اليومية.",
    }
  },
  {
    id: "3",
    name: "Egyptian Heritage Abaya",
    brand: "Manikan Modest",
    category: "Dresses",
    price: 1250,
    currency: "EGP",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory & Gold", "Black & Gold", "Blush & Silver"],
    rating: 4.9,
    reviews: 211,
    fit: "Tailored Flare",
    fabric: "Chiffon & Satin Blend",
    description:
      "An exquisite open-front abaya inspired by ancient Egyptian heritage. Features hand-embroidered hieroglyphic gold motifs along the lapels, waistband and cuffs. A statement piece for formal events and celebrations.",
    images: [
      "/garments/female-dress3.png",
    ],
    tags: ["Modest", "Event", "Heritage", "Luxury", "Abaya"],
    gender: "female",
    hasTryOn: true,
    tryOnImage: "/try-on-images/female-model1-dress3.png",
    tryOnVideo: "/videos/try-on-dress3-female1.mp4",
    ar: {
      name: "عباءة التراث المصري",
      category: "فساتين",
      fit: "مفصلة وواسعة من الأسفل",
      fabric: "مزيج من الشيفون والساتان",
      description: "عباءة رائعة مفتوحة من الأمام مستوحاة من التراث المصري القديم. تتميز بزخارف ذهبية هيروغليفية مطرزة يدوياً على الياقات وحزام الخصر والأساور. قطعة استثنائية للفعاليات الرسمية والاحتفالات.",
    }
  },

  {
    id: "4",
    name: "Structured Blazer",
    brand: "Thread & Co.",
    category: "Outerwear",
    price: 1100,
    currency: "EGP",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Camel", "Ivory"],
    rating: 4.9,
    reviews: 176,
    fit: "Tailored",
    fabric: "Wool Blend",
    description:
      "A sharp, fully-lined structured blazer with clean shoulders and a single-button closure. The kind of piece that elevates any outfit, instantly.",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    ],
    tags: ["Work", "Smart Casual", "Event"],
    ar: {
      name: "سترة بليزر مهيكلة",
      category: "ملابس خارجية",
      fit: "مفصل",
      fabric: "مزيج الصوف",
      description: "سترة بليزر مهيكلة ومبطنة بالكامل بقصة أكتاف نظيفة وزر إغلاق واحد. قطعة ترفع من مستوى أي إطلالة على الفور.",
    }
  },
  {
    id: "5",
    name: "Everyday Cotton Tee",
    brand: "Forma Basics",
    category: "Tops",
    price: 220,
    currency: "EGP",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: ["White", "Black", "Sage", "Terracotta"],
    rating: 4.5,
    reviews: 412,
    fit: "Regular",
    fabric: "100% Organic Cotton",
    description:
      "Your go-to everyday tee. Made from organic cotton with a clean crew neck and a slightly boxy cut. Built to layer, built to last.",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    ],
    tags: ["Casual", "Everyday"],
    ar: {
      name: "تيشيرت قطني يومي",
      category: "بلايز",
      fit: "عادي",
      fabric: "100% قطن عضوي",
      description: "التيشيرت اليومي المفضل لديك. مصنوع من القطن العضوي بياقة دائرية نظيفة وقصة صندوقية قليلاً. صُنع ليدوم وليرتدى كطبقة أساسية.",
    }
  },
  {
    id: "6",
    name: "Pleated Wide-Leg Trousers",
    brand: "Forma Basics",
    category: "Bottoms",
    price: 690,
    currency: "EGP",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Stone", "Black", "Forest"],
    rating: 4.6,
    reviews: 87,
    fit: "Wide",
    fabric: "Crepe Fabric",
    description:
      "Fluid, pleated wide-leg trousers with a high waist and side pockets. A modern shape that's effortless and polished at the same time.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    ],
    tags: ["Work", "Smart Casual", "Event"],
    ar: {
      name: "بنطلون واسع بطيات",
      category: "سراويل",
      fit: "واسع",
      fabric: "قماش كريب",
      description: "بنطلون واسع الساقين بطيات انسيابية وخصر عالٍ وجيوب جانبية. تصميم عصري يجمع بين البساطة والأناقة في نفس الوقت.",
    }
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);

export const localizeProduct = (product, lang) => {
  if (!product) return null;
  if (lang === 'ar' && product.ar) {
    return { ...product, ...product.ar };
  }
  return product;
};
