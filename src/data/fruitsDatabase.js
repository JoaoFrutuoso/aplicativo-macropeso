
import { normalizeSource } from '@/utils/sourceNormalization';

const createFruitItem = (id, name, keywords, values) => {
  const finalKeywords = [...new Set([...keywords, "fruta", "doce", "natural", "vegetal", "carboidrato", "fibras", "vitamina"])];

  return {
    id,
    name,
    category: "Frutas",
    type: "frutas",
    dominantMacro: "carb",
    hasConversion: false, // Most fruits in this context are raw/direct consumption
    defaultCookedId: null,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição / USDA"),
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

export const fruitsDatabase = [
  // A
  createFruitItem("abacate", "Abacate", ["gordura", "avocado"], { p: 1.2, c: 6.0, f: 8.4, k: 96 }),
  createFruitItem("abacaxi", "Abacaxi", ["citrico", "acido"], { p: 0.9, c: 12.3, f: 0.1, k: 48 }),
  createFruitItem("abiu", "Abiu", ["amarelo", "nativa"], { p: 2.1, c: 14.9, f: 0.1, k: 62 }),
  createFruitItem("acerola", "Acerola", ["citrico", "vitamina c"], { p: 0.9, c: 8.0, f: 0.2, k: 33 }),
  createFruitItem("acai_polpa", "Açaí (Polpa)", ["roxo", "energetico", "gordura"], { p: 0.8, c: 6.2, f: 3.9, k: 58 }),
  createFruitItem("ameixa_fresca", "Ameixa (Fresca)", ["vermelha", "roxa"], { p: 0.8, c: 13.9, f: 0.2, k: 53 }),
  createFruitItem("ameixa_seca", "Ameixa (Seca)", ["seca", "desidratada"], { p: 2.2, c: 63.9, f: 0.4, k: 240 }),
  createFruitItem("amora", "Amora", ["vermelha", "frutas vermelhas"], { p: 1.4, c: 9.6, f: 0.4, k: 43 }),
  createFruitItem("araca", "Araçá", ["goiabinha", "amarelo"], { p: 1.5, c: 14.0, f: 0.5, k: 60 }),
  createFruitItem("atemoya", "Atemoya", ["pinha", "doce"], { p: 1.3, c: 25.0, f: 0.6, k: 94 }),

  // B
  createFruitItem("bacuri", "Bacuri", ["amazonico"], { p: 1.9, c: 22.8, f: 2.0, k: 105 }),
  createFruitItem("banana_prata", "Banana Prata", ["prata"], { p: 1.3, c: 26.0, f: 0.1, k: 98 }),
  createFruitItem("banana_nanica", "Banana Nanica", ["nanica", "dagua"], { p: 1.4, c: 23.8, f: 0.1, k: 92 }),
  createFruitItem("banana_maca", "Banana Maçã", ["maca"], { p: 1.8, c: 22.3, f: 0.1, k: 87 }),
  createFruitItem("banana_terra", "Banana da Terra", ["terra", "cozinhar"], { p: 1.4, c: 33.7, f: 0.2, k: 128 }),
  createFruitItem("bergamota", "Bergamota", ["tangerina", "citrico"], { p: 0.8, c: 13.3, f: 0.3, k: 53 }),
  createFruitItem("buriti", "Buriti", ["palmeira", "gordura"], { p: 3.3, c: 29.8, f: 10.5, k: 215 }),

  // C
  createFruitItem("caja", "Cajá", ["manga", "amarelo"], { p: 1.3, c: 11.4, f: 0.2, k: 46 }),
  createFruitItem("caju", "Caju", ["citrico", "suco"], { p: 1.0, c: 10.3, f: 0.3, k: 43 }),
  createFruitItem("cambuci", "Cambuci", ["azedo", "nativa"], { p: 0.8, c: 8.0, f: 0.2, k: 35 }),
  createFruitItem("caqui", "Caqui", ["chocolate", "fuyu"], { p: 0.4, c: 19.3, f: 0.1, k: 71 }),
  createFruitItem("carambola", "Carambola", ["estrela"], { p: 0.9, c: 11.5, f: 0.2, k: 46 }),
  createFruitItem("cereja", "Cereja", ["fresca", "vermelha"], { p: 1.1, c: 16.0, f: 0.2, k: 63 }),
  createFruitItem("ciriguela", "Ciriguela (Seriguela)", ["seriguela", "amarela"], { p: 1.4, c: 18.9, f: 0.4, k: 76 }),
  createFruitItem("coco_polpa", "Coco da Baía (Polpa)", ["gordura", "seco"], { p: 3.7, c: 10.4, f: 42.0, k: 406 }),
  createFruitItem("coco_agua", "Coco (Água)", ["agua", "hidratar"], { p: 0.1, c: 5.0, f: 0.1, k: 22 }),
  createFruitItem("cupuacu", "Cupuaçu", ["polpa", "amazonico"], { p: 0.8, c: 14.7, f: 0.6, k: 49 }),

  // D - F
  createFruitItem("damasco_fresco", "Damasco (Fresco)", ["fresco"], { p: 1.4, c: 11.1, f: 0.4, k: 48 }),
  createFruitItem("damasco_seco", "Damasco (Seco)", ["seco", "desidratado"], { p: 3.4, c: 62.6, f: 0.5, k: 241 }),
  createFruitItem("figo", "Figo", ["roxo"], { p: 1.0, c: 10.2, f: 0.4, k: 41 }),
  createFruitItem("framboesa", "Framboesa", ["vermelha", "berries"], { p: 1.2, c: 11.9, f: 0.7, k: 52 }),
  createFruitItem("fruta_do_conde", "Fruta-do-Conde (Pinha)", ["pinha"], { p: 2.1, c: 23.6, f: 0.3, k: 101 }),

  // G
  createFruitItem("goiaba_branca", "Goiaba Branca", ["branca"], { p: 0.9, c: 11.8, f: 0.5, k: 52 }),
  createFruitItem("goiaba_vermelha", "Goiaba Vermelha", ["vermelha"], { p: 1.1, c: 13.0, f: 0.4, k: 54 }),
  createFruitItem("graviola", "Graviola", ["branca", "suco"], { p: 1.0, c: 14.9, f: 0.3, k: 62 }),
  createFruitItem("groselha", "Groselha", ["vermelha", "xarope"], { p: 1.4, c: 10.0, f: 0.2, k: 56 }),

  // J - L
  createFruitItem("jabuticaba", "Jabuticaba", ["roxa", "bolinha"], { p: 0.6, c: 15.3, f: 0.1, k: 58 }),
  createFruitItem("jaca", "Jaca", ["polpa", "doce"], { p: 1.4, c: 22.5, f: 0.6, k: 88 }),
  createFruitItem("jambo", "Jambo", ["vermelho"], { p: 0.6, c: 6.5, f: 0.1, k: 27 }),
  createFruitItem("jenipapo", "Jenipapo", ["nativa", "licor"], { p: 1.2, c: 25.0, f: 0.3, k: 100 }),
  createFruitItem("kiwi", "Kiwi", ["verde", "fuzz"], { p: 1.3, c: 11.5, f: 0.6, k: 51 }),
  createFruitItem("laranja_baia", "Laranja Baía", ["baia", "umbigo"], { p: 1.1, c: 11.5, f: 0.1, k: 45 }),
  createFruitItem("laranja_lima", "Laranja Lima", ["lima", "doce"], { p: 1.1, c: 11.5, f: 0.1, k: 46 }),
  createFruitItem("laranja_pera", "Laranja Pera", ["pera", "suco"], { p: 1.0, c: 8.9, f: 0.1, k: 37 }),
  createFruitItem("lichia", "Lichia", ["doce", "exotica"], { p: 0.8, c: 16.5, f: 0.4, k: 66 }),
  createFruitItem("limao_siciliano", "Limão Siciliano", ["amarelo"], { p: 1.1, c: 9.3, f: 0.3, k: 29 }),
  createFruitItem("limao_taiti", "Limão Taiti", ["verde", "caipirinha"], { p: 0.9, c: 11.1, f: 0.1, k: 32 }),

  // M
  createFruitItem("maca_argentina", "Maçã Argentina", ["red", "importada"], { p: 0.2, c: 16.6, f: 0.1, k: 63 }),
  createFruitItem("maca_nacional", "Maçã Nacional", ["fuji", "gala"], { p: 0.3, c: 15.2, f: 0.1, k: 56 }),
  createFruitItem("mamao_formosa", "Mamão Formosa", ["formosa", "grande"], { p: 0.8, c: 11.6, f: 0.1, k: 45 }),
  createFruitItem("mamao_papaia", "Mamão Papaia", ["papaia", "pequeno"], { p: 0.5, c: 10.4, f: 0.1, k: 40 }),
  createFruitItem("manga_espada", "Manga Espada", ["espada", "fiapo"], { p: 0.8, c: 18.2, f: 0.2, k: 70 }),
  createFruitItem("manga_haden", "Manga Haden", ["haden"], { p: 0.7, c: 17.5, f: 0.2, k: 64 }),
  createFruitItem("manga_palmer", "Manga Palmer", ["palmer", "sem fiapo"], { p: 0.4, c: 19.4, f: 0.2, k: 72 }),
  createFruitItem("manga_tommy", "Manga Tommy", ["tommy", "vermelha"], { p: 0.9, c: 16.7, f: 0.2, k: 64 }),
  createFruitItem("mangaba", "Mangaba", ["leite", "nativa"], { p: 0.7, c: 10.5, f: 0.3, k: 43 }),
  createFruitItem("maracuja", "Maracujá (Polpa)", ["azedo", "suco"], { p: 2.0, c: 12.3, f: 2.1, k: 68 }),
  createFruitItem("melancia", "Melancia", ["agua", "vermelha"], { p: 0.9, c: 8.1, f: 0.1, k: 33 }),
  createFruitItem("melao_amarelo", "Melão Amarelo", ["amarelo"], { p: 0.7, c: 7.5, f: 0.0, k: 29 }),
  createFruitItem("melao_cantaloupe", "Melão Cantaloupe", ["laranja"], { p: 0.8, c: 8.2, f: 0.2, k: 34 }),
  createFruitItem("melao_galia", "Melão Gália", ["verde", "casca"], { p: 0.9, c: 6.0, f: 0.1, k: 25 }),
  createFruitItem("mexerica", "Mexerica", ["tangerina", "rio"], { p: 0.7, c: 9.3, f: 0.2, k: 38 }),
  createFruitItem("mirtilo", "Mirtilo (Blueberry)", ["azul", "berries"], { p: 0.7, c: 14.5, f: 0.3, k: 57 }),
  createFruitItem("morango", "Morango", ["vermelho", "berries"], { p: 0.9, c: 6.8, f: 0.3, k: 30 }),

  // N - P
  createFruitItem("nectarina", "Nectarina", ["pessego", "lisa"], { p: 1.1, c: 10.6, f: 0.3, k: 44 }),
  createFruitItem("nespera", "Nêspera", ["ameixa amarela"], { p: 0.4, c: 12.1, f: 0.2, k: 47 }),
  createFruitItem("pequi", "Pequi", ["goias", "amarelo"], { p: 4.5, c: 13.0, f: 20.0, k: 250 }),
  createFruitItem("pera_argentina", "Pêra Argentina", ["williams"], { p: 0.6, c: 16.1, f: 0.2, k: 61 }),
  createFruitItem("pera_nacional", "Pêra Nacional", ["dagua"], { p: 0.6, c: 14.0, f: 0.2, k: 53 }),
  createFruitItem("pessego", "Pêssego", ["nacional"], { p: 0.8, c: 9.3, f: 0.1, k: 36 }),
  createFruitItem("physalis", "Physalis", ["golden", "exotica"], { p: 1.9, c: 11.0, f: 0.7, k: 53 }),
  createFruitItem("pitanga", "Pitanga", ["vermelha", "nativa"], { p: 0.9, c: 8.7, f: 0.2, k: 38 }),

  // R - Z
  createFruitItem("roma", "Romã", ["sementes", "vermelha"], { p: 1.7, c: 18.7, f: 1.2, k: 83 }),
  createFruitItem("sapoti", "Sapoti", ["doce", "marrom"], { p: 0.4, c: 20.0, f: 1.1, k: 83 }),
  createFruitItem("seriguela", "Seriguela", ["ciriguela", "amarela"], { p: 1.4, c: 18.9, f: 0.4, k: 76 }),
  createFruitItem("tamarindo", "Tamarindo", ["azedo", "vagem"], { p: 3.2, c: 54.9, f: 0.5, k: 230 }),
  createFruitItem("tangerina", "Tangerina", ["mexerica", "gomos"], { p: 0.7, c: 9.3, f: 0.2, k: 38 }),
  createFruitItem("umbu", "Umbu", ["nativa", "azedo"], { p: 0.8, c: 9.4, f: 0.1, k: 37 }),
  createFruitItem("uva_italia", "Uva Itália", ["verde", "grande"], { p: 0.8, c: 13.6, f: 0.1, k: 53 }),
  createFruitItem("uva_niagara", "Uva Niágara", ["roxa", "pequena"], { p: 0.7, c: 14.0, f: 0.2, k: 55 }),
  createFruitItem("uva_passa", "Uva Passa", ["seca", "desidratada"], { p: 3.3, c: 74.0, f: 0.5, k: 299 }),
  createFruitItem("uva_rosada", "Uva Rosada", ["rosa"], { p: 0.6, c: 17.0, f: 0.1, k: 65 }),
  createFruitItem("uva_rubi", "Uva Rubi", ["roxa", "grande"], { p: 0.6, c: 12.7, f: 0.1, k: 49 })
];

// -------- CHICKEN DATABASE EXTENSION --------

const createChickenItem = (id, name, keywords, values) => {
  const finalKeywords = [...new Set([...keywords, "frango", "ave", "carne", "proteina", "zero carbo", "low carb"])];
  
  // Standard conversion factors if not provided in values (Approximation for demo)
  // Cooking yield ~75% for meats (Protein concentrates ~1.33x)
  const YIELD_FACTOR = 0.75; 
  const PROTEIN_CONCENTRATION = 1 / YIELD_FACTOR;

  const rawProtein = values.p;
  const rawFat = values.f;
  const rawCarb = values.c || 0;
  const rawKcal = values.k;

  const cookedProtein = parseFloat((rawProtein * PROTEIN_CONCENTRATION).toFixed(1));
  const cookedFat = parseFloat((rawFat * PROTEIN_CONCENTRATION).toFixed(1)); // Fat loss varies, but approximation
  const cookedCarb = parseFloat((rawCarb * PROTEIN_CONCENTRATION).toFixed(1));
  const cookedKcal = parseFloat((rawKcal * PROTEIN_CONCENTRATION).toFixed(0));

  return {
    id,
    name,
    category: "Frango",
    type: "carnes",
    dominantMacro: "protein",
    hasConversion: true, // Enabled for MacroPesoCalculator
    defaultCookedId: `${id}_cooked`,
    keywords: finalKeywords,
    source: normalizeSource("TACO 4ª edição / USDA"),
    taco_raw_item: `${name} (Cru)`,
    taco_cooked_item: `${name} (Grelhado/Cozido)`,
    ftp: {
      methods: {
        grelhado: { yield: 0.75, description: "Grelhado na chapa sem óleo" },
        cozido: { yield: 0.70, description: "Cozido em água" },
        assado: { yield: 0.75, description: "Assado no forno" },
        frito: { yield: 0.65, description: "Frito em imersão" },
        vapor: { yield: 0.95, description: "Cozido no vapor" }
      }
    },
    variants: {
      raw: {
        name: `${name} (Cru)`,
        protein_100g: rawProtein,
        carb_100g: rawCarb,
        fat_100g: rawFat,
        kcal_100g: rawKcal
      },
      cooked: {
        name: `${name} (Grelhado/Cozido)`,
        protein_100g: cookedProtein,
        carb_100g: cookedCarb,
        fat_100g: cookedFat,
        kcal_100g: cookedKcal
      }
    },
    modeRestrictions: { calculator: true, substitution: true, recipe: true }
  };
};

export const chickenDatabase = [
  createChickenItem("frango_peito", "Peito de Frango", ["file", "peito", "magro"], { p: 23.0, f: 1.5, k: 110 }),
  createChickenItem("frango_file_peito", "Filé de Peito de Frango", ["file", "peito", "magro"], { p: 23.0, f: 1.5, k: 110 }),
  createChickenItem("frango_sassami", "Sassami (Filézinho)", ["filezinho", "peito", "magro"], { p: 23.0, f: 1.5, k: 110 }),
  createChickenItem("frango_coxa", "Coxa de Frango", ["coxa", "com osso"], { p: 17.0, f: 9.0, k: 155 }),
  createChickenItem("frango_sobrecoxa", "Sobrecoxa de Frango", ["sobrecoxa", "suculenta"], { p: 18.0, f: 12.0, k: 185 }),
  createChickenItem("frango_coxa_sobrecoxa", "Coxa com Sobrecoxa", ["coxa", "sobrecoxa", "leg"], { p: 17.5, f: 10.5, k: 170 }),
  createChickenItem("frango_asa", "Asa de Frango", ["asinha", "asa"], { p: 18.0, f: 15.0, k: 210 }),
  createChickenItem("frango_drumette", "Drumette (Coxinha da Asa)", ["coxinha", "asa", "aperitivo"], { p: 18.0, f: 10.0, k: 165 }),
  createChickenItem("frango_meio_asa", "Meio da Asa (Tulipa)", ["tulipa", "meio", "asa"], { p: 19.0, f: 14.0, k: 205 }),
  createChickenItem("frango_ponta_asa", "Ponta da Asa", ["ponta", "asa"], { p: 15.0, f: 20.0, k: 240 }),
  createChickenItem("frango_dorso", "Dorso de Frango", ["carcaca", "sopa"], { p: 14.0, f: 20.0, k: 245 }),
  createChickenItem("frango_carcaca", "Carcaça de Frango", ["dorso", "sopa"], { p: 14.0, f: 18.0, k: 220 }),
  createChickenItem("frango_inteiro", "Frango Inteiro", ["frango", "assado"], { p: 18.0, f: 13.0, k: 195 }),
  createChickenItem("frango_inteiro_sem_pele", "Frango Inteiro sem Pele", ["frango", "magro"], { p: 20.0, f: 6.0, k: 140 }),
  createChickenItem("frango_passarinho", "Frango a Passarinho", ["cortado", "frito"], { p: 18.0, f: 14.0, k: 200 }),
  createChickenItem("frango_moela", "Moela de Frango", ["miudos"], { p: 18.0, f: 2.0, k: 95 }),
  createChickenItem("frango_figado", "Fígado de Frango", ["miudos", "ferro"], { p: 17.0, f: 4.0, c: 1.0, k: 110 }),
  createChickenItem("frango_coracao", "Coração de Frango", ["miudos", "churrasco"], { p: 16.0, f: 12.0, c: 1.0, k: 180 }),
  createChickenItem("frango_pescoco", "Pescoço de Frango", ["sopa", "pescoco"], { p: 13.0, f: 18.0, k: 215 }),
  createChickenItem("frango_pele", "Pele de Frango", ["gordura", "pele"], { p: 10.0, f: 40.0, k: 400 }),
  createChickenItem("frango_peito_moido", "Peito de Frango Moído", ["moido", "magro"], { p: 22.0, f: 3.0, k: 120 }),
  createChickenItem("frango_carne_moida", "Carne Moída de Frango", ["moida", "mistura"], { p: 20.0, f: 8.0, k: 155 }),
  createChickenItem("frango_desfiado", "Frango Desfiado", ["recheio", "peito"], { p: 23.0, f: 2.0, k: 115 }),
  createChickenItem("frango_file_sassami", "Filé Sassami", ["filezinho", "sassami"], { p: 23.0, f: 1.5, k: 110 }),
  createChickenItem("frango_coxinha_asa", "Coxinha da Asa", ["drumette"], { p: 18.0, f: 10.0, k: 165 })
];
