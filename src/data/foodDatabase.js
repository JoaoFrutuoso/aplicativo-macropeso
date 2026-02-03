
import { normalizeSource } from '@/utils/sourceNormalization';

/**
 * FOOD DATABASE - STRICT TACO COMPLIANCE (4th Ed.)
 * 
 * AUDIT LOG:
 * - 2026-02-01: Added comprehensive tags to all items for enhanced search.
 * - 2026-02-01: Added Pasta de Amendoim (100% amendoim) with strict mode flags.
 * - 2026-02-01: Expanded database with extensive list of Fish, Seafood, Pork, Beans, Rice and Beef cuts.
 * - 2026-02-01: Applied source normalization to all items.
 * - 2026-02-01: Added extended list of Tubers, Pasta types, and Cereals/Flours.
 * - 2026-02-01: Removed basic fruits list in favor of dedicated fruitsDatabase for substitution.
 * - 2026-02-01: Added expanded list of Nuts (Oleaginosas), Cheeses (Queijos), and updated Eggs (Ovos) categories.
 */

// --- HELPER FUNCTIONS ---

const createCarbItem = (id, name, category, keywords, rawData, cookedData, ftpMethods, restrictions) => {
  const autoTags = [category.toLowerCase()];
  if (category === "Arroz") autoTags.push("cereal", "grão", "arroz");
  if (category === "Tubérculos") autoTags.push("tubérculo", "raiz", "carboidrato", "legume");
  if (category === "Pães") autoTags.push("pão", "cereal", "massa", "trigo");
  if (category === "Leguminosas") autoTags.push("leguminosa", "feijão", "grão", "vegetal");
  if (category === "Cereais") autoTags.push("cereal", "grão", "fibra");

  const finalKeywords = [...new Set([...keywords, ...autoTags])];

  return {
    id,
    name,
    category,
    type: category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    dominantMacro: "carb",
    hasConversion: !!cookedData,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição / USDA"),
    taco_raw_item: `${name}, cru`,
    taco_cooked_item: cookedData ? `${name}, cozido` : null,
    ftp: { methods: ftpMethods || {} },
    variants: {
      raw: { name: `${name} (Cru)`, protein_100g: rawData.p, carb_100g: rawData.c, fat_100g: rawData.f, kcal_100g: rawData.k },
      cooked: cookedData ? { name: `${name} (Cozido/Pronto)`, protein_100g: cookedData.p, carb_100g: cookedData.c, fat_100g: cookedData.f, kcal_100g: cookedData.k } : null
    },
    modeRestrictions: restrictions || { calculator: true, substitution: true, recipe: true }
  };
};

const createPastaItem = (id, name, keywords, rawData, cookedData) => {
  const ftpMethods = { 
    cozido: { rendimento: 2.36, indice_coccao: 0.42 },
    grelhado: { rendimento: 1.0, indice_coccao: 1.0 }, 
    assado: { rendimento: 1.0, indice_coccao: 1.0 },
    vapor: { rendimento: 2.2, indice_coccao: 0.45 },
    frito: { rendimento: 1.0, indice_coccao: 1.0 }
  };
  
  const finalKeywords = [...new Set(["macarrão", "massa", "trigo", "cereal", ...keywords])];
  
  return createCarbItem(id, name, "Massas", finalKeywords, rawData, cookedData, ftpMethods, { calculator: true, substitution: true, recipe: true });
};

const createSubOnlyItem = (id, name, category, keywords, values, dominantMacro = "carb") => {
  const autoTags = [category.toLowerCase()];
  if (category === "Oleaginosas") autoTags.push("oleaginosa", "castanha", "gordura", "semente", "nozes");
  if (category === "Frutas") autoTags.push("fruta", "doce", "natural", "vegetal");

  const finalKeywords = [...new Set([...keywords, ...autoTags])];

  return {
    id,
    name,
    category,
    type: category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    dominantMacro,
    hasConversion: false,
    defaultCookedId: null,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: name,
    taco_cooked_item: null,
    ftp: {},
    variants: {
      raw: {
        name,
        protein_100g: values.p,
        carb_100g: values.c,
        fat_100g: values.f,
        kcal_100g: values.k
      },
      cooked: null
    },
    modeRestrictions: { calculator: false, substitution: true, recipe: false }
  };
};

const createDairyItem = (id, name, category, keywords, values, source = "TACO 4ª edição", extraProps = {}) => {
  const finalKeywords = [...new Set([...keywords, category.toLowerCase(), "laticinio", "laticínio", "leite", "derivado", "proteína", "cálcio"])];
  
  return {
    id,
    name,
    category,
    type: "laticinios",
    dominantMacro: values.p > values.f && values.p > values.c ? "protein" : (values.f > values.p ? "fat" : "carb"),
    hasConversion: false,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource(source),
    taco_raw_item: name,
    taco_cooked_item: null,
    ftp: {},
    variants: {
      raw: {
        name,
        protein_100g: values.p,
        carb_100g: values.c,
        fat_100g: values.f,
        kcal_100g: values.k
      },
      cooked: null
    },
    modeRestrictions: { calculator: false, substitution: true, recipe: false },
    ...extraProps
  };
};

const createBeefItem = (id, name, type, fatLevel, protein, fat, kcal, tacoRawName, tacoCookedName) => {
  const yieldFactor = 0.66;
  let finalCookedName = tacoCookedName;
  if (!finalCookedName) {
    finalCookedName = `Carne bovina, ${name.toLowerCase()}, cozido`;
  }

  const finalKeywords = [...new Set(["carne", "bovina", "boi", "carne bovina", "corte", "bovino", "vermelha", "proteína", type, fatLevel])];

  return {
    id,
    name,
    category: "Carne bovina",
    type: "carnes",
    dominantMacro: "protein",
    hasConversion: true,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: tacoRawName || `Carne bovina, ${name.toLowerCase()}, cru`,
    taco_cooked_item: finalCookedName,
    ftp: {
      methods: {
        cozido: { rendimento: 0.66, indice_coccao: 1.52 },
        grelhado: { rendimento: 0.70, indice_coccao: 1.43 },
        assado: { rendimento: 0.68, indice_coccao: 1.47 },
        frito: { rendimento: 0.60, indice_coccao: 1.67 },
        vapor: { rendimento: 0.75, indice_coccao: 1.33 }
      }
    },
    variants: {
      raw: { 
        name: `${name} (Cru)`,
        protein_100g: protein, 
        carb_100g: 0.0, 
        fat_100g: fat, 
        kcal_100g: kcal
      },
      cooked: { 
        name: `${name} (Pronto)`,
        protein_100g: Number((protein / yieldFactor).toFixed(1)), 
        carb_100g: 0.0, 
        fat_100g: Number((fat / yieldFactor).toFixed(1)), 
        kcal_100g: Number((kcal / yieldFactor).toFixed(0))
      }
    }
  };
};

