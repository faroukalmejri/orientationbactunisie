export const ALL_REGIONS = [
  "تونس", "أريانة", "بن عروس", "منوبة", "نابل", "زغوان", "بنزرت",
  "باجة", "جندوبة", "الكاف", "سليانة", "القيروان", "القصرين",
  "سيدي بوزيد", "سوسة", "المنستير", "المهدية", "صفاقس",
  "قفصة", "توزر", "قبلي", "قابس", "مدنين", "تطاوين"
];

export function getRegionFromRow(universite: string, etablissement: string): string {
  const combined = `${universite} ${etablissement}`;

  const cityPatterns: [RegExp, string][] = [
    [/قصر السعيد/, "منوبة"],
    [/ببئر الباي|بحمام الأنف|برادس|بالمحمدية|ببن عروس/, "بن عروس"],
    [/بأريانة|قرطاج/, "أريانة"],
    [/بمنوبة/, "منوبة"],
    [/ببنزرت/, "بنزرت"],
    [/بباجة/, "باجة"],
    [/بجندوبة/, "جندوبة"],
    [/بالكاف/, "الكاف"],
    [/بسليانة/, "سليانة"],
    [/بزغوان/, "زغوان"],
    [/بنابل|بالحمامات|بدار شعبان/, "نابل"],
    [/بصفاقس/, "صفاقس"],
    [/بالقيروان/, "القيروان"],
    [/بالقصرين/, "القصرين"],
    [/بسيدي بوزيد/, "سيدي بوزيد"],
    [/بسوسة/, "سوسة"],
    [/بالمنستير|بالمكنين|ببنبلة|بلمطة/, "المنستير"],
    [/بالمهدية|بالجم|بقصور الساف/, "المهدية"],
    [/بقابس/, "قابس"],
    [/بقفصة|بالمضيلة|بالرديف/, "قفصة"],
    [/بتوزر|بنفطة/, "توزر"],
    [/بقبلي|بدوز/, "قبلي"],
    [/بمدنين|ببن قردان|بجرجيس/, "مدنين"],
    [/بتطاوين/, "تطاوين"],
    [/بتونس|بالعاصمة/, "تونس"],
  ];

  for (const [pattern, region] of cityPatterns) {
    if (pattern.test(combined)) return region;
  }

  if (universite.includes("قرطاج")) return "أريانة";
  if (universite.includes("منوبة")) return "منوبة";
  if (universite.includes("صفاقس")) return "صفاقس";
  if (universite.includes("سوسة")) return "سوسة";
  if (universite.includes("المنستير")) return "المنستير";
  if (universite.includes("المهدية")) return "المهدية";
  if (universite.includes("القيروان")) return "القيروان";
  if (universite.includes("قابس")) return "قابس";
  if (universite.includes("قفصة")) return "قفصة";
  if (universite.includes("جندوبة")) return "جندوبة";
  if (universite.includes("بنزرت")) return "بنزرت";
  if (universite.includes("باجة")) return "باجة";
  if (universite.includes("سليانة")) return "سليانة";
  if (universite.includes("الكاف")) return "الكاف";
  if (universite.includes("زغوان")) return "زغوان";
  if (universite.includes("نابل")) return "نابل";
  if (universite.includes("مدنين")) return "مدنين";
  if (universite.includes("تطاوين")) return "تطاوين";
  if (universite.includes("توزر") || universite.includes("الجنوب")) return "توزر";
  if (universite.includes("قبلي")) return "قبلي";

  return "تونس";
}
