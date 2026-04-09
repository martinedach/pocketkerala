/**
 * Milestones below 1k: 200+, 300+, … 900+ (hundreds).
 * From 1k onward: 1000+, 2000+, 3000+, … (thousands).
 */
export function getSubscriberMilestoneThreshold(subscriberCount: number): number | null {
  const n = Math.floor(subscriberCount);
  if (!Number.isFinite(n) || n < 200) return null;
  if (n < 1000) return Math.floor(n / 100) * 100;
  return Math.floor(n / 1000) * 1000;
}

export function milestoneThanksTitleEn(threshold: number): string {
  return `Thanks for helping us reach ${threshold.toLocaleString("en-IN")}+ Subs!`;
}

export function milestoneThanksTitleMl(threshold: number): string {
  const num = threshold.toLocaleString("en-IN");
  return `${num}+ സബ്സ്ക്രൈബേഴ്സ് തികയ്ക്കാൻ സഹായിച്ചതിന് നന്ദി!`;
}

export function milestoneEarlySupporterEn(): string {
  return "Thanks for being part of our community as we grow!";
}

export function milestoneEarlySupporterMl(): string {
  return "വളർന്നുവരുന്ന ഞങ്ങളുടെ കൂട്ടായ്മയുടെ ഭാഗമായതിന് നന്ദി!";
}

export function milestoneUnavailableEn(): string {
  return "Thanks for helping us reach 200+ Subs!";
}

export function milestoneUnavailableMl(): string {
  return "200+ സബ്സ്ക്രൈബേഴ്സ് തികയ്ക്കാൻ സഹായിച്ചതിന് നന്ദി!";
}