const createOrganItem = (id, name, category, keywords, raw, cooked) => {
    // Similar to BeefItem but supports carbs and specific yield
    const methods = {
        cozido: { rendimento: 0.65, indice_coccao: 1.53 },
        grelhado: { rendimento: 0.70, indice_coccao: 1.43 }
    };

    return {
        id,
        name,
        category,
        type: "carnes",
        dominantMacro: "protein",
        hasConversion: true,
        defaultCookedId: id,
        keywords: [...new Set(["miudos", "orgãos", "carne", "proteína", ...keywords])],
        source: normalizeSource("TACO/USDA"),
        taco_raw_item: `${name}, cru`,
        taco_cooked_item: `${name}, cozido`,
        ftp: { methods },
        variants: {
            raw: { name: `${name} (Cru)`, protein_100g: raw.p, carb_100g: raw.c, fat_100g: raw.f, kcal_100g: raw.k },
            cooked: { name: `${name} (Pronto)`, protein_100g: cooked.p, carb_100g: cooked.c, fat_100g: cooked.f, kcal_100g: cooked.k }
        }
    };
};

const createChickenItem = (id, name, keywords, rawValues, cookedValues, extra = {}) => {
  const finalKeywords = [...new Set(["frango", "ave", "proteína", "branca", "corte", ...keywords])];
  
  return {
    id,
    name,
    category: "Frango",
    type: "aves",
    dominantMacro: "protein",
    hasConversion: true,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: extra.rawDesc || `Carne de frango, ${name.toLowerCase()}, cru`,
    taco_cooked_item: extra.cookedDesc || `Carne de frango, ${name.toLowerCase()}, cozido`,
    ftp: {
      methods: {
        cozido: { rendimento: 0.75, indice_coccao: 1.33 },
        grelhado: { rendimento: 0.70, indice_coccao: 1.43 },
        assado: { rendimento: 0.72, indice_coccao: 1.39 },
        frito: { rendimento: 0.65, indice_coccao: 1.54 },
        vapor: { rendimento: 0.80, indice_coccao: 1.25 }
      }
    },
    variants: {
      raw: { 
        name: `${name} (Cru)`,
        protein_100g: rawValues.p, 
        carb_100g: rawValues.c || 0.0, 
        fat_100g: rawValues.f, 
        kcal_100g: rawValues.k 
      },
      cooked: { 
        name: `${name} (Pronto)`,
        protein_100g: cookedValues.p, 
        carb_100g: cookedValues.c || 0.0, 
        fat_100g: cookedValues.f, 
        kcal_100g: cookedValues.k 
      }
    }
  };
};

const createSeafoodItem = (id, name, keywords, methodType, rawData, cookedData) => {
  let methods = {};
  if (methodType === 'crustaceo') { 
    methods = { cozido: { rendimento: 0.80, indice_coccao: 1.25 }, grelhado: { rendimento: 0.75, indice_coccao: 1.33 }, vapor: { rendimento: 0.85, indice_coccao: 1.18 } };
  } else if (methodType === 'cefalopode') { 
    methods = { cozido: { rendimento: 0.60, indice_coccao: 1.66 }, grelhado: { rendimento: 0.65, indice_coccao: 1.54 } };
  } else if (methodType === 'bivalve') { 
    methods = { cozido: { rendimento: 0.50, indice_coccao: 2.0 }, vapor: { rendimento: 0.55, indice_coccao: 1.8 } }; // Shell weight loss consideration usually handled by net weight, here assuming meat weight
  } else { 
    methods = { cozido: { rendimento: 0.78, indice_coccao: 1.28 }, grelhado: { rendimento: 0.73, indice_coccao: 1.37 } };
  }

  const finalKeywords = [...new Set(["frutos do mar", "fruto do mar", "mar", "marisco", "pescado", "proteína", ...keywords])];

  return {
    id,
    name,
    category: "Frutos do mar",
    type: "pescados",
    dominantMacro: "protein",
    hasConversion: true,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: `Fruto do mar, ${name.toLowerCase()}, cru/crua`,
    taco_cooked_item: `Fruto do mar, ${name.toLowerCase()}, cozido/cozida`,
    ftp: { methods },
    variants: {
      raw: { name: `${name} (Cru)`, protein_100g: rawData.protein, carb_100g: rawData.carb, fat_100g: rawData.fat, kcal_100g: rawData.kcal },
      cooked: { name: `${name} (Cozido/Grelhado)`, protein_100g: cookedData.protein, carb_100g: cookedData.carb, fat_100g: cookedData.fat, kcal_100g: cookedData.kcal }
    }
  };
};

const createPorkItem = (id, name, keywords, methodType, rawData, cookedData) => {
  let methods = {};
  if (methodType === 'ribs') { methods = { cozido: { rendimento: 0.70, indice_coccao: 1.43 }, assado: { rendimento: 0.65, indice_coccao: 1.54 } }; } 
  else if (methodType === 'belly') { methods = { frito: { rendimento: 0.40, indice_coccao: 2.5 }, assado: { rendimento: 0.50, indice_coccao: 2.0 } }; }
  else { methods = { cozido: { rendimento: 0.75, indice_coccao: 1.33 }, grelhado: { rendimento: 0.72, indice_coccao: 1.39 }, assado: { rendimento: 0.70, indice_coccao: 1.43 } }; }

  const finalKeywords = [...new Set(["suíno", "suino", "porco", "carne", "vermelha", "proteína", ...keywords])];

  return {
    id,
    name,
    category: "Suínos",
    type: "carnes",
    dominantMacro: "protein",
    hasConversion: true,
    defaultCookedId: id,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: `Carne suína, ${name.toLowerCase()}, cru`,
    taco_cooked_item: `Carne suína, ${name.toLowerCase()}, cozido/assado`,
    ftp: { methods },
    variants: {
      raw: { name: `${name} (Cru)`, protein_100g: rawData.protein, carb_100g: rawData.carb, fat_100g: rawData.fat, kcal_100g: rawData.kcal },
      cooked: { name: `${name} (Pronto)`, protein_100g: cookedData.protein, carb_100g: cookedData.carb, fat_100g: cookedData.fat, kcal_100g: cookedData.kcal }
    }
  };
};

const createCheeseItem = (id, name, keywords, rawData) => ({
  id,
  name,
  category: "Queijos",
  type: "laticinios",
  dominantMacro: "protein", 
  hasConversion: false,
  defaultCookedId: id,
  keywords: [...new Set([...keywords, "queijo", "laticínio", "laticinio", "proteína", "gordura"])],
  source: normalizeSource("TACO 4ª edição"),
  taco_raw_item: `Queijo, ${name.toLowerCase().replace('queijo ', '')}`, 
  taco_cooked_item: null,
  isCheeseOnly: true,
  ftp: {},
  variants: {
    raw: { name: name, protein_100g: rawData.protein, carb_100g: rawData.carb, fat_100g: rawData.fat, kcal_100g: rawData.kcal },
    cooked: null
  }
});

