export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  number: string;
  slug: string;
  title: string;
  description: string;
  items: string[];
  priceFrom?: string;
  pricingAnchor?: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export type PortfolioIcon = "funnel" | "chat" | "delivery" | "placeholder";

export interface PortfolioProject {
  name: string;
  industry: string;
  services: string;
  description: string;
  icon: PortfolioIcon;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ConsultationCategory {
  slug: string;
  title: string;
  description: string;
  focus: string[];
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  disclaimer: string;
}

export interface PricingTier {
  name: string;
  price: string;
  ctaLabel?: string;
  ctaTarget?: "quote" | "consultation";
}

export interface PricingCategory {
  slug: string;
  title: string;
  description: string;
  tiers: PricingTier[];
  ctaLabel: string;
  ctaTarget?: "quote" | "consultation";
}

export interface PricingPostLaunchItem {
  name: string;
  price: string;
}

export interface Pricing {
  metaDescription: string;
  headline: string;
  subtitle: string;
  categories: PricingCategory[];
  consulting: {
    slug: string;
    title: string;
    description: string;
    hourlyName: string;
    hourlyPrice: string;
    hourlyCta: string;
    analysisName: string;
    analysisPrice: string;
    analysisCta: string;
  };
  postLaunch: {
    slug: string;
    title: string;
    description: string;
    items: PricingPostLaunchItem[];
    cta: string;
  };
  note: string;
  finalCta: {
    headline: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  viewPricing: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    brand: string;
    links: NavLink[];
    startProject: string;
    bookConsultation: string;
    languageToggle: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  servicesSection: {
    headline: string;
    subtitle: string;
  };
  services: Service[];
  productJourney: {
    eyebrow: string;
    title: string;
    description: string;
    steps: string[];
  };
  whyLumen: {
    headline: string;
    subtitle: string;
    features: Feature[];
  };
  process: {
    headline: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  portfolio: {
    headline: string;
    subtitle: string;
    placeholderNote: string;
    projects: PortfolioProject[];
  };
  industries: {
    headline: string;
    subtitle: string;
    items: string[];
    note: string;
  };
  techStack: {
    headline: string;
    subtitle: string;
    items: string[];
  };
  cta: {
    headline: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  consultationsIndex: {
    headline: string;
    subtitle: string;
    categories: ConsultationCategory[];
    priceLabel: string;
    priceValue: string;
    durationLabel: string;
    durationValue: string;
    cta: string;
    flowNote: string;
  };
  booking: {
    backToConsultations: string;
    stepDetails: string;
    stepSchedule: string;
    stepReview: string;
    included: string;
    dateLabel: string;
    timeLabel: string;
    noSlotsForDay: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    continueButton: string;
    backButton: string;
    submitButton: string;
    processingButton: string;
    summaryTitle: string;
    totalLabel: string;
    followUpNote: string;
    errorGeneric: string;
    confirmedTitle: string;
    confirmedBody: string;
    confirmationRef: string;
    backHome: string;
  };
  proposal: {
    notFoundTitle: string;
    notFoundBody: string;
    milestonesTitle: string;
    totalLabel: string;
    statusPending: string;
    statusAwaitingConfirmation: string;
    statusPaid: string;
    confirmButton: string;
    confirmingButton: string;
    followUpNote: string;
    errorGeneric: string;
  };
  startProject: {
    headline: string;
    subtitle: string;
    nameLabel: string;
    companyLabel: string;
    emailLabel: string;
    phoneLabel: string;
    projectTypeLabel: string;
    projectTypes: string[];
    budgetLabel: string;
    budgetPlaceholder: string;
    timelineLabel: string;
    timelinePlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
  };
  faq: {
    headline: string;
    subtitle: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    linksHeadline: string;
    links: NavLink[];
    socialHeadline: string;
    rights: string;
    legalLinks: NavLink[];
  };
  common: {
    minutes: string;
  };
  legal: {
    privacy: LegalPage;
    terms: LegalPage;
  };
  pricing: Pricing;
}