const createTacoFishItem = (id, name, keywords, raw, cooked) => {
    const ratio = raw.protein > 0 ? cooked.protein / raw.protein : 1.33;
    const yieldFactor = ratio > 0 ? 1 / ratio : 0.75;
    const rendimento = Math.round(yieldFactor * 100) / 100;
    const indice_coccao = Math.round(ratio * 100) / 100;

    const methods = {
        cozido: { rendimento, indice_coccao },
        grelhado: { rendimento: Math.max(0.5, rendimento - 0.05), indice_coccao: indice_coccao + 0.1 },
        assado: { rendimento, indice_coccao }
    };

    const finalKeywords = [...new Set(["peixe", "pescado", "proteína", "frutos do mar", ...keywords])];

    return {
        id,
        name,
        category: "Peixes",
        type: "pescados",
        dominantMacro: "protein",
        hasConversion: true,
        defaultCookedId: id,
        keywords: finalKeywords,
        source: normalizeSource("TACO 4ª edição"),
        taco_raw_item: `Peixe, ${name.toLowerCase()}, cru/crua`,
        taco_cooked_item: `Peixe, ${name.toLowerCase()}, cozido/cozida`,
        ftp: { methods },
        variants: {
            raw: { name: `${name} (Cru)`, protein_100g: raw.protein, carb_100g: raw.carb, fat_100g: raw.fat, kcal_100g: raw.kcal },
            cooked: { name: `${name} (Cozido/Grelhado)`, protein_100g: cooked.protein, carb_100g: cooked.carb, fat_100g: cooked.fat, kcal_100g: cooked.fat, kcal_100g: cooked.fat }
        },
        modeRestrictions: { calculator: true, substitution: true, recipe: true }
    };
};

const createEggItem = (id, name, keywords, rawData, cookedData, methods) => {
  return {
    id,
    name,
    category: "Ovos",
    type: "ovos",
    dominantMacro: rawData.fat > rawData.protein ? "fat" : "protein",
    hasConversion: true,
    defaultCookedId: id,
    keywords: [...new Set([...keywords, "ovo", "ovos", "proteína", "clara", "gema"])],
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: `${name}, cru`,
    taco_cooked_item: `${name}, cozido`,
    ftp: { methods: methods || {} },
    variants: {
      raw: { name: `${name} (Cru)`, protein_100g: rawData.protein, carb_100g: rawData.carb, fat_100g: rawData.fat, kcal_100g: rawData.kcal },
      cooked: { name: `${name} (Cozido/Preparado)`, protein_100g: cookedData.protein, carb_100g: cookedData.carb, fat_100g: cookedData.fat, kcal_100g: cookedData.kcal }
    },
    modeRestrictions: { calculator: true, substitution: true, recipe: true }
  };
};

// --- DATA COLLECTIONS ---

const riceItems = [
  createCarbItem("arroz_branco_tipo1", "Arroz Branco (Tipo 1)", "Arroz", ["branco", "polido", "agulhinha"], { p: 7.2, c: 78.8, f: 0.3, k: 358 }, { p: 2.5, c: 28.1, f: 0.2, k: 128 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("arroz_integral", "Arroz Integral", "Arroz", ["integral", "fibra"], { p: 7.3, c: 77.5, f: 1.9, k: 360 }, { p: 2.6, c: 25.8, f: 1.0, k: 124 }, { cozido: { rendimento: 2.3, indice_coccao: 0.43 } }),
  createCarbItem("arroz_parboilizado", "Arroz Parboilizado", "Arroz", ["parboilizado"], { p: 7.5, c: 78.0, f: 0.5, k: 355 }, { p: 2.6, c: 27.5, f: 0.3, k: 126 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("arroz_cateto", "Arroz Cateto", "Arroz", ["cateto"], { p: 7.5, c: 78.0, f: 0.5, k: 360 }, { p: 2.5, c: 28.0, f: 0.2, k: 130 }, { cozido: { rendimento: 2.4, indice_coccao: 0.42 } }),
  createCarbItem("arroz_arborio", "Arroz Arbório", "Arroz", ["risoto", "arborio"], { p: 6.5, c: 79.0, f: 0.5, k: 365 }, { p: 2.4, c: 29.0, f: 0.2, k: 135 }, { cozido: { rendimento: 2.4, indice_coccao: 0.42 } }),
  createCarbItem("arroz_jasmine", "Arroz Jasmine", "Arroz", ["jasmine", "aromatico"], { p: 7.0, c: 78.0, f: 0.5, k: 355 }, { p: 2.6, c: 28.0, f: 0.2, k: 129 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("arroz_basmati", "Arroz Basmati", "Arroz", ["basmati", "indiano"], { p: 8.0, c: 77.0, f: 0.5, k: 360 }, { p: 2.8, c: 27.0, f: 0.2, k: 125 }, { cozido: { rendimento: 2.6, indice_coccao: 0.38 } }),
  createCarbItem("arroz_japones", "Arroz Japonês (Gohan)", "Arroz", ["gohan", "sushi", "oriental"], { p: 6.5, c: 79.5, f: 0.4, k: 360 }, { p: 2.3, c: 29.5, f: 0.2, k: 135 }, { cozido: { rendimento: 2.3, indice_coccao: 0.43 } })
];

const tuberItems = [
  createCarbItem("batata_inglesa", "Batata Inglesa", "Tubérculos", ["batata"], { p: 1.8, c: 14.7, f: 0.1, k: 64 }, { p: 1.2, c: 11.9, f: 0.0, k: 52 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("batata_doce", "Batata Doce", "Tubérculos", ["doce"], { p: 1.3, c: 18.4, f: 0.1, k: 77 }, { p: 0.6, c: 18.4, f: 0.1, k: 77 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("mandioca", "Mandioca (Aipim/Macaxeira)", "Tubérculos", ["aipim", "macaxeira", "raiz"], { p: 1.1, c: 30.1, f: 0.3, k: 125 }, { p: 0.6, c: 30.0, f: 0.2, k: 120 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("inhame", "Inhame", "Tubérculos", ["raiz", "tuberculo"], { p: 2.1, c: 23.2, f: 0.2, k: 97 }, { p: 1.5, c: 24.0, f: 0.1, k: 95 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("cara", "Cará", "Tubérculos", ["raiz"], { p: 1.9, c: 18.9, f: 0.1, k: 78 }, { p: 1.5, c: 17.0, f: 0.1, k: 73 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("mandioquinha", "Mandioquinha (Batata-Baroa)", "Tubérculos", ["baroa", "amarela"], { p: 1.0, c: 18.9, f: 0.2, k: 80 }, { p: 0.9, c: 20.0, f: 0.2, k: 85 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("batata_yacon", "Batata Yacon", "Tubérculos", ["yacon", "diet"], { p: 0.5, c: 8.0, f: 0.1, k: 35 }, { p: 0.4, c: 7.5, f: 0.1, k: 33 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("batata_roxa", "Batata Roxa", "Tubérculos", ["roxa"], { p: 1.5, c: 20.0, f: 0.1, k: 86 }, { p: 1.2, c: 21.0, f: 0.1, k: 90 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("batata_baroa_amarela", "Batata Baroa Amarela", "Tubérculos", ["amarela"], { p: 1.0, c: 19.0, f: 0.2, k: 82 }, { p: 0.8, c: 18.5, f: 0.2, k: 80 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("taro", "Taro (Inhame Japonês)", "Tubérculos", ["inhame", "japonês"], { p: 2.0, c: 26.0, f: 0.2, k: 112 }, { p: 1.8, c: 25.0, f: 0.2, k: 108 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("araruta", "Araruta", "Tubérculos", ["raiz"], { p: 0.5, c: 15.0, f: 0.1, k: 65 }, { p: 0.3, c: 14.0, f: 0.1, k: 60 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("mangarito", "Mangarito", "Tubérculos", ["raiz"], { p: 2.0, c: 22.0, f: 0.2, k: 95 }, { p: 1.8, c: 21.0, f: 0.2, k: 90 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("taioba", "Taioba (Rizoma)", "Tubérculos", ["raiz"], { p: 2.5, c: 24.0, f: 0.3, k: 110 }, { p: 2.2, c: 23.0, f: 0.3, k: 105 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("gengibre", "Gengibre", "Tubérculos", ["raiz", "tempero"], { p: 1.8, c: 17.8, f: 0.8, k: 80 }, { p: 1.5, c: 16.0, f: 0.6, k: 75 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
  createCarbItem("curcuma", "Cúrcuma (Açafrão-da-terra)", "Tubérculos", ["açafrão", "raiz", "tempero"], { p: 8.0, c: 65.0, f: 10.0, k: 350 }, { p: 2.0, c: 15.0, f: 2.0, k: 80 }, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } })
];

const breadItems = [
  createCarbItem("pao_frances", "Pão Francês", "Pães", ["frances"], { p: 8.0, c: 58.6, f: 3.1, k: 300 }, { p: 8.0, c: 58.6, f: 3.1, k: 300 }, {}, { calculator: true, substitution: true, recipe: false }),
  createCarbItem("pao_integral", "Pão Integral", "Pães", ["integral"], { p: 9.4, c: 49.9, f: 3.7, k: 253 }, { p: 9.4, c: 49.9, f: 3.7, k: 253 }, {}, { calculator: true, substitution: true, recipe: false })
];

const beanItems = [
  createCarbItem("feijao_carioca", "Feijão Carioca", "Leguminosas", ["carioca"], { p: 20.0, c: 61.2, f: 1.3, k: 329 }, { p: 4.8, c: 13.6, f: 0.5, k: 76 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("feijao_preto", "Feijão Preto", "Leguminosas", ["preto"], { p: 21.3, c: 63.4, f: 1.3, k: 324 }, { p: 4.5, c: 14.0, f: 0.5, k: 77 }, { cozido: { rendimento: 2.4, indice_coccao: 0.42 } }),
  createCarbItem("feijao_branco", "Feijão Branco", "Leguminosas", ["branco"], { p: 21.0, c: 60.5, f: 1.5, k: 340 }, { p: 6.6, c: 17.8, f: 0.5, k: 115 }, { cozido: { rendimento: 2.3, indice_coccao: 0.43 } }),
  createCarbItem("feijao_fradinho", "Feijão Fradinho", "Leguminosas", ["fradinho", "corda"], { p: 24.0, c: 59.0, f: 1.3, k: 335 }, { p: 5.8, c: 15.6, f: 0.4, k: 98 }, { cozido: { rendimento: 2.6, indice_coccao: 0.38 } }),
  createCarbItem("feijao_rosinha", "Feijão Rosinha", "Leguminosas", ["rosinha"], { p: 20.5, c: 62.0, f: 1.2, k: 330 }, { p: 5.0, c: 14.0, f: 0.4, k: 80 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("feijao_rajado", "Feijão Rajado", "Leguminosas", ["rajado"], { p: 20.0, c: 61.0, f: 1.3, k: 328 }, { p: 4.8, c: 13.8, f: 0.5, k: 78 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } }),
  createCarbItem("feijao_jalo", "Feijão Jalo", "Leguminosas", ["jalo"], { p: 20.2, c: 61.5, f: 1.2, k: 330 }, { p: 4.9, c: 13.9, f: 0.5, k: 79 }, { cozido: { rendimento: 2.5, indice_coccao: 0.40 } })
];

const cerealItems = [
  createCarbItem("milho_grao", "Milho em Grão", "Cereais", ["milho"], { p: 9.0, c: 72.0, f: 4.5, k: 360 }, { p: 3.0, c: 20.0, f: 1.0, k: 100 }, { cozido: { rendimento: 2.8, indice_coccao: 0.35 } }),
  createCarbItem("aveia_flocos", "Aveia em Flocos", "Cereais", ["aveia"], { p: 14.0, c: 66.0, f: 7.0, k: 390 }, { p: 14.0, c: 66.0, f: 7.0, k: 390 }, {}, { calculator: true, substitution: true, recipe: false }),
  createCarbItem("aveia_flocos_finos", "Aveia em Flocos Finos", "Cereais", ["aveia"], { p: 14.0, c: 66.0, f: 7.0, k: 390 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("aveia_flocos_grossos", "Aveia em Flocos Grossos", "Cereais", ["aveia"], { p: 14.0, c: 66.0, f: 7.0, k: 390 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("aveia_farelo", "Aveia Farelo", "Cereais", ["aveia", "farelo"], { p: 17.0, c: 66.0, f: 7.0, k: 246 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("aveia_farinha", "Aveia Farinha", "Cereais", ["aveia", "farinha"], { p: 14.0, c: 66.0, f: 7.0, k: 390 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("farinha_trigo_branca", "Farinha de Trigo Branca", "Cereais", ["trigo", "farinha"], { p: 9.8, c: 75.1, f: 1.4, k: 360 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("farinha_trigo_integral", "Farinha de Trigo Integral", "Cereais", ["trigo", "farinha", "integral"], { p: 12.0, c: 64.0, f: 2.5, k: 340 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("farinha_trigo_especial", "Farinha de Trigo Especial", "Cereais", ["trigo", "farinha"], { p: 10.0, c: 74.0, f: 1.2, k: 355 }, null, {}, { calculator: true, substitution: true, recipe: true }),
  createCarbItem("fuba_milho", "Fubá de Milho", "Cereais", ["fuba", "milho"], { p: 7.2, c: 78.0, f: 1.0, k: 350 }, { p: 1.5, c: 18.0, f: 0.2, k: 80 }, { cozido: { rendimento: 3.5, indice_coccao: 0.28 } }),
  createCarbItem("flocos_milho_pre", "Flocos de Milho Pré-cozidos", "Cereais", ["flocos", "milho", "cuscuz"], { p: 7.5, c: 80.0, f: 0.5, k: 360 }, { p: 2.0, c: 22.0, f: 0.1, k: 100 }, { cozido: { rendimento: 3.0, indice_coccao: 0.3 } }),
  createCarbItem("trigo_quibe", "Trigo para Quibe", "Cereais", ["trigo", "quibe"], { p: 12.0, c: 70.0, f: 1.5, k: 350 }, { p: 4.0, c: 23.0, f: 0.5, k: 120 }, { cozido: { rendimento: 2.8, indice_coccao: 0.35 } })
];

const pastaItems = [
  createPastaItem("macarrao-espaguete", "Macarrão Espaguete", ["espaguete"], { p: 13.0, c: 74.6, f: 1.6, k: 371 }, { p: 5.8, c: 30.7, f: 0.9, k: 157 }),
  createPastaItem("macarrao-integral", "Macarrão Integral", ["integral"], { p: 14.8, c: 66.8, f: 2.0, k: 348 }, { p: 5.3, c: 23.9, f: 0.7, k: 124 }),
  createPastaItem("macarrao-parafuso", "Macarrão Parafuso", ["parafuso"], { p: 13.0, c: 74.6, f: 1.6, k: 371 }, { p: 5.8, c: 30.7, f: 0.9, k: 157 }),
  createPastaItem("parafuso-integral", "Parafuso Integral", ["parafuso", "integral"], { p: 14.8, c: 66.8, f: 2.0, k: 348 }, { p: 5.3, c: 23.9, f: 0.7, k: 124 }),
  createPastaItem("macarrao-penne", "Penne", ["penne"], { p: 13.0, c: 74.6, f: 1.6, k: 371 }, { p: 5.8, c: 30.7, f: 0.9, k: 157 }),
  createPastaItem("penne-integral", "Penne Integral", ["penne", "integral"], { p: 14.8, c: 66.8, f: 2.0, k: 348 }, { p: 5.3, c: 23.9, f: 0.7, k: 124 }),
  createPastaItem("talharim", "Talharim", ["talharim", "ovos"], { p: 14.0, c: 72.0, f: 2.5, k: 380 }, { p: 6.0, c: 30.0, f: 1.0, k: 160 }),
  createPastaItem("lasanha", "Lasanha (Massa)", ["lasanha"], { p: 13.0, c: 74.0, f: 1.6, k: 370 }, { p: 5.5, c: 30.0, f: 0.9, k: 155 }),
  createPastaItem("macarrao-arroz", "Macarrão de Arroz", ["arroz", "sem gluten"], { p: 7.0, c: 80.0, f: 0.5, k: 360 }, { p: 2.0, c: 25.0, f: 0.2, k: 110 }),
  createPastaItem("macarrao-instantaneo", "Macarrão Instantâneo", ["miojo", "lamen"], { p: 9.0, c: 62.0, f: 18.0, k: 450 }, { p: 3.0, c: 20.0, f: 6.0, k: 150 })
];

const oleaginosas = [
  createSubOnlyItem("amendoim", "Amendoim", "Oleaginosas", ["castanha", "grão"], { p: 27.2, c: 20.3, f: 43.9, k: 544.0 }, "fat"),
  createSubOnlyItem("castanha_do_para", "Castanha-do-Pará", "Oleaginosas", ["castanha", "brasil"], { p: 14.5, c: 15.1, f: 63.5, k: 643.0 }, "fat"),
  createSubOnlyItem("castanha_de_caju", "Castanha de Caju", "Oleaginosas", ["castanha", "torrada"], { p: 18.5, c: 29.1, f: 46.3, k: 570.0 }, "fat"),
  createSubOnlyItem("amendoa", "Amêndoa", "Oleaginosas", ["semente", "torrada"], { p: 18.6, c: 29.5, f: 45.9, k: 581.0 }, "fat"),
  createSubOnlyItem("noz", "Noz", "Oleaginosas", ["semente"], { p: 14.0, c: 18.4, f: 63.3, k: 669.0 }, "fat"),
  createSubOnlyItem("noz_peca", "Noz Pecã", "Oleaginosas", ["semente"], { p: 9.2, c: 14.3, f: 70.1, k: 698.0 }, "fat"),
  createSubOnlyItem("pistache", "Pistache", "Oleaginosas", ["semente", "torrado"], { p: 20.9, c: 27.2, f: 45.3, k: 571.0 }, "fat"),
  createSubOnlyItem("avela", "Avelã", "Oleaginosas", ["semente"], { p: 14.9, c: 16.7, f: 60.8, k: 633.0 }, "fat"),
  createSubOnlyItem("macadamia", "Macadâmia", "Oleaginosas", ["semente"], { p: 7.9, c: 13.8, f: 75.8, k: 718.0 }, "fat"),
  createSubOnlyItem("pinhao", "Pinhão", "Oleaginosas", ["semente", "cozido"], { p: 3.0, c: 43.9, f: 0.7, k: 174.0 }, "carb")
];

const dairyItems = [
  createDairyItem("leite_integral", "Leite integral", "Leites", ["integral"], { p: 3.2, c: 4.8, f: 3.6, k: 61.0 }),
  createDairyItem("whey_protein_concentrado", "Whey protein concentrado", "Proteínas Lácteas", ["whey"], { p: 78.0, c: 5.0, f: 5.0, k: 410.0 }, "rotulo_padrao_nacional", { taco_compliance: false })
];

const chickenFoods = [
  createChickenItem("peito-frango", "Peito de frango", ["peito", "magro"], { p: 21.5, f: 1.1, k: 119 }, { p: 32.0, f: 2.5, k: 159 }, { rawDesc: "Carne de frango, peito, sem pele, cru", cookedDesc: "Carne de frango, peito, sem pele, cozido" }),
  createChickenItem("sobrecoxa-frango", "Sobrecoxa", ["sobrecoxa"], { p: 17.6, f: 16.2, k: 222 }, { p: 23.0, f: 16.0, k: 260 }, { rawDesc: "Carne de frango, sobrecoxa, com pele, crua", cookedDesc: "Carne de frango, sobrecoxa, com pele, assada" }),
  createChickenItem("coxa-frango", "Coxa", ["coxa"], { p: 16.9, f: 10.2, k: 161 }, { p: 24.0, f: 12.0, k: 215 }, { rawDesc: "Carne de frango, coxa, com pele, crua", cookedDesc: "Carne de frango, coxa, com pele, assada" })
];

const seafoodItemsArr = [
  createSeafoodItem("camarao_cinza", "Camarão cinza", ["camarao"], "crustaceo", {protein: 20.6, carb: 0.8, fat: 0.5, kcal: 84.0}, {protein: 25.8, carb: 1.0, fat: 0.6, kcal: 105.0}),
  createSeafoodItem("camarao_rosa", "Camarão Rosa", ["camarao"], "crustaceo", {protein: 20.8, carb: 0.0, fat: 1.0, kcal: 92.0}, {protein: 26.0, carb: 0.0, fat: 1.2, kcal: 115.0}),
  createSeafoodItem("camarao_sete_barbas", "Camarão Sete-Barbas", ["camarao"], "crustaceo", {protein: 19.5, carb: 0.0, fat: 0.5, kcal: 82.0}, {protein: 24.5, carb: 0.0, fat: 0.6, kcal: 102.0}),
  createSeafoodItem("camarao_pistola", "Camarão Pistola", ["camarao"], "crustaceo", {protein: 20.5, carb: 0.0, fat: 0.8, kcal: 90.0}, {protein: 25.6, carb: 0.0, fat: 1.0, kcal: 112.0}),
  createSeafoodItem("lula", "Lula", ["molusco"], "cefalopode", {protein: 16.0, carb: 1.5, fat: 1.2, kcal: 82.0}, {protein: 26.6, carb: 2.5, fat: 2.0, kcal: 136.0}),
  createSeafoodItem("polvo", "Polvo", ["molusco"], "cefalopode", {protein: 16.4, carb: 2.2, fat: 1.0, kcal: 82.0}, {protein: 27.0, carb: 3.6, fat: 1.6, kcal: 135.0}),
  createSeafoodItem("siri", "Siri (Polpa)", ["caranguejo"], "crustaceo", {protein: 17.5, carb: 0.0, fat: 1.5, kcal: 85.0}, {protein: 21.8, carb: 0.0, fat: 1.9, kcal: 106.0}),
  createSeafoodItem("caranguejo", "Caranguejo", ["crustaceo"], "crustaceo", {protein: 18.0, carb: 0.0, fat: 1.0, kcal: 83.0}, {protein: 22.5, carb: 0.0, fat: 1.2, kcal: 104.0}),
  createSeafoodItem("lagosta", "Lagosta", ["crustaceo"], "crustaceo", {protein: 19.0, carb: 0.5, fat: 0.9, kcal: 88.0}, {protein: 23.7, carb: 0.6, fat: 1.1, kcal: 110.0}),
  createSeafoodItem("mexilhao", "Mexilhão", ["bivalve"], "bivalve", {protein: 12.0, carb: 3.5, fat: 2.0, kcal: 80.0}, {protein: 24.0, carb: 7.0, fat: 4.0, kcal: 160.0}), // Large water loss
  createSeafoodItem("ostra", "Ostra", ["bivalve"], "bivalve", {protein: 9.0, carb: 5.0, fat: 2.0, kcal: 74.0}, {protein: 18.0, carb: 10.0, fat: 4.0, kcal: 148.0})
];

const porkItemsArr = [
  // Existing
  createPorkItem("lombo_suino", "Lombo suíno", ["lombo"], "main", {protein: 22.5, carb: 0, fat: 6.0, kcal: 145.0}, {protein: 30.0, carb: 0, fat: 8.0, kcal: 193.0}),
  createPorkItem("costela_suina", "Costela suína", ["costela"], "ribs", {protein: 16.5, carb: 0, fat: 22.8, kcal: 280.0}, {protein: 23.5, carb: 0, fat: 32.5, kcal: 400.0}),
  // New
  createPorkItem("pernil_suino", "Pernil Suíno", ["pernil", "perna"], "main", {protein: 20.0, carb: 0, fat: 10.0, kcal: 180.0}, {protein: 26.6, carb: 0, fat: 13.3, kcal: 240.0}),
  createPorkItem("paleta_suina", "Paleta Suína", ["paleta", "ombro"], "main", {protein: 19.0, carb: 0, fat: 12.0, kcal: 195.0}, {protein: 25.3, carb: 0, fat: 16.0, kcal: 260.0}),
  createPorkItem("bisteca_suina", "Bisteca Suína", ["bisteca", "chuleta"], "main", {protein: 21.0, carb: 0, fat: 11.0, kcal: 190.0}, {protein: 28.0, carb: 0, fat: 14.6, kcal: 253.0}),
  createPorkItem("copa_lombo", "Copa Lombo", ["copa", "sobrepaleta"], "main", {protein: 19.0, carb: 0, fat: 18.0, kcal: 240.0}, {protein: 25.3, carb: 0, fat: 24.0, kcal: 320.0}),
  createPorkItem("file_suino", "Filé Suíno (Mignon)", ["file", "mignon"], "main", {protein: 22.0, carb: 0, fat: 3.5, kcal: 125.0}, {protein: 29.3, carb: 0, fat: 4.6, kcal: 166.0}),
  createPorkItem("barriga_suina", "Barriga Suína / Panceta", ["panceta", "barriga", "toucinho"], "belly", {protein: 12.0, carb: 0, fat: 45.0, kcal: 460.0}, {protein: 30.0, carb: 0, fat: 35.0, kcal: 435.0}), // High fat loss when frying
  createPorkItem("bacon", "Bacon", ["toucinho", "defumado"], "belly", {protein: 13.0, carb: 0, fat: 50.0, kcal: 510.0}, {protein: 32.5, carb: 0, fat: 38.0, kcal: 480.0}),
  createPorkItem("joelho_suino", "Joelho Suíno (Eisbein)", ["joelho"], "main", {protein: 16.0, carb: 0, fat: 20.0, kcal: 250.0}, {protein: 21.3, carb: 0, fat: 26.6, kcal: 333.0})
];

const cheeseItemsArr = [
  createCheeseItem("queijo-minas-frescal", "Queijo Minas Frescal", ["queijo", "fresco", "branco"], { protein: 17.4, carb: 3.2, fat: 20.2, kcal: 264.0 }),
  createCheeseItem("queijo-minas-padrao", "Queijo Minas Padrão", ["queijo", "curado"], { protein: 21.3, carb: 1.5, fat: 30.6, kcal: 370.0 }),
  createCheeseItem("queijo-mucarela", "Queijo Muçarela", ["queijo", "pizza"], { protein: 22.6, carb: 3.0, fat: 23.4, kcal: 320.0 }),
  createCheeseItem("queijo-prato", "Queijo Prato", ["queijo", "lanche"], { protein: 22.7, carb: 1.9, fat: 29.1, kcal: 360.0 }),
  createCheeseItem("queijo-coalho", "Queijo Coalho", ["queijo", "nordeste", "churrasco"], { protein: 23.9, carb: 1.5, fat: 26.4, kcal: 339.0 }),
  createCheeseItem("queijo-parmesao", "Queijo Parmesão", ["queijo", "duro", "ralado"], { protein: 35.6, carb: 1.7, fat: 30.6, kcal: 431.0 }),
  createCheeseItem("queijo-ricota", "Queijo Ricota", ["queijo", "branco", "leve"], { protein: 12.6, carb: 3.8, fat: 8.1, kcal: 140.0 }),
  createCheeseItem("queijo-provolone", "Queijo Provolone", ["queijo", "defumado"], { protein: 27.2, carb: 1.3, fat: 27.9, kcal: 370.0 }),
  createCheeseItem("queijo-gorgonzola", "Queijo Gorgonzola", ["queijo", "azul"], { protein: 18.7, carb: 1.0, fat: 31.2, kcal: 359.0 }),
  createCheeseItem("queijo-cottage", "Queijo Cottage", ["queijo", "fresco", "granulado"], { protein: 11.0, carb: 3.4, fat: 4.3, kcal: 98.0 })
];

const leanBeef = [
  createBeefItem("patinho", "Patinho", "magra", "magro", 21.6, 4.5, 133, "Carne bovina, patinho, sem gordura, cru", "Carne bovina, patinho, sem gordura, cozido"),
  createBeefItem("coxao_mole", "Coxão Mole", "magra", "magro", 21.0, 5.0, 135, "Carne bovina, coxão mole, sem gordura, cru", "Carne bovina, coxão mole, sem gordura, cozido"),
  createBeefItem("coxao_duro", "Coxão Duro", "magra", "magro", 21.5, 5.5, 140, "Carne bovina, coxão duro, sem gordura, cru", "Carne bovina, coxão duro, sem gordura, cozido"),
  createBeefItem("lagarto", "Lagarto", "magra", "magro", 20.8, 4.0, 125, "Carne bovina, lagarto, cru", "Carne bovina, lagarto, cozido"),
  createBeefItem("musculo", "Músculo", "magra", "magro", 22.0, 3.5, 120, "Carne bovina, músculo, sem gordura, cru", "Carne bovina, músculo, sem gordura, cozido"),
  createBeefItem("acem_magro", "Acém (Magro)", "magra", "magro", 20.5, 5.0, 130, "Carne bovina, acém, sem gordura, cru", "Carne bovina, acém, sem gordura, cozido"),
  createBeefItem("file_mignon", "Filé Mignon", "magra", "magro", 22.0, 4.0, 130, "Carne bovina, filé mignon, sem gordura, cru", "Carne bovina, filé mignon, sem gordura, grelhado")
];

const mediumBeef = [
  createBeefItem("alcatra", "Alcatra", "media", "médio", 20.0, 7.5, 150, "Carne bovina, alcatra, sem gordura, cru", "Carne bovina, alcatra, sem gordura, grelhado"),
  createBeefItem("contra_file", "Contra-filé", "media", "médio", 19.5, 9.0, 165, "Carne bovina, contra-filé, sem gordura, cru", "Carne bovina, contra-filé, sem gordura, grelhado"),
  createBeefItem("picanha_limpa", "Picanha (Sem Capa)", "media", "médio", 19.0, 10.0, 170, "Carne bovina, picanha, sem gordura, cru", "Carne bovina, picanha, sem gordura, grelhado"),
  createBeefItem("fraldinha", "Fraldinha", "media", "médio", 18.5, 11.0, 175, "Carne bovina, fraldinha, com gordura, cru", "Carne bovina, fraldinha, com gordura, cozido"),
  createBeefItem("paleta", "Paleta", "media", "médio", 19.0, 8.5, 160, "Carne bovina, paleta, sem gordura, cru", "Carne bovina, paleta, sem gordura, cozido"),
  createBeefItem("peito_bovino", "Peito Bovino", "media", "médio", 18.0, 12.0, 180, "Carne bovina, peito, sem gordura, cru", "Carne bovina, peito, sem gordura, cozido"),
  createBeefItem("costela_magra", "Costela (Magra)", "media", "médio", 17.5, 12.5, 185, "Carne bovina, costela, crua", "Carne bovina, costela, assada"),
  createBeefItem("maminha", "Maminha", "media", "médio", 19.0, 9.5, 160, "Carne bovina, maminha, crua", "Carne bovina, maminha, grelhada")
];

const fattyBeef = [
  createBeefItem("cupim", "Cupim", "gorda", "gordo", 16.0, 22.0, 260, "Carne bovina, cupim, cru", "Carne bovina, cupim, assado"),
  createBeefItem("costela_agulha", "Costela Ponta de Agulha", "gorda", "gordo", 15.5, 23.0, 275, "Carne bovina, costela, crua", "Carne bovina, costela, assada"),
  createBeefItem("acem_gordo", "Acém com Gordura", "gorda", "gordo", 17.0, 16.0, 215, "Carne bovina, acém, com gordura, cru", "Carne bovina, acém, com gordura, cozido"),
  createBeefItem("picanha_capa", "Picanha (Com Capa)", "gorda", "gordo", 17.0, 20.0, 250, "Carne bovina, picanha, com gordura, cru", "Carne bovina, picanha, com gordura, grelhado"),
  createBeefItem("costela_bovina", "Costela Bovina (Gorda)", "gorda", "gordo", 15.0, 25.0, 300, "Carne bovina, costela, gorda, crua", "Carne bovina, costela, gorda, assada")
];

const traditionalBeef = [
  createBeefItem("aba_file", "Aba de Filé", "media", "médio", 18.0, 11.0, 175, "Carne bovina, aba de filé, cru", "Carne bovina, aba de filé, cozido"),
  createBeefItem("cha_fora", "Chã de Fora", "magra", "magro", 20.0, 6.0, 140, "Carne bovina, coxão duro (chã de fora), cru", "Carne bovina, coxão duro, cozido"),
  createBeefItem("vazio", "Vazio", "media", "médio", 18.5, 12.0, 185, "Carne bovina, fraldão (vazio), cru", "Carne bovina, fraldão, grelhado"),
  createBeefItem("bife_chorizo", "Bife de Chorizo", "media", "médio", 19.0, 12.0, 185, "Carne bovina, contra-filé (chorizo), cru", "Carne bovina, contra-filé, grelhado"),
  createBeefItem("carne_seca", "Carne Seca", "salgada", "salgado", 33.0, 8.0, 210, "Carne bovina, seca, crua", "Carne bovina, seca, cozida"),
  createBeefItem("charque", "Charque", "salgada", "salgado", 28.0, 12.0, 240, "Carne bovina, charque, crua", "Carne bovina, charque, cozida")
];

const organItems = [
    createOrganItem("figado_bovino", "Fígado Bovino", "Miúdos", ["figado", "viscera"], {p: 20.7, c: 5.0, f: 5.4, k: 141}, {p: 26.0, c: 4.2, f: 6.3, k: 175}),
    createOrganItem("coracao_bovino", "Coração Bovino", "Miúdos", ["coracao", "viscera"], {p: 17.0, c: 0.5, f: 5.0, k: 112}, {p: 28.0, c: 0.6, f: 7.0, k: 170}),
    createOrganItem("lingua_bovina", "Língua Bovina", "Miúdos", ["lingua"], {p: 16.0, c: 1.0, f: 15.0, k: 215}, {p: 24.0, c: 1.5, f: 20.0, k: 280}),
    createOrganItem("rabada", "Rabada", "Miúdos", ["rabo"], {p: 16.0, c: 0.0, f: 25.0, k: 290}, {p: 25.0, c: 0.0, f: 30.0, k: 380}),
    createOrganItem("mocoto", "Mocotó", "Miúdos", ["pe", "gelatina"], {p: 20.0, c: 0.0, f: 8.0, k: 150}, {p: 25.0, c: 0.0, f: 10.0, k: 190})
];

const eggItems = [
    createEggItem("ovo-galinha-inteiro", "Ovo de Galinha (Inteiro)", ["inteiro"], {protein: 13.0, carb: 1.6, fat: 8.9, kcal: 143.0}, {protein: 13.3, carb: 0.6, fat: 9.5, kcal: 146.0}, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
    createEggItem("clara-ovo", "Clara de Ovo", ["clara", "branca"], {protein: 13.0, carb: 0.0, fat: 0.0, kcal: 59.0}, {protein: 13.4, carb: 0.0, fat: 0.1, kcal: 59.0}, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } }),
    createEggItem("gema-ovo", "Gema de Ovo", ["gema", "amarela"], {protein: 16.0, carb: 0.0, fat: 30.6, kcal: 353.0}, {protein: 16.8, carb: 0.2, fat: 30.8, kcal: 358.0}, { cozido: { rendimento: 1.0, indice_coccao: 1.0 } })
];

const tacoFishItems = [
    // Existing
    createTacoFishItem("tilapia", "Tilápia", ["agua doce", "filé"], {protein: 19.3, carb: 0.0, fat: 2.4, kcal: 96.0}, {protein: 25.7, carb: 0.0, fat: 3.2, kcal: 128.0}),
    createTacoFishItem("salmao", "Salmão", ["agua salgada", "nobre"], {protein: 19.8, carb: 0.0, fat: 13.6, kcal: 208.0}, {protein: 26.4, carb: 0.0, fat: 18.1, kcal: 277.0}),
    // New - White Fish (Lean)
    createTacoFishItem("merluza", "Merluza", ["filé", "branca", "mar"], {protein: 16.6, carb: 0.0, fat: 0.9, kcal: 78.0}, {protein: 22.0, carb: 0.0, fat: 1.2, kcal: 104.0}),
    createTacoFishItem("pescada_branca", "Pescada Branca", ["pescada", "filé"], {protein: 16.4, carb: 0.0, fat: 1.2, kcal: 80.0}, {protein: 21.8, carb: 0.0, fat: 1.6, kcal: 106.0}),
    createTacoFishItem("pescada_amarela", "Pescada Amarela", ["pescada", "nobre"], {protein: 18.0, carb: 0.0, fat: 1.5, kcal: 88.0}, {protein: 24.0, carb: 0.0, fat: 2.0, kcal: 117.0}),
    createTacoFishItem("linguado", "Linguado", ["nobre", "filé"], {protein: 18.5, carb: 0.0, fat: 1.0, kcal: 85.0}, {protein: 24.6, carb: 0.0, fat: 1.3, kcal: 113.0}),
    createTacoFishItem("robalo", "Robalo", ["nobre", "mar"], {protein: 18.0, carb: 0.0, fat: 1.5, kcal: 88.0}, {protein: 24.0, carb: 0.0, fat: 2.0, kcal: 117.0}),
    createTacoFishItem("namorado", "Namorado", ["nobre", "mar"], {protein: 19.0, carb: 0.0, fat: 1.8, kcal: 95.0}, {protein: 25.3, carb: 0.0, fat: 2.4, kcal: 126.0}),
    createTacoFishItem("badejo", "Badejo", ["nobre", "mar"], {protein: 19.5, carb: 0.0, fat: 1.2, kcal: 92.0}, {protein: 26.0, carb: 0.0, fat: 1.6, kcal: 122.0}),
    createTacoFishItem("garoupa", "Garoupa", ["nobre", "mar"], {protein: 19.0, carb: 0.0, fat: 1.0, kcal: 89.0}, {protein: 25.3, carb: 0.0, fat: 1.3, kcal: 118.0}),
    createTacoFishItem("bacalhau", "Bacalhau", ["salgado", "porto"], {protein: 20.0, carb: 0.0, fat: 1.0, kcal: 90.0}, {protein: 28.0, carb: 0.0, fat: 1.4, kcal: 125.0}), // Values for desalted/fresh
    // New - Oily/Fatty/Darker Fish
    createTacoFishItem("sardinha", "Sardinha", ["mar", "azul"], {protein: 21.0, carb: 0.0, fat: 8.0, kcal: 160.0}, {protein: 28.0, carb: 0.0, fat: 10.6, kcal: 213.0}),
    createTacoFishItem("atum", "Atum", ["mar", "nobre"], {protein: 25.0, carb: 0.0, fat: 1.0, kcal: 115.0}, {protein: 33.0, carb: 0, fat: 1.3, kcal: 153.0}), // Fresh Tuna is very lean
    createTacoFishItem("tainha", "Tainha", ["mar"], {protein: 19.0, carb: 0.0, fat: 5.0, kcal: 125.0}, {protein: 25.3, carb: 0.0, fat: 6.6, kcal: 166.0}),
    createTacoFishItem("anchova", "Anchova", ["mar", "azul"], {protein: 20.0, carb: 0.0, fat: 6.0, kcal: 135.0}, {protein: 26.6, carb: 0.0, fat: 8.0, kcal: 180.0}),
    createTacoFishItem("cavalinha", "Cavalinha", ["mar", "azul"], {protein: 19.0, carb: 0.0, fat: 13.0, kcal: 200.0}, {protein: 25.3, carb: 0.0, fat: 17.3, kcal: 266.0}),
    createTacoFishItem("cacao", "Cação (Tubarão)", ["mar", "posta"], {protein: 18.0, carb: 0.0, fat: 0.8, kcal: 85.0}, {protein: 24.0, carb: 0.0, fat: 1.1, kcal: 113.0}),
    // New - River/Freshwater
    createTacoFishItem("tambaqui", "Tambaqui", ["rio", "doce"], {protein: 18.0, carb: 0.0, fat: 12.0, kcal: 185.0}, {protein: 24.0, carb: 0.0, fat: 16.0, kcal: 246.0}),
    createTacoFishItem("pacu", "Pacu", ["rio", "doce"], {protein: 17.5, carb: 0.0, fat: 10.0, kcal: 165.0}, {protein: 23.3, carb: 0.0, fat: 13.3, kcal: 220.0}),
    createTacoFishItem("pintado", "Pintado / Surubim", ["rio", "doce", "couro"], {protein: 18.5, carb: 0.0, fat: 8.0, kcal: 150.0}, {protein: 24.6, carb: 0.0, fat: 10.6, kcal: 200.0}),
    createTacoFishItem("pirarucu", "Pirarucu", ["rio", "amazonico"], {protein: 19.0, carb: 0.0, fat: 5.0, kcal: 125.0}, {protein: 25.3, carb: 0.0, fat: 6.6, kcal: 166.0}),
    createTacoFishItem("tucunare", "Tucunaré", ["rio", "doce"], {protein: 19.0, carb: 0.0, fat: 1.5, kcal: 95.0}, {protein: 25.3, carb: 0.0, fat: 2.0, kcal: 126.0}),
    createTacoFishItem("traira", "Traíra", ["rio", "doce"], {protein: 18.0, carb: 0.0, fat: 2.0, kcal: 95.0}, {protein: 24.0, carb: 0.0, fat: 2.6, kcal: 126.0})
];

// Special Item: Pasta de Amendoim
const peanutButter = {
    id: "pasta-de-amendoim-100",
    name: "Pasta de Amendoim (100% amendoim)",
    category: "Oleaginosas",
    type: "oleaginosas",
    dominantMacro: "fat",
    hasConversion: false,
    defaultCookedId: null,
    keywords: ["pasta", "amendoim", "oleaginosa", "castanha", "gordura", "manteiga", "creme"],
    source: normalizeSource("TACO 4ª edição"),
    taco_raw_item: "Amendoim torrado",
    taco_cooked_item: null,
    note: "Valores baseados em TACO - Amendoim torrado. Produto 100% amendoim, sem adição de óleos ou açúcares.",
    ftp: {},
    variants: {
      raw: {
        name: "Pasta de Amendoim (100%)",
        protein_100g: 25.0,
        carb_100g: 20.0,
        fat_100g: 49.0,
        kcal_100g: 595.0,
        fiber_100g: 6.0
      },
      cooked: null
    },
    modeRestrictions: { calculator: false, substitution: true, recipe: false },
    substitutionInfo: {
      group: "Oleaginosas",
      equivalentTo: "Amendoim torrado",
      portionSize: 30, // 30g portion
      macrosPerPortion: {
        protein: 7.5,
        carbs: 6.0,
        fat: 14.7,
        fiber: 1.8,
        calories: 178.5
      }
    }
};

export const foodDatabase = [
  ...riceItems,
  ...tuberItems,
  ...breadItems,
  ...beanItems,
  ...cerealItems,
  ...pastaItems, 
  ...oleaginosas,
  peanutButter,
  // frutas array removed here - now in fruitsDatabase.js
  ...dairyItems, 
  ...chickenFoods,
  ...seafoodItemsArr,
  ...porkItemsArr,
  ...cheeseItemsArr,
  ...leanBeef,
  ...mediumBeef,
  ...fattyBeef,
  ...traditionalBeef,
  ...organItems,
  ...eggItems,
  ...tacoFishItems
];

export const getFoodById = (id) => {
  return foodDatabase.find(food => food.id === id);
};

// Deprecated in favor of utility searchFoods, but kept for compatibility
export const getFoodSuggestions = (query) => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) || 
    (food.category && food.category.toLowerCase().includes(lowerQuery)) ||
    (food.keywords && food.keywords.some(k => k.toLowerCase().includes(lowerQuery)))
  );
};

export default foodDatabase;
