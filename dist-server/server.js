// server.ts
import "dotenv/config";
import crypto9 from "node:crypto";
import path from "node:path";
import express from "express";

// src/lib/automation-gateway.ts
import crypto from "node:crypto";

// src/data/demo.ts
var AS_OF = "2026-09-01T18:00:00.000Z";
var CREATED = "2025-10-01T09:00:00.000Z";
var record = (id) => ({ id, dataMode: "demo", synthetic: true, createdAt: CREATED, updatedAt: AS_OF });
var DEMO_PARTNERS = [
  { ...record("partner-owner-mariam"), role: "owner", status: "active", name: "Mariam El Sherif", nameAr: "\u0645\u0631\u064A\u0645 \u0627\u0644\u0634\u0631\u064A\u0641", phoneMasked: "+20 \u2022\u2022\u2022 \u2022\u2022 1842", serviceArea: "Ain Sokhna", serviceAreaAr: "\u0627\u0644\u0639\u064A\u0646 \u0627\u0644\u0633\u062E\u0646\u0629" },
  { ...record("partner-owner-youssef"), role: "owner", status: "active", name: "Youssef Mansour", nameAr: "\u064A\u0648\u0633\u0641 \u0645\u0646\u0635\u0648\u0631", phoneMasked: "+20 \u2022\u2022\u2022 \u2022\u2022 7310", serviceArea: "North Coast", serviceAreaAr: "\u0627\u0644\u0633\u0627\u062D\u0644 \u0627\u0644\u0634\u0645\u0627\u0644\u064A" },
  { ...record("partner-owner-nadia"), role: "owner", status: "active", name: "Nadia Farid", nameAr: "\u0646\u0627\u062F\u064A\u0629 \u0641\u0631\u064A\u062F", phoneMasked: "+20 \u2022\u2022\u2022 \u2022\u2022 2955", serviceArea: "Alexandria", serviceAreaAr: "\u0627\u0644\u0625\u0633\u0643\u0646\u062F\u0631\u064A\u0629" },
  { ...record("partner-scout-salma"), role: "scout", status: "active", name: "Salma Nassar", nameAr: "\u0633\u0644\u0645\u0649 \u0646\u0635\u0627\u0631", organisation: "Little Hut Coastal Scout", serviceArea: "Red Sea", serviceAreaAr: "\u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631" },
  { ...record("partner-scout-omar"), role: "scout", status: "active", name: "Omar Saleh", nameAr: "\u0639\u0645\u0631 \u0635\u0627\u0644\u062D", organisation: "Little Hut North Coast Scout", serviceArea: "North Coast", serviceAreaAr: "\u0627\u0644\u0633\u0627\u062D\u0644 \u0627\u0644\u0634\u0645\u0627\u0644\u064A" },
  { ...record("partner-operator-lina"), role: "operator", status: "active", name: "Lina Hafez", nameAr: "\u0644\u064A\u0646\u0627 \u062D\u0627\u0641\u0638", organisation: "Little Hut Operations", serviceArea: "Egypt coast", serviceAreaAr: "\u0627\u0644\u0633\u0627\u062D\u0644 \u0627\u0644\u0645\u0635\u0631\u064A" },
  { ...record("partner-operator-kareem"), role: "operator", status: "active", name: "Kareem Adel", nameAr: "\u0643\u0631\u064A\u0645 \u0639\u0627\u062F\u0644", organisation: "Little Hut Operations", serviceArea: "Egypt coast", serviceAreaAr: "\u0627\u0644\u0633\u0627\u062D\u0644 \u0627\u0644\u0645\u0635\u0631\u064A" },
  { ...record("partner-assessor-dina"), role: "assessor", status: "active", name: "Dina Riad", nameAr: "\u062F\u064A\u0646\u0627 \u0631\u064A\u0627\u0636", organisation: "Independent Stay Assessor", serviceArea: "Red Sea", serviceAreaAr: "\u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631" },
  { ...record("partner-assessor-hassan"), role: "assessor", status: "active", name: "Hassan Fawzy", nameAr: "\u062D\u0633\u0646 \u0641\u0648\u0632\u064A", organisation: "Independent Stay Assessor", serviceArea: "Mediterranean", serviceAreaAr: "\u0633\u0627\u062D\u0644 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0645\u062A\u0648\u0633\u0637" },
  { ...record("partner-community-azha"), role: "community_authority", status: "active", name: "AZHA Guest Relations", nameAr: "\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u0627\u0642\u0627\u062A \u0636\u064A\u0648\u0641 \u0623\u0632\u0647\u0627", organisation: "Community authority", serviceArea: "AZHA Ain Sokhna", serviceAreaAr: "\u0623\u0632\u0647\u0627 \u0627\u0644\u0639\u064A\u0646 \u0627\u0644\u0633\u062E\u0646\u0629" }
];
var imageSet = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=84&w=1600",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=84&w=1200",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=84&w=1200"
];
var momentCopy = {
  slow_morning: { title: "Slow Morning", titleAr: "\u0627\u0644\u0635\u0628\u0627\u062D \u0627\u0644\u0647\u0627\u062F\u0626", summary: "A quiet first hour with verified morning light and low ambient noise.", summaryAr: "\u0633\u0627\u0639\u0629 \u0623\u0648\u0644\u0649 \u0647\u0627\u062F\u0626\u0629 \u0645\u0639 \u0636\u0648\u0621 \u0635\u0628\u0627\u062D \u0645\u0648\u062B\u0642 \u0648\u0645\u0633\u062A\u0648\u0649 \u0636\u0648\u0636\u0627\u0621 \u0645\u0646\u062E\u0641\u0636." },
  long_table: { title: "Long Table", titleAr: "\u0627\u0644\u0645\u0627\u0626\u062F\u0629 \u0627\u0644\u0645\u0645\u062A\u062F\u0629", summary: "A shared table proven for an unhurried family meal.", summaryAr: "\u0645\u0627\u0626\u062F\u0629 \u0645\u0634\u062A\u0631\u0643\u0629 \u0645\u0648\u062B\u0642\u0629 \u0644\u0648\u062C\u0628\u0629 \u0639\u0627\u0626\u0644\u064A\u0629 \u0647\u0627\u062F\u0626\u0629." },
  afternoon_drift: { title: "Afternoon Drift", titleAr: "\u0633\u0643\u0648\u0646 \u0627\u0644\u0638\u0647\u064A\u0631\u0629", summary: "Shaded afternoon rest with measured thermal comfort.", summaryAr: "\u0631\u0627\u062D\u0629 \u0638\u0647\u064A\u0631\u0629 \u0645\u0638\u0644\u0644\u0629 \u0645\u0639 \u0642\u064A\u0627\u0633 \u0627\u0644\u0631\u0627\u062D\u0629 \u0627\u0644\u062D\u0631\u0627\u0631\u064A\u0629." },
  night_swim: { title: "Night Swim", titleAr: "\u0627\u0644\u0633\u0628\u0627\u062D\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629", summary: "Safe evening water access with lighting and supervision rules verified.", summaryAr: "\u062F\u062E\u0648\u0644 \u0622\u0645\u0646 \u0644\u0644\u0645\u064A\u0627\u0647 \u0645\u0633\u0627\u0621\u064B \u0628\u0639\u062F \u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0625\u0636\u0627\u0621\u0629 \u0648\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0625\u0634\u0631\u0627\u0641." },
  fire_conversation: { title: "Fire Conversation", titleAr: "\u062D\u0648\u0627\u0631 \u062D\u0648\u0644 \u0627\u0644\u0646\u0627\u0631", summary: "A protected outdoor fire setting verified for safe evening use.", summaryAr: "\u062C\u0644\u0633\u0629 \u0646\u0627\u0631 \u062E\u0627\u0631\u062C\u064A\u0629 \u0645\u062D\u0645\u064A\u0629 \u0648\u0645\u0648\u062B\u0642\u0629 \u0644\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u0633\u0627\u0626\u064A \u0627\u0644\u0622\u0645\u0646." },
  silent_reading: { title: "Silent Reading", titleAr: "\u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0635\u0627\u0645\u062A\u0629", summary: "A dedicated reading corner with measured acoustic calm.", summaryAr: "\u0631\u0643\u0646 \u0642\u0631\u0627\u0621\u0629 \u0645\u062E\u0635\u0635 \u0645\u0639 \u0647\u062F\u0648\u0621 \u0635\u0648\u062A\u064A \u0645\u0642\u0627\u0633." }
};
var provenMoment = (propertyId, key, date) => ({
  key,
  ...momentCopy[key],
  evidenceId: `evidence-${propertyId}-${key}`,
  provenAt: date
});
var property = (id, stage, input) => ({
  ...record(id),
  slug: id.replace("property-", ""),
  supplyStage: stage,
  scoutPartnerId: "partner-scout-salma",
  publiclyVisible: stage === "live",
  joiningVisible: !["live", "paused", "declined"].includes(stage),
  sealIssued: stage === "live",
  maxGuests: 6,
  bedroomCount: 3,
  calendarAuthority: stage === "live" ? "little_hut" : "unknown",
  bookingMode: "request",
  communityApprovalRequired: false,
  activationChecklistComplete: stage === "live",
  payoutReady: stage === "live",
  heroImage: imageSet[0],
  galleryImages: imageSet.slice(1),
  provenMoments: [],
  ...input
});
var DEMO_PROPERTIES = [
  property("property-azure-haven", "live", {
    slug: "azure-haven-azha",
    name: "Azure Haven at AZHA",
    nameAr: "\u0623\u0632\u0648\u0631 \u0647\u0627\u0641\u0646 \u0641\u064A \u0623\u0632\u0647\u0627",
    location: "AZHA, Ain Sokhna",
    locationAr: "\u0623\u0632\u0647\u0627\u060C \u0627\u0644\u0639\u064A\u0646 \u0627\u0644\u0633\u062E\u0646\u0629",
    summary: "Pool-view family chalet shaped around calm mornings, easy arrivals, and community-approved stays.",
    summaryAr: "\u0634\u0627\u0644\u064A\u0647 \u0639\u0627\u0626\u0644\u064A \u0628\u0625\u0637\u0644\u0627\u0644\u0629 \u0639\u0644\u0649 \u062D\u0645\u0627\u0645 \u0627\u0644\u0633\u0628\u0627\u062D\u0629\u060C \u0645\u0635\u0645\u0645 \u0644\u0635\u0628\u0627\u062D \u0647\u0627\u062F\u0626 \u0648\u0648\u0635\u0648\u0644 \u0633\u0647\u0644 \u0648\u0625\u0642\u0627\u0645\u0627\u062A \u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0646 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0643\u0645\u0628\u0648\u0646\u062F.",
    ownerPartnerId: "partner-owner-mariam",
    operatorPartnerId: "partner-operator-lina",
    assessorPartnerId: "partner-assessor-dina",
    communityAuthorityPartnerId: "partner-community-azha",
    communityApprovalRequired: true,
    calendarAuthority: "little_hut",
    nightlyFloorEgp: 6e3,
    payoutReady: true,
    activationChecklistComplete: true,
    sealIssued: true,
    provenMoments: [provenMoment("azure-haven", "slow_morning", "2026-02-12"), provenMoment("azure-haven", "long_table", "2026-02-12")]
  }),
  property("property-seaward-library", "live", {
    slug: "seaward-library",
    name: "The Seaward Library",
    nameAr: "\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u0628\u062D\u0631",
    location: "Ain Sokhna",
    locationAr: "\u0627\u0644\u0639\u064A\u0646 \u0627\u0644\u0633\u062E\u0646\u0629",
    summary: "A sea-facing reading home where quiet, morning light, and the reading corner are independently proven.",
    summaryAr: "\u0628\u064A\u062A \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0645\u0648\u0627\u062C\u0647 \u0644\u0644\u0628\u062D\u0631\u060C \u0645\u0648\u062B\u0642 \u0641\u064A\u0647 \u0627\u0644\u0647\u062F\u0648\u0621 \u0648\u0636\u0648\u0621 \u0627\u0644\u0635\u0628\u0627\u062D \u0648\u0631\u0643\u0646 \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644.",
    ownerPartnerId: "partner-owner-mariam",
    operatorPartnerId: "partner-operator-kareem",
    assessorPartnerId: "partner-assessor-dina",
    calendarAuthority: "little_hut",
    bookingMode: "instant",
    nightlyFloorEgp: 5200,
    payoutReady: true,
    activationChecklistComplete: true,
    sealIssued: true,
    maxGuests: 4,
    bedroomCount: 2,
    heroImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=84&w=1600",
    provenMoments: [provenMoment("seaward-library", "slow_morning", "2026-01-18"), provenMoment("seaward-library", "silent_reading", "2026-01-18")]
  }),
  property("property-casa-bianca", "live", {
    slug: "casa-bianca",
    name: "Casa Bianca",
    nameAr: "\u0643\u0627\u0632\u0627 \u0628\u064A\u0627\u0646\u0643\u0627",
    location: "Alexandria",
    locationAr: "\u0627\u0644\u0625\u0633\u0643\u0646\u062F\u0631\u064A\u0629",
    summary: "A restored courtyard home verified for long-table gatherings and slow shaded afternoons.",
    summaryAr: "\u0628\u064A\u062A \u0628\u0641\u0646\u0627\u0621 \u0645\u064F\u0631\u0645\u0645 \u0648\u0645\u0648\u062B\u0642 \u0644\u0644\u0645\u0627\u0626\u062F\u0629 \u0627\u0644\u0645\u0645\u062A\u062F\u0629 \u0648\u0647\u062F\u0648\u0621 \u0627\u0644\u0638\u0647\u064A\u0631\u0629 \u0641\u064A \u0627\u0644\u0638\u0644.",
    ownerPartnerId: "partner-owner-nadia",
    scoutPartnerId: "partner-scout-omar",
    operatorPartnerId: "partner-operator-lina",
    assessorPartnerId: "partner-assessor-hassan",
    calendarAuthority: "little_hut",
    nightlyFloorEgp: 4800,
    payoutReady: true,
    activationChecklistComplete: true,
    sealIssued: true,
    heroImage: "https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=84&w=1600",
    provenMoments: [provenMoment("casa-bianca", "long_table", "2026-03-05"), provenMoment("casa-bianca", "afternoon_drift", "2026-03-05")]
  }),
  property("property-dune-house", "activation_ready", {
    name: "Dune House",
    nameAr: "\u0628\u064A\u062A \u0627\u0644\u0643\u062B\u0628\u0627\u0646",
    location: "Ras El Hekma",
    locationAr: "\u0631\u0623\u0633 \u0627\u0644\u062D\u0643\u0645\u0629",
    summary: "Owner-approved home completing calendar and arrival controls.",
    summaryAr: "\u0628\u064A\u062A \u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647 \u0627\u0644\u0645\u0627\u0644\u0643 \u0648\u064A\u0633\u062A\u0643\u0645\u0644 \u0636\u0648\u0627\u0628\u0637 \u0627\u0644\u062A\u0642\u0648\u064A\u0645 \u0648\u0627\u0644\u0648\u0635\u0648\u0644.",
    ownerPartnerId: "partner-owner-youssef",
    scoutPartnerId: "partner-scout-omar",
    operatorPartnerId: "partner-operator-kareem",
    assessorPartnerId: "partner-assessor-hassan",
    calendarAuthority: "external",
    nightlyFloorEgp: 9e3,
    payoutReady: true,
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=84&w=1600",
    provenMoments: [provenMoment("dune-house", "slow_morning", "2026-08-17"), provenMoment("dune-house", "fire_conversation", "2026-08-17")]
  }),
  property("property-lagoon-pavilion", "decision_pending", {
    name: "Lagoon Pavilion",
    nameAr: "\u062C\u0646\u0627\u062D \u0627\u0644\u0644\u0627\u062C\u0648\u0646",
    location: "El Gouna",
    locationAr: "\u0627\u0644\u062C\u0648\u0646\u0629",
    summary: "Assessment passed; owner commercial decision is now required.",
    summaryAr: "\u0627\u062C\u062A\u0627\u0632 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0648\u064A\u0646\u062A\u0638\u0631 \u0627\u0644\u0622\u0646 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u062A\u062C\u0627\u0631\u064A \u0644\u0644\u0645\u0627\u0644\u0643.",
    ownerPartnerId: "partner-owner-youssef",
    operatorPartnerId: "partner-operator-kareem",
    assessorPartnerId: "partner-assessor-dina",
    calendarAuthority: "external",
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=84&w=1600",
    provenMoments: [provenMoment("lagoon-pavilion", "night_swim", "2026-08-26"), provenMoment("lagoon-pavilion", "afternoon_drift", "2026-08-26")]
  }),
  property("property-olive-courtyard", "assessment_scheduled", {
    name: "Olive Courtyard",
    nameAr: "\u0641\u0646\u0627\u0621 \u0627\u0644\u0632\u064A\u062A\u0648\u0646",
    location: "North Coast",
    locationAr: "\u0627\u0644\u0633\u0627\u062D\u0644 \u0627\u0644\u0634\u0645\u0627\u0644\u064A",
    summary: "Owner consent captured; independent visit booked.",
    summaryAr: "\u062A\u0645 \u062A\u0648\u062B\u064A\u0642 \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u0627\u0644\u0643 \u0648\u062D\u062C\u0632 \u0627\u0644\u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629.",
    ownerPartnerId: "partner-owner-nadia",
    scoutPartnerId: "partner-scout-omar",
    assessorPartnerId: "partner-assessor-hassan",
    heroImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=84&w=1600"
  }),
  property("property-sinai-breeze", "owner_engaged", {
    name: "Sinai Breeze",
    nameAr: "\u0646\u0633\u064A\u0645 \u0633\u064A\u0646\u0627\u0621",
    location: "Ras Sudr",
    locationAr: "\u0631\u0623\u0633 \u0633\u062F\u0631",
    summary: "Owner reviewing the Little Hut standard and evidence process.",
    summaryAr: "\u0627\u0644\u0645\u0627\u0644\u0643 \u064A\u0631\u0627\u062C\u0639 \u0645\u0639\u064A\u0627\u0631 \u0644\u064A\u062A\u0644 \u0647\u062A \u0648\u0622\u0644\u064A\u0629 \u0627\u0644\u062A\u0648\u062B\u064A\u0642.",
    ownerPartnerId: "partner-owner-mariam",
    heroImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=84&w=1600"
  }),
  property("property-north-cove", "sourced", {
    name: "North Cove",
    nameAr: "\u062E\u0644\u064A\u062C \u0627\u0644\u0634\u0645\u0627\u0644",
    location: "Sidi Heneish",
    locationAr: "\u0633\u064A\u062F\u064A \u062D\u0646\u064A\u0634",
    summary: "Scout lead with listing-level evidence only; no public claims.",
    summaryAr: "\u062A\u0631\u0634\u064A\u062D \u0645\u0646 \u0627\u0644\u0643\u0634\u0627\u0641 \u0628\u0623\u062F\u0644\u0629 \u0625\u0639\u0644\u0627\u0646 \u0641\u0642\u0637 \u062F\u0648\u0646 \u0623\u064A \u0627\u062F\u0639\u0627\u0621\u0627\u062A \u0639\u0627\u0645\u0629.",
    scoutPartnerId: "partner-scout-omar",
    heroImage: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=84&w=1600"
  }),
  property("property-palm-pavilion", "paused", {
    name: "Palm Pavilion",
    nameAr: "\u062C\u0646\u0627\u062D \u0627\u0644\u0646\u062E\u064A\u0644",
    location: "Soma Bay",
    locationAr: "\u0633\u0648\u0645\u0627 \u0628\u0627\u064A",
    summary: "Previously Live; paused after a maintenance trigger and awaiting reassessment.",
    summaryAr: "\u0643\u0627\u0646 \u0645\u062A\u0627\u062D\u0627\u064B \u062B\u0645 \u062A\u0648\u0642\u0641 \u0628\u0639\u062F \u0645\u0644\u0627\u062D\u0638\u0629 \u0635\u064A\u0627\u0646\u0629 \u0648\u064A\u0646\u062A\u0638\u0631 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645.",
    ownerPartnerId: "partner-owner-youssef",
    operatorPartnerId: "partner-operator-kareem",
    assessorPartnerId: "partner-assessor-dina",
    calendarAuthority: "little_hut",
    nightlyFloorEgp: 7800,
    payoutReady: true,
    heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=84&w=1600"
  }),
  property("property-stone-courtyard", "declined", {
    name: "Stone Courtyard",
    nameAr: "\u0627\u0644\u0641\u0646\u0627\u0621 \u0627\u0644\u062D\u062C\u0631\u064A",
    location: "Ain Sokhna",
    locationAr: "\u0627\u0644\u0639\u064A\u0646 \u0627\u0644\u0633\u062E\u0646\u0629",
    summary: "Owner declined the activation mandate after assessment.",
    summaryAr: "\u0631\u0641\u0636 \u0627\u0644\u0645\u0627\u0644\u0643 \u062A\u0641\u0648\u064A\u0636 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0628\u0639\u062F \u0627\u0644\u062A\u0642\u064A\u064A\u0645.",
    ownerPartnerId: "partner-owner-nadia",
    assessorPartnerId: "partner-assessor-dina",
    heroImage: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=84&w=1600"
  })
];
var trustLabels = [
  ["truth", "Property truth", "\u062D\u0642\u064A\u0642\u0629 \u0627\u0644\u0639\u0642\u0627\u0631"],
  ["readiness", "Operational readiness", "\u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629 \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A\u0629"],
  ["privacy", "Guest privacy", "\u062E\u0635\u0648\u0635\u064A\u0629 \u0627\u0644\u0636\u064A\u0641"],
  ["comfort", "Comfort consistency", "\u062B\u0628\u0627\u062A \u0627\u0644\u0631\u0627\u062D\u0629"],
  ["arrival", "Arrival clarity", "\u0648\u0636\u0648\u062D \u0627\u0644\u0648\u0635\u0648\u0644"],
  ["moment", "Moment integrity", "\u0646\u0632\u0627\u0647\u0629 \u0627\u0644\u0644\u062D\u0638\u0629"]
];
var shieldLabels = [
  ["fire", "Fire and gas", "\u0627\u0644\u062D\u0631\u064A\u0642 \u0648\u0627\u0644\u063A\u0627\u0632"],
  ["water", "Water safety", "\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u064A\u0627\u0647"],
  ["access", "Secure access", "\u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0622\u0645\u0646"],
  ["electrical", "Electrical safety", "\u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629"],
  ["child", "Child risks", "\u0645\u062E\u0627\u0637\u0631 \u0627\u0644\u0623\u0637\u0641\u0627\u0644"],
  ["emergency", "Emergency readiness", "\u062C\u0627\u0647\u0632\u064A\u0629 \u0627\u0644\u0637\u0648\u0627\u0631\u0626"]
];
var assessment = (id, propertyId, assessorPartnerId, result, moments, status = "passed") => ({
  ...record(id),
  propertyId,
  assessorPartnerId,
  independenceConfirmed: true,
  scheduledFor: result === "scheduled" ? "2026-09-06T08:30:00.000Z" : void 0,
  completedAt: result === "scheduled" ? void 0 : "2026-08-26T14:00:00.000Z",
  result,
  trustGates: trustLabels.map(([key, label, labelAr]) => ({ key, label, labelAr, status })),
  shieldGates: shieldLabels.map(([key, label, labelAr]) => ({ key, label, labelAr, status })),
  provenMomentKeys: moments,
  evidenceCount: result === "scheduled" ? 0 : 18,
  recommendation: result === "passed" ? "Proceed to owner decision." : result === "scheduled" ? "Independent visit scheduled." : "Do not activate until the blocking result is resolved.",
  recommendationAr: result === "passed" ? "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0642\u0631\u0627\u0631 \u0627\u0644\u0645\u0627\u0644\u0643." : result === "scheduled" ? "\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0645\u0648\u0639\u062F \u0627\u0644\u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629." : "\u0644\u0627 \u064A\u062A\u0645 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u062D\u062A\u0649 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0645\u0627\u0646\u0639\u0629."
});
var DEMO_ASSESSMENTS = [
  assessment("assessment-azure-haven", "property-azure-haven", "partner-assessor-dina", "passed", ["slow_morning", "long_table"]),
  assessment("assessment-seaward", "property-seaward-library", "partner-assessor-dina", "passed", ["slow_morning", "silent_reading"]),
  assessment("assessment-casa", "property-casa-bianca", "partner-assessor-hassan", "passed", ["long_table", "afternoon_drift"]),
  assessment("assessment-dune", "property-dune-house", "partner-assessor-hassan", "passed", ["slow_morning", "fire_conversation"]),
  assessment("assessment-lagoon", "property-lagoon-pavilion", "partner-assessor-dina", "passed", ["night_swim", "afternoon_drift"]),
  assessment("assessment-olive", "property-olive-courtyard", "partner-assessor-hassan", "scheduled", [], "pending"),
  assessment("assessment-palm", "property-palm-pavilion", "partner-assessor-dina", "conditions", [], "failed")
];
var decision = (id, propertyId, ownerPartnerId, value, floor) => ({
  ...record(id),
  propertyId,
  ownerPartnerId,
  decision: value,
  decidedAt: "2026-08-28T10:00:00.000Z",
  nightlyFloorEgp: floor,
  payoutReady: value === "go",
  conditions: [],
  note: value === "go" ? "Proceed under the recorded floor and operating mandate." : value === "defer" ? "Pause until corrective work is reassessed." : "Do not proceed.",
  noteAr: value === "go" ? "\u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0648\u0641\u0642 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0648\u0627\u0644\u062A\u0641\u0648\u064A\u0636 \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A \u0627\u0644\u0645\u0633\u062C\u0644." : value === "defer" ? "\u0627\u0644\u062A\u0648\u0642\u0641 \u062D\u062A\u0649 \u0625\u0639\u0627\u062F\u0629 \u062A\u0642\u064A\u064A\u0645 \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629." : "\u0639\u062F\u0645 \u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631."
});
var DEMO_OWNER_DECISIONS = [
  decision("decision-azure", "property-azure-haven", "partner-owner-mariam", "go", 6e3),
  decision("decision-seaward", "property-seaward-library", "partner-owner-mariam", "go", 5200),
  decision("decision-casa", "property-casa-bianca", "partner-owner-nadia", "go", 4800),
  decision("decision-dune", "property-dune-house", "partner-owner-youssef", "go", 9e3),
  decision("decision-palm", "property-palm-pavilion", "partner-owner-youssef", "defer", 7800),
  decision("decision-stone", "property-stone-courtyard", "partner-owner-nadia", "decline")
];
var stageProperty = {
  received: "property-seaward-library",
  qualified: "property-casa-bianca",
  availability_checked: "property-seaward-library",
  quoted: "property-casa-bianca",
  hold: "property-seaward-library",
  payment_pending: "property-casa-bianca",
  payment_received: "property-seaward-library",
  community_approval_pending: "property-azure-haven",
  community_approved: "property-azure-haven",
  confirmed: "property-casa-bianca",
  completed: "property-seaward-library",
  declined: "property-casa-bianca",
  expired: "property-azure-haven",
  cancelled: "property-seaward-library"
};
var enquiry = (index, stage) => {
  const propertyId = stageProperty[stage];
  const isAzure = propertyId === "property-azure-haven";
  const floor = isAzure ? 6e3 : propertyId === "property-casa-bianca" ? 4800 : 5200;
  const nights = 3;
  const hasQuote = !["received", "qualified", "availability_checked"].includes(stage);
  const hasHold = ["hold", "payment_pending", "payment_received", "community_approval_pending", "community_approved", "confirmed", "expired"].includes(stage);
  const hasPayment = ["payment_received", "community_approval_pending", "community_approved", "confirmed", "completed"].includes(stage);
  const activeHold = stage !== "expired";
  const approvalStatus = !isAzure ? "not_required" : stage === "community_approval_pending" ? "pending" : stage === "community_approved" || stage === "confirmed" ? "approved" : "not_submitted";
  return {
    ...record(`enquiry-${String(index).padStart(2, "0")}-${stage}`),
    propertyId,
    guestName: ["Mona A.", "Ahmed R.", "Nour K.", "Yassin T.", "Farah M."][index % 5],
    guestPhoneMasked: `+20 \u2022\u2022\u2022 \u2022\u2022 ${1200 + index}`,
    checkIn: "2026-09-12",
    checkOut: "2026-09-15",
    adults: index % 3 + 2,
    children: index % 2,
    requestedMoment: ["slow_morning", "long_table", "silent_reading"][index % 3],
    stage,
    source: ["direct", "broker", "instagram", "returning_guest"][index % 4],
    quote: hasQuote ? { nightlyRateEgp: floor + 500, nights, accommodationEgp: (floor + 500) * nights, feesEgp: isAzure ? 1500 : 600, totalEgp: (floor + 500) * nights + (isAzure ? 1500 : 600), issuedAt: "2026-08-31T12:00:00.000Z" } : void 0,
    hold: hasHold ? { expiresAt: activeHold ? "2026-09-04T14:00:00.000Z" : "2026-08-31T14:00:00.000Z", active: activeHold } : void 0,
    payment: hasPayment ? { amountEgp: (floor + 500) * nights + (isAzure ? 1500 : 600), receivedAt: "2026-09-01T10:30:00.000Z", reference: `DEMO-PAY-${1200 + index}` } : void 0,
    communityApproval: { required: isAzure, status: approvalStatus, authorityPartnerId: isAzure ? "partner-community-azha" : void 0, evidenceReference: approvalStatus === "approved" ? `DEMO-AZHA-${8600 + index}` : void 0 },
    timeline: [{ stage, at: AS_OF, byPartnerId: "partner-operator-lina", note: `Synthetic demo record currently at ${stage}.` }]
  };
};
var enquiryStages = ["received", "qualified", "availability_checked", "quoted", "hold", "payment_pending", "payment_received", "community_approval_pending", "community_approved", "confirmed", "completed", "declined", "expired"];
var DEMO_ENQUIRIES = enquiryStages.map((stage, index) => enquiry(index + 1, stage));

// src/lib/automation-gateway.ts
var AutomationIngressError = class extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
    this.name = "AutomationIngressError";
  }
};
var allowedTypes = /* @__PURE__ */ new Set([
  "enquiry.created",
  "enquiry.stage_changed",
  "community_approval.recorded",
  "scout_lead.created"
]);
var allowedTransitions = {
  received: ["qualified"],
  qualified: ["availability_checked"],
  availability_checked: ["quoted"],
  quoted: ["hold"],
  hold: ["payment_pending", "expired"],
  payment_pending: ["payment_received"],
  community_approved: ["confirmed"],
  confirmed: ["completed"]
};
var momentKeys = /* @__PURE__ */ new Set([
  "slow_morning",
  "long_table",
  "afternoon_drift",
  "night_swim",
  "fire_conversation",
  "silent_reading"
]);
var isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
var requireString = (value, field, max = 200) => {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) {
    throw new AutomationIngressError(`invalid_${field}`);
  }
  return value.trim();
};
var requireInteger = (value, field, min, max) => {
  if (!Number.isInteger(value) || Number(value) < min || Number(value) > max) {
    throw new AutomationIngressError(`invalid_${field}`);
  }
  return Number(value);
};
var requireDemoIngress = (input) => {
  if (!isRecord(input) || input.dataMode !== "demo" || typeof input.type !== "string" || !allowedTypes.has(input.type) || !isRecord(input.payload)) {
    throw new AutomationIngressError("invalid_or_live_event");
  }
  return input;
};
function createDemoAutomationGuard() {
  const properties = new Map(DEMO_PROPERTIES.map((property2) => [property2.id, property2]));
  const enquiries = new Map(
    DEMO_ENQUIRIES.map((enquiry2) => [enquiry2.id, { propertyId: enquiry2.propertyId, stage: enquiry2.stage }])
  );
  const activeScoutIds = new Set(
    DEMO_PARTNERS.filter((partner) => partner.role === "scout" && partner.status === "active").map((partner) => partner.id)
  );
  const dynamicPropertyIds = /* @__PURE__ */ new Set();
  const normalizeEvent = (type, payload, now) => ({
    version: 1,
    id: `evt_${crypto.randomUUID()}`,
    type,
    source: "lhl-web",
    dataMode: "demo",
    synthetic: true,
    occurredAt: now.toISOString(),
    payload
  });
  return {
    prepare(input, now = /* @__PURE__ */ new Date()) {
      const ingress = requireDemoIngress(input);
      const payload = ingress.payload;
      if (ingress.type === "enquiry.created") {
        const enquiryId = requireString(payload.enquiryId, "enquiry_id", 100);
        const propertyId2 = requireString(payload.propertyId, "property_id", 100);
        const property2 = properties.get(propertyId2);
        if (!property2 || property2.supplyStage !== "live" || !property2.publiclyVisible || !property2.sealIssued) {
          throw new AutomationIngressError("untrusted_demo_property", 403);
        }
        if (!/^demo-enquiry-\d+$/.test(enquiryId) || enquiries.has(enquiryId)) {
          throw new AutomationIngressError("invalid_or_duplicate_enquiry_id");
        }
        const guestName = requireString(payload.guestName, "guest_name", 120);
        const guestPhoneMasked = requireString(payload.guestPhoneMasked, "guest_phone_masked", 64);
        const checkIn = requireString(payload.checkIn, "check_in", 10);
        const checkOut = requireString(payload.checkOut, "check_out", 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || /* @__PURE__ */ new Date(`${checkIn}T00:00:00Z`) >= /* @__PURE__ */ new Date(`${checkOut}T00:00:00Z`)) {
          throw new AutomationIngressError("invalid_stay_dates");
        }
        const adults = requireInteger(payload.adults, "adults", 1, 20);
        const children = requireInteger(payload.children, "children", 0, 20);
        const requestedMoment = requireString(payload.requestedMoment, "requested_moment", 64);
        if (!momentKeys.has(requestedMoment)) throw new AutomationIngressError("invalid_requested_moment");
        const trustedPayload2 = { enquiryId, propertyId: propertyId2, guestName, guestPhoneMasked, checkIn, checkOut, adults, children, requestedMoment };
        return {
          event: normalizeEvent(ingress.type, trustedPayload2, now),
          commit: () => enquiries.set(enquiryId, { propertyId: propertyId2, stage: "received" })
        };
      }
      if (ingress.type === "enquiry.stage_changed") {
        const enquiryId = requireString(payload.enquiryId, "enquiry_id", 100);
        const propertyId2 = requireString(payload.propertyId, "property_id", 100);
        const fromStage = requireString(payload.fromStage, "from_stage", 64);
        const toStage = requireString(payload.toStage, "to_stage", 64);
        const current = enquiries.get(enquiryId);
        if (!current || current.propertyId !== propertyId2 || current.stage !== fromStage) {
          throw new AutomationIngressError("untrusted_enquiry_state", 409);
        }
        let allowed = allowedTransitions[fromStage] || [];
        if (fromStage === "payment_received") {
          const property2 = properties.get(propertyId2);
          allowed = [property2?.communityApprovalRequired ? "community_approval_pending" : "confirmed"];
        }
        if (!allowed.includes(toStage)) throw new AutomationIngressError("invalid_enquiry_transition", 409);
        const trustedPayload2 = { enquiryId, propertyId: propertyId2, fromStage, toStage };
        return {
          event: normalizeEvent(ingress.type, trustedPayload2, now),
          commit: () => enquiries.set(enquiryId, { propertyId: propertyId2, stage: toStage })
        };
      }
      if (ingress.type === "community_approval.recorded") {
        const enquiryId = requireString(payload.enquiryId, "enquiry_id", 100);
        const propertyId2 = requireString(payload.propertyId, "property_id", 100);
        const authorityPartnerId = requireString(payload.authorityPartnerId, "authority_partner_id", 100);
        const evidenceReference = requireString(payload.evidenceReference, "evidence_reference", 120);
        const current = enquiries.get(enquiryId);
        const property2 = properties.get(propertyId2);
        if (!current || current.propertyId !== propertyId2 || current.stage !== "community_approval_pending") {
          throw new AutomationIngressError("untrusted_enquiry_state", 409);
        }
        if (!property2?.communityApprovalRequired || property2.communityAuthorityPartnerId !== authorityPartnerId) {
          throw new AutomationIngressError("untrusted_community_authority", 403);
        }
        if (!/^DEMO-(COMMUNITY|AZHA)-[A-Za-z0-9_-]+$/.test(evidenceReference)) {
          throw new AutomationIngressError("invalid_community_evidence");
        }
        const trustedPayload2 = { enquiryId, propertyId: propertyId2, authorityPartnerId, evidenceReference };
        return {
          event: normalizeEvent(ingress.type, trustedPayload2, now),
          commit: () => enquiries.set(enquiryId, { propertyId: propertyId2, stage: "community_approved" })
        };
      }
      const propertyId = requireString(payload.propertyId, "property_id", 100);
      const scoutPartnerId = requireString(payload.scoutPartnerId, "scout_partner_id", 100);
      const name = requireString(payload.name, "name", 120);
      const location = requireString(payload.location, "location", 120);
      if (!/^demo-property-\d+$/.test(propertyId) || properties.has(propertyId) || dynamicPropertyIds.has(propertyId)) {
        throw new AutomationIngressError("invalid_or_duplicate_property_id");
      }
      if (!activeScoutIds.has(scoutPartnerId)) throw new AutomationIngressError("untrusted_scout", 403);
      const trustedPayload = { propertyId, scoutPartnerId, name, location };
      return {
        event: normalizeEvent("scout_lead.created", trustedPayload, now),
        commit: () => dynamicPropertyIds.add(propertyId)
      };
    }
  };
}
function createFixedWindowRateLimiter(limit = 30, windowMs = 6e4) {
  const buckets = /* @__PURE__ */ new Map();
  return {
    allow(key, now = Date.now()) {
      const current = buckets.get(key);
      if (!current || now >= current.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (current.count >= limit) return false;
      current.count += 1;
      if (buckets.size > 1e4) {
        for (const [bucketKey, bucket] of buckets) {
          if (now >= bucket.resetAt) buckets.delete(bucketKey);
        }
      }
      return true;
    }
  };
}

// src/server/live-outbox.ts
import crypto4 from "node:crypto";

// src/server/firestore-rest.ts
import crypto3 from "node:crypto";

// src/server/live-outbox-record.ts
import crypto2 from "node:crypto";
var aggregateType = {
  properties: "property",
  assessments: "assessment",
  ownerDecisions: "owner_decision",
  enquiries: "enquiry"
};
function isBusinessCollection(collection) {
  return ["properties", "assessments", "ownerDecisions", "enquiries"].includes(collection);
}
var nestedField = (value, field) => typeof value === "object" && value && !Array.isArray(value) ? value[field] : void 0;
var summarize = (collection, data) => {
  if (collection === "properties") {
    return {
      supplyStage: data.supplyStage,
      publiclyVisible: data.publiclyVisible === true,
      sealIssued: data.sealIssued === true,
      communityApprovalRequired: data.communityApprovalRequired === true,
      inventoryBaselineReady: Boolean(data.inventoryBaseline)
    };
  }
  if (collection === "assessments") {
    return {
      propertyId: data.propertyId,
      result: data.result,
      evidenceCount: data.evidenceCount
    };
  }
  if (collection === "ownerDecisions") {
    return {
      propertyId: data.propertyId,
      decision: data.decision,
      payoutReady: data.payoutReady === true
    };
  }
  const proofStay = typeof data.proofStay === "object" && data.proofStay && !Array.isArray(data.proofStay) ? data.proofStay : void 0;
  return {
    propertyId: data.propertyId,
    stage: data.stage,
    communityApprovalStatus: nestedField(data.communityApproval, "status"),
    readinessStatus: nestedField(data.readinessCheck, "status"),
    preStayCaptured: Boolean(proofStay?.preStay),
    postStayCaptured: Boolean(proofStay?.postStay),
    proofStayStatus: nestedField(proofStay?.result, "status")
  };
};
function deriveLiveOutboxRecord(operation, collection, id, data) {
  if (data.dataMode !== "live" || data.synthetic !== false) return null;
  const occurredAt = typeof data.updatedAt === "string" ? data.updatedAt : typeof data.createdAt === "string" ? data.createdAt : null;
  if (!occurredAt) return null;
  const payload = summarize(collection, data);
  const fingerprint = JSON.stringify(payload);
  const eventId = `evt_${crypto2.createHash("sha256").update(`${operation}
${collection}
${id}
${occurredAt}
${fingerprint}`).digest("hex")}`;
  return {
    id: eventId,
    data: {
      id: eventId,
      dataMode: "live",
      synthetic: false,
      type: `record.${operation}`,
      aggregateType: aggregateType[collection],
      aggregateId: id,
      occurredAt,
      payload: {
        collection,
        operation,
        ...payload
      },
      status: "pending",
      attempts: 0
    }
  };
}

// src/server/firestore-rest.ts
var cachedToken = null;
var env = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
};
var base64url = (value) => Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
async function serviceAccountToken() {
  const now = Math.floor(Date.now() / 1e3);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;
  const clientEmail = env("FIREBASE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = env("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    sub: clientEmail,
    aud: "https://oauth2.googleapis.com/token",
    scope: "https://www.googleapis.com/auth/datastore",
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${payload}`;
  const signature = crypto3.sign("RSA-SHA256", Buffer.from(unsigned), privateKey);
  const assertion = `${unsigned}.${base64url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    signal: AbortSignal.timeout(8e3)
  });
  if (!response.ok) throw new Error(`Firestore service authentication failed: ${response.status}`);
  const result = await response.json();
  if (!result.access_token) throw new Error("Firestore service authentication returned no access token.");
  cachedToken = { value: result.access_token, expiresAt: now + (result.expires_in || 3600) };
  return cachedToken.value;
}
function encodeValue(value) {
  if (value === null || value === void 0) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Firestore refuses non-finite numbers.");
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === "object") return { mapValue: { fields: encodeFields(value) } };
  throw new Error(`Unsupported Firestore value type: ${typeof value}`);
}
function encodeFields(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== void 0).map(([key, fieldValue]) => [key, encodeValue(fieldValue)])
  );
}
function decodeValue(value) {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    const arrayValue = value.arrayValue;
    return (arrayValue.values || []).map(decodeValue);
  }
  if ("mapValue" in value) {
    const mapValue = value.mapValue;
    return decodeFields(mapValue.fields || {});
  }
  throw new Error("Unsupported Firestore response value.");
}
function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}
var documentBase = () => {
  const projectId = env("FIREBASE_PROJECT_ID");
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
};
var documentName = (collection, id) => `${documentBase()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`;
async function firestoreFetch(url, init = {}) {
  const token = await serviceAccountToken();
  return fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers || {}
    },
    signal: init.signal || AbortSignal.timeout(8e3)
  });
}
var firestoreWrite = (write) => ({
  update: {
    name: documentName(write.collection, write.id),
    fields: encodeFields(write.data)
  },
  currentDocument: write.mode === "create" ? { exists: false } : { updateTime: write.expectedUpdateTime }
});
var withDerivedOutbox = (writes) => {
  const augmented = [];
  for (const write of writes) {
    augmented.push(write);
    if (!isBusinessCollection(write.collection)) continue;
    const derived = deriveLiveOutboxRecord(write.mode === "create" ? "created" : "replaced", write.collection, write.id, write.data);
    if (!derived) continue;
    augmented.push({
      mode: "create",
      collection: "liveOutbox",
      id: derived.id,
      data: derived.data
    });
  }
  return augmented;
};
async function commitRaw(writes) {
  if (writes.length === 0) return {};
  if (writes.length > 20) throw new Error("Firestore atomic commit is limited to 20 writes in LHL.");
  const response = await firestoreFetch(`${documentBase()}:commit`, {
    method: "POST",
    body: JSON.stringify({ writes: writes.map(firestoreWrite) })
  });
  if (response.status === 409 || response.status === 412) throw new Error("record_changed_concurrently");
  if (!response.ok) throw new Error(`Firestore atomic commit failed: ${response.status}`);
  return response.json();
}
async function getDocument(collection, id) {
  const response = await firestoreFetch(documentName(collection, id));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed: ${response.status}`);
  const document = await response.json();
  return { data: decodeFields(document.fields || {}), updateTime: document.updateTime || "" };
}
async function listDocuments(collection) {
  const documents = [];
  let pageToken = "";
  do {
    const url = new URL(`${documentBase()}/${encodeURIComponent(collection)}`);
    url.searchParams.set("pageSize", "200");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const response = await firestoreFetch(url.toString());
    if (!response.ok) throw new Error(`Firestore list failed: ${response.status}`);
    const result = await response.json();
    documents.push(...(result.documents || []).map((document) => ({
      data: decodeFields(document.fields || {}),
      updateTime: document.updateTime || ""
    })));
    pageToken = result.nextPageToken || "";
  } while (pageToken);
  return documents;
}
async function createDocument(collection, id, data) {
  if (isBusinessCollection(collection)) {
    const writes = withDerivedOutbox([{ mode: "create", collection, id, data }]);
    try {
      const result = await commitRaw(writes);
      return { data, updateTime: result.writeResults?.[0]?.updateTime || result.commitTime || "" };
    } catch (error) {
      if (error instanceof Error && error.message === "record_changed_concurrently") throw new Error("record_already_exists");
      throw error;
    }
  }
  const url = new URL(documentName(collection, id));
  url.searchParams.set("currentDocument.exists", "false");
  const response = await firestoreFetch(url.toString(), {
    method: "PATCH",
    body: JSON.stringify({ fields: encodeFields(data) })
  });
  if (response.status === 409 || response.status === 412) throw new Error("record_already_exists");
  if (!response.ok) throw new Error(`Firestore create failed: ${response.status}`);
  const document = await response.json();
  return { data: decodeFields(document.fields || {}), updateTime: document.updateTime || "" };
}
async function replaceDocument(collection, id, data, expectedUpdateTime) {
  if (isBusinessCollection(collection) && expectedUpdateTime) {
    const result = await commitRaw(withDerivedOutbox([{
      mode: "replace",
      collection,
      id,
      data,
      expectedUpdateTime
    }]));
    return { data, updateTime: result.writeResults?.[0]?.updateTime || result.commitTime || "" };
  }
  const url = new URL(documentName(collection, id));
  if (expectedUpdateTime) url.searchParams.set("currentDocument.updateTime", expectedUpdateTime);
  const response = await firestoreFetch(url.toString(), {
    method: "PATCH",
    body: JSON.stringify({ fields: encodeFields(data) })
  });
  if (response.status === 409 || response.status === 412) throw new Error("record_changed_concurrently");
  if (!response.ok) throw new Error(`Firestore update failed: ${response.status}`);
  const document = await response.json();
  return { data: decodeFields(document.fields || {}), updateTime: document.updateTime || "" };
}
async function commitDocuments(writes) {
  await commitRaw(withDerivedOutbox(writes));
}

// src/server/live-outbox.ts
var COLLECTION = "liveOutbox";
var webhookConfig = () => {
  const rawUrl = process.env.ACTIVEPIECES_WEBHOOK_URL?.trim();
  const secret = process.env.ACTIVEPIECES_SHARED_SECRET?.trim();
  if (!rawUrl || !secret) throw new Error("live_automation_not_configured");
  const url = new URL(rawUrl);
  const localDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(localDev && url.protocol === "http:")) throw new Error("live_webhook_must_use_https");
  return { url, secret };
};
var retryDelayMs = (attempts) => Math.min(60 * 6e4, 3e4 * 2 ** Math.min(attempts, 7));
async function dispatchLiveOutboxEvent(id, now = /* @__PURE__ */ new Date()) {
  const stored = await getDocument(COLLECTION, id);
  if (!stored) throw new Error("live_outbox_event_not_found");
  const event = stored.data;
  if (event.status === "delivered") return "already_delivered";
  if (event.nextAttemptAt && new Date(event.nextAttemptAt).getTime() > now.getTime()) return "retry_scheduled";
  const { url, secret } = webhookConfig();
  const timestamp = now.getTime().toString();
  const body = JSON.stringify({
    version: 1,
    id: event.id,
    type: event.type,
    source: "lhl-server",
    dataMode: "live",
    synthetic: false,
    occurredAt: event.occurredAt,
    aggregateType: event.aggregateType,
    aggregateId: event.aggregateId,
    payload: event.payload
  });
  const signature = crypto4.createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lhl-event-id": event.id,
        "x-lhl-idempotency-key": event.id,
        "x-lhl-timestamp": timestamp,
        "x-lhl-signature": `sha256=${signature}`,
        "x-lhl-simulation": "false"
      },
      body,
      signal: AbortSignal.timeout(8e3)
    });
    if (!response.ok) throw new Error(`upstream_${response.status}`);
    const deliveredAt = now.toISOString();
    const delivered = {
      ...event,
      status: "delivered",
      attempts: event.attempts + 1,
      deliveredAt,
      nextAttemptAt: void 0,
      lastError: void 0
    };
    await replaceDocument(COLLECTION, id, delivered, stored.updateTime);
    return "delivered";
  } catch (error) {
    const attempts = event.attempts + 1;
    const retry = {
      ...event,
      attempts,
      nextAttemptAt: new Date(now.getTime() + retryDelayMs(attempts)).toISOString(),
      lastError: error instanceof Error ? error.message.slice(0, 180) : "delivery_failed"
    };
    await replaceDocument(COLLECTION, id, retry, stored.updateTime).catch(() => void 0);
    return "retry_scheduled";
  }
}
async function drainLiveOutbox(limit = 20, now = /* @__PURE__ */ new Date()) {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const events = (await listDocuments(COLLECTION)).map((item) => item.data).filter((event) => event.dataMode === "live" && !event.synthetic && event.status === "pending").filter((event) => !event.nextAttemptAt || new Date(event.nextAttemptAt).getTime() <= now.getTime()).sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).slice(0, safeLimit);
  let delivered = 0;
  let retryScheduled = 0;
  for (const event of events) {
    const result = await dispatchLiveOutboxEvent(event.id, now);
    if (result === "delivered" || result === "already_delivered") delivered += 1;
    else retryScheduled += 1;
  }
  return { checked: events.length, delivered, retryScheduled };
}

// src/server/live-assurance.ts
import crypto7 from "node:crypto";

// src/server/live-store.ts
import crypto6 from "node:crypto";

// src/lib/lh-core.js
var MOMENTS = Object.freeze({
  SLOW_MORNING: "slow_morning",
  LONG_TABLE: "long_table",
  AFTERNOON_DRIFT: "afternoon_drift",
  NIGHT_SWIM: "night_swim",
  FIRE_CONVERSATION: "fire_conversation",
  SILENT_READING: "silent_reading"
});
var MOMENT_KEYS = Object.freeze(Object.values(MOMENTS));
var TRUST_GATE_KEYS = Object.freeze([
  "truth",
  "readiness",
  "privacy",
  "comfort",
  "arrival",
  "moment"
]);
var SHIELD_GATE_KEYS = Object.freeze([
  "fire",
  "water",
  "access",
  "electrical",
  "child",
  "emergency"
]);
var SUPPLY_STAGES = Object.freeze([
  "sourced",
  "owner_engaged",
  "assessment_scheduled",
  "decision_pending",
  "activation_ready",
  "live",
  "paused",
  "declined"
]);
var BOOKING_SPINE = Object.freeze([
  "received",
  "qualified",
  "availability_checked",
  "quoted",
  "hold",
  "payment_pending",
  "payment_received",
  "community_approval_pending",
  "community_approved",
  "confirmed",
  "completed"
]);
var TERMINAL_ENQUIRY_STAGES = Object.freeze(["declined", "expired", "cancelled"]);
function evaluateRateFloor(property2, nightlyRateEgp) {
  if (!property2 || typeof property2.nightlyFloorEgp !== "number" || property2.nightlyFloorEgp <= 0) {
    return { allowed: false, reason: "No valid owner floor; quoting and payment are blocked." };
  }
  if (!Number.isFinite(nightlyRateEgp) || nightlyRateEgp < property2.nightlyFloorEgp) {
    return { allowed: false, reason: "Quoted nightly accommodation rate is below the owner floor." };
  }
  return { allowed: true, reason: "Quote respects the owner floor." };
}
function evaluateStayDates(checkIn, checkOut) {
  const validIsoDay = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };
  if (!validIsoDay(checkIn) || !validIsoDay(checkOut)) {
    return { allowed: false, nights: 0, reason: "Check-in and check-out must be valid dates." };
  }
  const checkInMs = (/* @__PURE__ */ new Date(`${checkIn}T00:00:00.000Z`)).getTime();
  const checkOutMs = (/* @__PURE__ */ new Date(`${checkOut}T00:00:00.000Z`)).getTime();
  if (checkOutMs <= checkInMs) {
    return { allowed: false, nights: 0, reason: "Check-out must be after check-in." };
  }
  return {
    allowed: true,
    nights: (checkOutMs - checkInMs) / 864e5,
    reason: "Stay dates are valid."
  };
}
function isHoldActive(hold, at = /* @__PURE__ */ new Date()) {
  if (!hold?.active || !hold.expiresAt) return false;
  return new Date(hold.expiresAt).getTime() > new Date(at).getTime();
}
function resolveBookingMode(property2) {
  if (property2.calendarAuthority !== "little_hut") {
    return { mode: "request", instantAllowed: false, reason: "External or unknown calendar authority requires request mode." };
  }
  if (property2.communityApprovalRequired) {
    return { mode: "request", instantAllowed: false, reason: "Community approval is a hard gate and disables instant confirmation." };
  }
  return property2.bookingMode === "instant" ? { mode: "instant", instantAllowed: true, reason: "Little Hut holds the calendar and no external approval gate applies." } : { mode: "request", instantAllowed: false, reason: "Owner chose request mode." };
}
var gateSetPasses = (gates, expectedKeys) => {
  if (!Array.isArray(gates) || gates.length !== expectedKeys.length) return false;
  const byKey = new Map(gates.map((gate) => [gate?.key, gate]));
  if (byKey.size !== expectedKeys.length) return false;
  return expectedKeys.every((key) => byKey.get(key)?.status === "passed");
};
function evaluateAssessment(assessment2) {
  if (!assessment2?.independenceConfirmed) return { passed: false, reason: "Independent assessor confirmation is required." };
  if (!gateSetPasses(assessment2.trustGates, TRUST_GATE_KEYS)) {
    return { passed: false, reason: "All six canonical TRUST gates must be present and passed." };
  }
  if (!gateSetPasses(assessment2.shieldGates, SHIELD_GATE_KEYS)) {
    return { passed: false, reason: "All six canonical SHIELD gates must be present and passed." };
  }
  if ((assessment2.provenMomentKeys?.length || 0) < 2) return { passed: false, reason: "At least two canonical Moments must be proven." };
  return { passed: true, reason: "Independent assessment gate passed." };
}
function evaluateGoLive(property2, assessment2, ownerDecision) {
  const assessmentCheck = evaluateAssessment(assessment2);
  if (!assessmentCheck.passed) return { allowed: false, reason: assessmentCheck.reason };
  if (!ownerDecision || ownerDecision.decision !== "go" || !ownerDecision.decidedAt) {
    return { allowed: false, reason: "Explicit named owner go decision is required." };
  }
  if (ownerDecision.conditions?.some((item) => item.launchBlocking && !item.resolved)) {
    return { allowed: false, reason: "An unresolved launch-blocking owner condition remains." };
  }
  if (!ownerDecision.payoutReady || !ownerDecision.nightlyFloorEgp || ownerDecision.nightlyFloorEgp <= 0) {
    return { allowed: false, reason: "Owner floor and payout readiness are required." };
  }
  if (!property2?.ownerPartnerId || !property2?.assessorPartnerId || !property2?.operatorPartnerId) {
    return { allowed: false, reason: "Named owner, assessor, and operator assignments are required." };
  }
  if (assessment2.assessorPartnerId && assessment2.assessorPartnerId !== property2.assessorPartnerId) {
    return { allowed: false, reason: "Assessment authority does not match the assigned assessor." };
  }
  if (ownerDecision.ownerPartnerId && ownerDecision.ownerPartnerId !== property2.ownerPartnerId) {
    return { allowed: false, reason: "Owner decision authority does not match the assigned owner." };
  }
  if (property2.communityApprovalRequired && !property2.communityAuthorityPartnerId) {
    return { allowed: false, reason: "A named community authority is required by this policy." };
  }
  if (property2.calendarAuthority === "unknown") return { allowed: false, reason: "Calendar authority must be explicit." };
  if (!["request", "instant"].includes(property2.bookingMode)) return { allowed: false, reason: "Booking mode must be explicit." };
  if (!Number.isInteger(property2.maxGuests) || property2.maxGuests < 1) return { allowed: false, reason: "A positive guest capacity is required." };
  if (!Number.isInteger(property2.bedroomCount) || property2.bedroomCount < 0) return { allowed: false, reason: "Bedroom count must be explicit." };
  if (typeof property2.heroImage !== "string" || property2.heroImage.trim().length === 0) return { allowed: false, reason: "A public hero image is required." };
  if ((property2.provenMoments?.length || 0) < 2) return { allowed: false, reason: "At least two proven property Moments are required." };
  if (!property2.activationChecklistComplete) return { allowed: false, reason: "Activation checklist is incomplete." };
  return { allowed: true, reason: "All Live gates satisfied." };
}
function canConfirmStay(property2, enquiry2, at = /* @__PURE__ */ new Date()) {
  if (property2.supplyStage !== "live") return { allowed: false, reason: "Property is not Live." };
  if (!enquiry2.payment?.receivedAt) return { allowed: false, reason: "Payment is not recorded." };
  if (!isHoldActive(enquiry2.hold, at)) return { allowed: false, reason: "Hold is missing or expired." };
  if (property2.communityApprovalRequired && enquiry2.communityApproval?.status !== "approved") {
    return { allowed: false, reason: "Community approval is required before confirmation." };
  }
  return { allowed: true, reason: "Payment, hold, and approval gates satisfied." };
}

// src/server/session-auth.ts
import crypto5 from "node:crypto";
var COOKIE_NAME = "lhl_live_session";
var SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
var env2 = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
};
var base64url2 = (value) => Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
var decodeBase64url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - normalized.length % 4);
  return Buffer.from(`${normalized}${padding}`, "base64");
};
var sign = (payload) => base64url2(crypto5.createHmac("sha256", env2("LHL_SESSION_SECRET")).update(payload).digest());
var safeEqual = (left, right) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto5.timingSafeEqual(a, b);
};
var parseCookies = (header) => {
  if (!header) return {};
  return Object.fromEntries(header.split(";").map((item) => {
    const index = item.indexOf("=");
    if (index === -1) return [item.trim(), ""];
    return [item.slice(0, index).trim(), decodeURIComponent(item.slice(index + 1).trim())];
  }));
};
function readSession(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return null;
  try {
    const session = JSON.parse(decodeBase64url(encoded).toString("utf8"));
    if (!session.uid || !session.email || session.expiresAt <= Math.floor(Date.now() / 1e3)) return null;
    return session;
  } catch {
    return null;
  }
}
function setSession(res, uid, email) {
  const issuedAt = Math.floor(Date.now() / 1e3);
  const session = { uid, email: email.toLowerCase(), issuedAt, expiresAt: issuedAt + SESSION_TTL_SECONDS };
  const encoded = base64url2(JSON.stringify(session));
  const token = `${encoded}.${sign(encoded)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("set-cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
  return session;
}
function clearSession(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("set-cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}
async function authenticatePassword(email, password, create = false) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 8 || password.length > 256) {
    throw new Error("invalid_credentials");
  }
  const endpoint = create ? "accounts:signUp" : "accounts:signInWithPassword";
  const apiKey = env2("FIREBASE_API_KEY");
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, password, returnSecureToken: true }),
    signal: AbortSignal.timeout(8e3)
  });
  const result = await response.json();
  if (!response.ok || !result.localId || !result.email) {
    const code = result.error?.message || "authentication_failed";
    throw new Error(code.toLowerCase());
  }
  return { uid: result.localId, email: result.email.toLowerCase() };
}
function isBootstrapIdentity(session) {
  const email = process.env.LHL_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  return Boolean(email && session.email === email);
}

// src/server/live-store.ts
var LiveStoreError = class extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
    this.name = "LiveStoreError";
  }
};
var cleanString = (value, field, max = 180) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new LiveStoreError(`invalid_${field}`);
  return value.trim();
};
var publicProperty = (property2) => ({
  ...property2,
  scoutPartnerId: "",
  ownerPartnerId: void 0,
  operatorPartnerId: void 0,
  assessorPartnerId: void 0,
  communityAuthorityPartnerId: property2.communityApprovalRequired ? property2.communityAuthorityPartnerId : void 0,
  nightlyFloorEgp: void 0,
  payoutReady: false,
  activationChecklistComplete: false,
  inventoryBaseline: void 0
});
async function partnerFor(session) {
  const stored = await getDocument("partners", session.uid);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic || stored.data.status !== "active") {
    throw new LiveStoreError("live_partner_required", 403);
  }
  return stored.data;
}
async function sessionPartner(session) {
  const stored = await getDocument("partners", session.uid);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic) return null;
  return stored.data;
}
async function loadLiveDataset(session) {
  const [partnersStored, propertiesStored, assessmentsStored, decisionsStored, enquiriesStored] = await Promise.all([
    listDocuments("partners"),
    listDocuments("properties"),
    listDocuments("assessments"),
    listDocuments("ownerDecisions"),
    listDocuments("enquiries")
  ]);
  const partners = partnersStored.map((item) => item.data).filter((item) => item.dataMode === "live" && !item.synthetic);
  const properties = propertiesStored.map((item) => item.data).filter((item) => item.dataMode === "live" && !item.synthetic);
  const assessments = assessmentsStored.map((item) => item.data).filter((item) => item.dataMode === "live" && !item.synthetic);
  const ownerDecisions = decisionsStored.map((item) => item.data).filter((item) => item.dataMode === "live" && !item.synthetic);
  const enquiries = enquiriesStored.map((item) => item.data).filter((item) => item.dataMode === "live" && !item.synthetic);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (!session) {
    return {
      mode: "live",
      label: "Live operations \u2014 verified public records only",
      labelAr: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u2014 \u0627\u0644\u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629 \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0641\u0642\u0637",
      asOf: now,
      partners: [],
      properties: properties.filter((property2) => property2.supplyStage === "live" && property2.publiclyVisible && property2.sealIssued || property2.joiningVisible).map(publicProperty),
      assessments: [],
      ownerDecisions: [],
      enquiries: []
    };
  }
  const current = partners.find((partner) => partner.id === session.uid && partner.status === "active");
  if (!current) {
    return {
      mode: "live",
      label: "Live operations \u2014 identity not onboarded",
      labelAr: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u2014 \u0627\u0644\u0647\u0648\u064A\u0629 \u063A\u064A\u0631 \u0645\u0641\u0639\u0644\u0629",
      asOf: now,
      partners: [],
      properties: [],
      assessments: [],
      ownerDecisions: [],
      enquiries: []
    };
  }
  if (current.platformAdmin) {
    return { mode: "live", label: "Live operations \u2014 verified records only", labelAr: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u2014 \u0633\u062C\u0644\u0627\u062A \u0645\u0648\u062B\u0642\u0629 \u0641\u0642\u0637", asOf: now, partners, properties, assessments, ownerDecisions, enquiries };
  }
  const scopedProperties = properties.filter((property2) => {
    if (current.role === "scout") return property2.scoutPartnerId === current.id;
    if (current.role === "owner") return property2.ownerPartnerId === current.id;
    if (current.role === "operator") return property2.operatorPartnerId === current.id;
    if (current.role === "assessor") return property2.assessorPartnerId === current.id;
    if (current.role === "community_authority") return property2.communityAuthorityPartnerId === current.id;
    return false;
  });
  const propertyIds = new Set(scopedProperties.map((property2) => property2.id));
  const canSeeBookings = current.role === "owner" || current.role === "operator";
  return {
    mode: "live",
    label: "Live operations \u2014 role-scoped verified records",
    labelAr: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u2014 \u0633\u062C\u0644\u0627\u062A \u0645\u0648\u062B\u0642\u0629 \u062D\u0633\u0628 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629",
    asOf: now,
    partners: [current],
    properties: scopedProperties,
    assessments: assessments.filter((assessment2) => propertyIds.has(assessment2.propertyId)),
    ownerDecisions: ownerDecisions.filter((decision2) => propertyIds.has(decision2.propertyId)),
    enquiries: canSeeBookings ? enquiries.filter((enquiry2) => propertyIds.has(enquiry2.propertyId)) : []
  };
}
async function bootstrapFirstScout(session, input) {
  if (!isBootstrapIdentity(session)) throw new LiveStoreError("bootstrap_identity_not_allowed", 403);
  const existing = await listDocuments("partners");
  const current = existing.find((item) => item.data.id === session.uid)?.data;
  if (current) return current;
  if (existing.some((item) => item.data.dataMode === "live" && !item.data.synthetic)) throw new LiveStoreError("bootstrap_already_closed", 409);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const partner = {
    id: session.uid,
    dataMode: "live",
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    role: "scout",
    status: "active",
    platformAdmin: true,
    name: cleanString(input.name, "name", 120),
    nameAr: typeof input.nameAr === "string" && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : cleanString(input.name, "name", 120),
    organisation: typeof input.organisation === "string" && input.organisation.trim() ? input.organisation.trim().slice(0, 160) : "Little Hut",
    serviceArea: cleanString(input.serviceArea, "service_area", 120),
    serviceAreaAr: typeof input.serviceAreaAr === "string" && input.serviceAreaAr.trim() ? input.serviceAreaAr.trim().slice(0, 120) : cleanString(input.serviceArea, "service_area", 120)
  };
  await createDocument("partners", partner.id, partner);
  return partner;
}
async function createScoutProperty(session, input) {
  const partner = await partnerFor(session);
  if (partner.role !== "scout") throw new LiveStoreError("scout_authority_required", 403);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = `live-property-${crypto6.randomUUID()}`;
  const name = cleanString(input.name, "name", 120);
  const location = cleanString(input.location, "location", 120);
  const property2 = {
    id,
    dataMode: "live",
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    slug: `joining-${id.slice(-12)}`,
    name,
    nameAr: typeof input.nameAr === "string" && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : name,
    location,
    locationAr: typeof input.locationAr === "string" && input.locationAr.trim() ? input.locationAr.trim().slice(0, 120) : location,
    summary: "Scout-sourced lead. Listing evidence only; no public claims.",
    summaryAr: "\u062A\u0631\u0634\u064A\u062D \u0645\u0646 \u0627\u0644\u0643\u0634\u0627\u0641 \u0628\u0623\u062F\u0644\u0629 \u0625\u0639\u0644\u0627\u0646 \u0641\u0642\u0637 \u0648\u062F\u0648\u0646 \u0627\u062F\u0639\u0627\u0621\u0627\u062A \u0639\u0627\u0645\u0629.",
    supplyStage: "sourced",
    scoutPartnerId: partner.id,
    publiclyVisible: false,
    joiningVisible: true,
    sealIssued: false,
    maxGuests: 0,
    bedroomCount: 0,
    calendarAuthority: "unknown",
    bookingMode: "request",
    communityApprovalRequired: false,
    activationChecklistComplete: false,
    payoutReady: false,
    heroImage: "",
    galleryImages: [],
    provenMoments: []
  };
  await createDocument("properties", property2.id, property2);
  return property2;
}
async function createLiveEnquiry(input) {
  const propertyId = cleanString(input.propertyId, "property_id", 120);
  const storedProperty = await getDocument("properties", propertyId);
  const property2 = storedProperty?.data;
  if (!property2 || property2.dataMode !== "live" || property2.synthetic || property2.supplyStage !== "live" || !property2.publiclyVisible || !property2.sealIssued) {
    throw new LiveStoreError("public_live_property_required", 403);
  }
  const checkIn = cleanString(input.checkIn, "check_in", 10);
  const checkOut = cleanString(input.checkOut, "check_out", 10);
  const dateCheck = evaluateStayDates(checkIn, checkOut);
  if (!dateCheck.allowed) throw new LiveStoreError("invalid_stay_dates");
  const adults = Number(input.adults);
  const children = Number(input.children);
  if (!Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0 || adults + children > property2.maxGuests) {
    throw new LiveStoreError("invalid_guest_count");
  }
  const requestedMoment = cleanString(input.requestedMoment, "requested_moment", 64);
  if (!property2.provenMoments.some((moment) => moment.key === requestedMoment)) throw new LiveStoreError("unproven_moment");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const enquiry2 = {
    id: `live-enquiry-${crypto6.randomUUID()}`,
    dataMode: "live",
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    propertyId,
    guestName: cleanString(input.guestName, "guest_name", 120),
    guestPhoneMasked: cleanString(input.guestPhoneMasked, "guest_phone", 64),
    checkIn,
    checkOut,
    adults,
    children,
    requestedMoment,
    stage: "received",
    source: "direct",
    communityApproval: {
      required: property2.communityApprovalRequired,
      status: property2.communityApprovalRequired ? "not_submitted" : "not_required",
      authorityPartnerId: property2.communityAuthorityPartnerId
    },
    timeline: [{ stage: "received", at: now, note: "Guest submitted stay enquiry." }]
  };
  await createDocument("enquiries", enquiry2.id, enquiry2);
  return enquiry2;
}
async function advanceLiveEnquiry(session, id, input = {}) {
  const partner = await partnerFor(session);
  if (partner.role !== "operator") throw new LiveStoreError("operator_authority_required", 403);
  const stored = await getDocument("enquiries", id);
  if (!stored) throw new LiveStoreError("enquiry_not_found", 404);
  const target = stored.data;
  const propertyStored = await getDocument("properties", target.propertyId);
  const property2 = propertyStored?.data;
  if (!property2 || property2.operatorPartnerId !== partner.id) throw new LiveStoreError("operator_not_assigned", 403);
  const dateCheck = evaluateStayDates(target.checkIn, target.checkOut);
  if (!dateCheck.allowed) throw new LiveStoreError("invalid_stay_dates", 409);
  const now = /* @__PURE__ */ new Date();
  const at = now.toISOString();
  let updated = { ...target, updatedAt: at };
  let next = null;
  let note = "";
  if (target.stage === "received") {
    next = "qualified";
    note = "Operator qualified party size and stay purpose.";
  } else if (target.stage === "qualified") {
    next = "availability_checked";
    note = "Operator verified calendar authority and availability.";
  } else if (target.stage === "availability_checked") {
    const nightlyRateEgp = Number(input.nightlyRateEgp);
    if (!evaluateRateFloor(property2, nightlyRateEgp).allowed) throw new LiveStoreError("quote_below_owner_floor");
    next = "quoted";
    note = "Operator issued an in-floor accommodation quote.";
    updated.quote = { nightlyRateEgp, nights: dateCheck.nights, accommodationEgp: nightlyRateEgp * dateCheck.nights, feesEgp: 0, totalEgp: nightlyRateEgp * dateCheck.nights, issuedAt: at };
  } else if (target.stage === "quoted") {
    if (!evaluateRateFloor(property2, target.quote?.nightlyRateEgp ?? 0).allowed) throw new LiveStoreError("invalid_quote", 409);
    next = "hold";
    note = "Operator placed a two-hour expiring hold.";
    updated.hold = { active: true, expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1e3).toISOString() };
  } else if (target.stage === "hold") {
    if (!isHoldActive(target.hold, now)) {
      next = "expired";
      note = "Hold expired and released the calendar.";
    } else {
      next = "payment_pending";
      note = "Payment request issued against active hold.";
    }
  } else if (target.stage === "payment_pending") {
    if (!isHoldActive(target.hold, now) || !property2.payoutReady || !target.quote || !evaluateRateFloor(property2, target.quote.nightlyRateEgp).allowed) {
      throw new LiveStoreError("payment_gates_not_satisfied", 409);
    }
    const reference = cleanString(input.paymentReference, "payment_reference", 120);
    const amount = Number(input.paymentAmountEgp);
    if (!Number.isFinite(amount) || amount !== target.quote.totalEgp) throw new LiveStoreError("payment_amount_mismatch");
    next = "payment_received";
    note = "Operator recorded external payment evidence.";
    updated.payment = { amountEgp: amount, receivedAt: at, reference };
  } else if (target.stage === "payment_received") {
    if (!isHoldActive(target.hold, now)) throw new LiveStoreError("hold_expired", 409);
    next = property2.communityApprovalRequired ? "community_approval_pending" : "confirmed";
    note = property2.communityApprovalRequired ? "Guest manifest submitted to the named community authority." : "Stay confirmed; no community gate applies.";
    updated.communityApproval = property2.communityApprovalRequired ? { required: true, status: "pending", authorityPartnerId: property2.communityAuthorityPartnerId } : { required: false, status: "not_required" };
  } else if (target.stage === "community_approved") {
    if (!canConfirmStay(property2, target, now).allowed) throw new LiveStoreError("confirmation_gates_not_satisfied", 409);
    next = "confirmed";
    note = "Operator confirmed after recording the external approval.";
  } else if (target.stage === "confirmed") {
    if (!property2.inventoryBaseline?.items.length || target.readinessCheck?.status !== "ready" || !target.proofStay?.preStay) {
      throw new LiveStoreError("stay_assurance_required_before_completion", 409);
    }
    if (target.readinessCheck.baselineCapturedAt !== property2.inventoryBaseline.capturedAt || target.proofStay.preStay.baselineCapturedAt !== property2.inventoryBaseline.capturedAt) {
      throw new LiveStoreError("stay_assurance_baseline_is_stale", 409);
    }
    next = "completed";
    note = "Stay outcome recorded as completed after readiness and pre-stay assurance evidence.";
  }
  if (!next) throw new LiveStoreError("no_available_transition", 409);
  updated.stage = next;
  updated.timeline = [...updated.timeline, { stage: next, at, note, byPartnerId: partner.id }];
  await replaceDocument("enquiries", id, updated, stored.updateTime);
  return updated;
}
async function recordLiveCommunityApproval(session, id, evidenceReference) {
  const partner = await partnerFor(session);
  if (partner.role !== "operator") throw new LiveStoreError("operator_authority_required", 403);
  const stored = await getDocument("enquiries", id);
  if (!stored) throw new LiveStoreError("enquiry_not_found", 404);
  const target = stored.data;
  const propertyStored = await getDocument("properties", target.propertyId);
  const property2 = propertyStored?.data;
  if (!property2 || property2.operatorPartnerId !== partner.id) throw new LiveStoreError("operator_not_assigned", 403);
  if (target.stage !== "community_approval_pending" || !property2.communityApprovalRequired || !property2.communityAuthorityPartnerId || target.communityApproval?.authorityPartnerId !== property2.communityAuthorityPartnerId) {
    throw new LiveStoreError("community_approval_not_recordable", 409);
  }
  const evidence = cleanString(evidenceReference, "evidence_reference", 120);
  const at = (/* @__PURE__ */ new Date()).toISOString();
  const updated = {
    ...target,
    updatedAt: at,
    stage: "community_approved",
    communityApproval: { required: true, status: "approved", authorityPartnerId: property2.communityAuthorityPartnerId, evidenceReference: evidence },
    timeline: [...target.timeline, { stage: "community_approved", at, byPartnerId: partner.id, note: "Operator recorded approval already issued by the named community authority." }]
  };
  await replaceDocument("enquiries", id, updated, stored.updateTime);
  return updated;
}

// src/server/live-assurance.ts
var readinessKeys = ["access", "cleanliness", "utilities", "sleeping", "safety", "moment_setup"];
var cleanString2 = (value, field, max = 180) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new LiveStoreError(`invalid_${field}`);
  return value.trim();
};
var optionalString = (value, max = 1e3) => typeof value === "string" ? value.trim().slice(0, max) : "";
var requireInteger2 = (value, field, min, max) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new LiveStoreError(`invalid_${field}`);
  return number;
};
var requireOperatorForProperty = async (session, property2) => {
  const operator = await sessionPartner(session);
  if (!operator || operator.status !== "active" || operator.role !== "operator") throw new LiveStoreError("operator_authority_required", 403);
  if (property2.operatorPartnerId !== operator.id) throw new LiveStoreError("operator_not_assigned", 403);
  return operator;
};
var getLiveProperty = async (propertyId) => {
  const stored = await getDocument("properties", propertyId);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic) throw new LiveStoreError("property_not_found", 404);
  return stored;
};
var getLiveEnquiry = async (enquiryId) => {
  const stored = await getDocument("enquiries", enquiryId);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic) throw new LiveStoreError("enquiry_not_found", 404);
  return stored;
};
var normalizeBaselineItems = (value) => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) throw new LiveStoreError("invalid_inventory_items");
  const seen = /* @__PURE__ */ new Set();
  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new LiveStoreError(`invalid_inventory_item_${index}`);
    const record2 = raw;
    const key = cleanString2(record2.key, `inventory_key_${index}`, 64).toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]{1,63}$/.test(key) || seen.has(key)) throw new LiveStoreError("invalid_or_duplicate_inventory_key");
    seen.add(key);
    const label = cleanString2(record2.label, `inventory_label_${index}`, 120);
    const labelAr = optionalString(record2.labelAr, 120) || label;
    const expectedQuantity = requireInteger2(record2.expectedQuantity, `inventory_quantity_${index}`, 1, 100);
    const evidenceReference = cleanString2(record2.evidenceReference, `inventory_evidence_${index}`, 180);
    return { key, label, labelAr, expectedQuantity, evidenceReference };
  });
};
var normalizeReadinessItems = (value) => {
  if (!Array.isArray(value) || value.length !== readinessKeys.length) throw new LiveStoreError("invalid_readiness_items");
  const byKey = /* @__PURE__ */ new Map();
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new LiveStoreError("invalid_readiness_item");
    const record2 = raw;
    const key = cleanString2(record2.key, "readiness_key", 32);
    if (!readinessKeys.includes(key) || byKey.has(key)) throw new LiveStoreError("invalid_or_duplicate_readiness_key");
    byKey.set(key, record2);
  }
  return readinessKeys.map((key) => {
    const record2 = byKey.get(key);
    const status = record2.status;
    if (status !== "passed" && status !== "failed") throw new LiveStoreError(`invalid_readiness_${key}_status`);
    return {
      key,
      status,
      evidenceReference: cleanString2(record2.evidenceReference, `readiness_${key}_evidence`, 180)
    };
  });
};
var normalizeObservations = (value, baseline) => {
  if (!Array.isArray(value) || value.length !== baseline.length) throw new LiveStoreError("inventory_snapshot_must_match_baseline");
  const expectedKeys = new Set(baseline.map((item) => item.key));
  const seen = /* @__PURE__ */ new Set();
  const observations = value.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new LiveStoreError(`invalid_inventory_observation_${index}`);
    const record2 = raw;
    const key = cleanString2(record2.key, `observation_key_${index}`, 64).toLowerCase();
    if (!expectedKeys.has(key) || seen.has(key)) throw new LiveStoreError("inventory_snapshot_must_match_baseline");
    seen.add(key);
    const observedQuantity = requireInteger2(record2.observedQuantity, `observed_quantity_${index}`, 0, 100);
    const condition = record2.condition;
    if (!["good", "attention", "missing"].includes(condition)) throw new LiveStoreError(`invalid_inventory_condition_${index}`);
    if (observedQuantity === 0 && condition !== "missing" || observedQuantity > 0 && condition === "missing") {
      throw new LiveStoreError(`inventory_quantity_condition_mismatch_${index}`);
    }
    return {
      key,
      observedQuantity,
      condition,
      evidenceReference: cleanString2(record2.evidenceReference, `observation_evidence_${index}`, 180)
    };
  });
  if (seen.size !== baseline.length) throw new LiveStoreError("inventory_snapshot_must_match_baseline");
  return observations;
};
async function recordInventoryBaseline(session, propertyId, input) {
  const propertyStored = await getLiveProperty(propertyId);
  const property2 = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property2);
  if (property2.supplyStage !== "live" || !property2.sealIssued) throw new LiveStoreError("sealed_live_property_required", 409);
  const active = (await listDocuments("enquiries")).map((item) => item.data).some((enquiry2) => enquiry2.dataMode === "live" && !enquiry2.synthetic && enquiry2.propertyId === propertyId && Boolean(enquiry2.proofStay?.preStay) && !enquiry2.proofStay?.postStay);
  if (active) throw new LiveStoreError("inventory_baseline_locked_by_active_stay", 409);
  const items = normalizeBaselineItems(input.items);
  const capturedAt = (/* @__PURE__ */ new Date()).toISOString();
  const updated = {
    ...property2,
    updatedAt: capturedAt,
    inventoryBaseline: {
      capturedAt,
      capturedByPartnerId: operator.id,
      items
    }
  };
  await replaceDocument("properties", propertyId, updated, propertyStored.updateTime);
  return updated;
}
async function recordStayReadiness(session, enquiryId, input) {
  const enquiryStored = await getLiveEnquiry(enquiryId);
  const enquiry2 = enquiryStored.data;
  const propertyStored = await getLiveProperty(enquiry2.propertyId);
  const property2 = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property2);
  if (enquiry2.stage !== "confirmed") throw new LiveStoreError("confirmed_stay_required_for_readiness", 409);
  if (enquiry2.proofStay?.preStay) throw new LiveStoreError("readiness_locked_after_pre_stay", 409);
  if (!property2.inventoryBaseline?.items.length) throw new LiveStoreError("inventory_baseline_required", 409);
  const items = normalizeReadinessItems(input.items);
  const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
  const readinessCheck = {
    checkedAt,
    checkedByPartnerId: operator.id,
    baselineCapturedAt: property2.inventoryBaseline.capturedAt,
    status: items.every((item) => item.status === "passed") ? "ready" : "blocked",
    items,
    note: optionalString(input.note),
    noteAr: optionalString(input.noteAr)
  };
  const updated = { ...enquiry2, updatedAt: checkedAt, readinessCheck };
  await replaceDocument("enquiries", enquiryId, updated, enquiryStored.updateTime);
  return updated;
}
async function captureProofStaySnapshot(session, enquiryId, phase, input) {
  const enquiryStored = await getLiveEnquiry(enquiryId);
  const enquiry2 = enquiryStored.data;
  const propertyStored = await getLiveProperty(enquiry2.propertyId);
  const property2 = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property2);
  const baseline = property2.inventoryBaseline;
  if (!baseline?.items.length) throw new LiveStoreError("inventory_baseline_required", 409);
  const capturedAt = (/* @__PURE__ */ new Date()).toISOString();
  const observations = normalizeObservations(input.observations, baseline.items);
  if (phase === "pre_stay") {
    if (enquiry2.stage !== "confirmed") throw new LiveStoreError("confirmed_stay_required_for_pre_snapshot", 409);
    if (enquiry2.proofStay?.preStay) throw new LiveStoreError("proofstay_pre_already_captured", 409);
    if (enquiry2.readinessCheck?.status !== "ready") throw new LiveStoreError("ready_check_required_before_pre_snapshot", 409);
    if (enquiry2.readinessCheck.baselineCapturedAt !== baseline.capturedAt) throw new LiveStoreError("readiness_baseline_is_stale", 409);
    const baselineByKey = new Map(baseline.items.map((item) => [item.key, item]));
    const preReady = observations.every((observation) => {
      const expected = baselineByKey.get(observation.key);
      return observation.condition === "good" && observation.observedQuantity === expected.expectedQuantity;
    });
    if (!preReady) throw new LiveStoreError("pre_stay_inventory_not_ready", 409);
    const snapshot = {
      id: `proofstay-pre-${crypto7.randomUUID()}`,
      phase,
      capturedAt,
      capturedByPartnerId: operator.id,
      baselineCapturedAt: baseline.capturedAt,
      observations
    };
    const updated2 = {
      ...enquiry2,
      updatedAt: capturedAt,
      proofStay: { ...enquiry2.proofStay || {}, preStay: snapshot }
    };
    await replaceDocument("enquiries", enquiryId, updated2, enquiryStored.updateTime);
    return updated2;
  }
  if (enquiry2.stage !== "completed") throw new LiveStoreError("completed_stay_required_for_post_snapshot", 409);
  if (!enquiry2.proofStay?.preStay) throw new LiveStoreError("proofstay_pre_required", 409);
  if (enquiry2.proofStay.postStay) throw new LiveStoreError("proofstay_post_already_captured", 409);
  const pre = enquiry2.proofStay.preStay;
  if (pre.baselineCapturedAt !== baseline.capturedAt) throw new LiveStoreError("proofstay_baseline_changed_before_post", 409);
  const preByKey = new Map(pre.observations.map((observation) => [observation.key, observation]));
  const changedKeys = observations.filter((observation) => {
    const before = preByKey.get(observation.key);
    return !before || before.observedQuantity !== observation.observedQuantity || observation.condition !== "good";
  }).map((observation) => observation.key);
  const postStay = {
    id: `proofstay-post-${crypto7.randomUUID()}`,
    phase,
    capturedAt,
    capturedByPartnerId: operator.id,
    baselineCapturedAt: pre.baselineCapturedAt,
    observations
  };
  const result = {
    status: changedKeys.length === 0 ? "verified_unchanged" : "attention_required",
    comparedAt: capturedAt,
    preSnapshotId: pre.id,
    postSnapshotId: postStay.id,
    changedKeys
  };
  const updated = {
    ...enquiry2,
    updatedAt: capturedAt,
    proofStay: { ...enquiry2.proofStay, postStay, result }
  };
  await replaceDocument("enquiries", enquiryId, updated, enquiryStored.updateTime);
  return updated;
}

// src/server/live-scout-supply.ts
var cleanString3 = (value, field, max = 180) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};
async function recordScoutOwnerConsent(session, propertyId, input) {
  const scout = await sessionPartner(session);
  if (!scout || scout.status !== "active" || scout.role !== "scout") {
    throw new LiveStoreError("scout_authority_required", 403);
  }
  const propertyStored = await getDocument("properties", propertyId);
  if (!propertyStored || propertyStored.data.dataMode !== "live" || propertyStored.data.synthetic) {
    throw new LiveStoreError("property_not_found", 404);
  }
  if (propertyStored.data.supplyStage !== "sourced" || propertyStored.data.scoutPartnerId !== scout.id) {
    throw new LiveStoreError("source_scout_consent_required", 403);
  }
  if (propertyStored.data.ownerConsentReference) {
    throw new LiveStoreError("owner_consent_already_recorded", 409);
  }
  const ownerConsentReference = cleanString3(input.ownerConsentReference, "owner_consent_reference", 180);
  const property2 = {
    ...propertyStored.data,
    ownerConsentReference,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await commitDocuments([{
    mode: "replace",
    collection: "properties",
    id: propertyId,
    data: property2,
    expectedUpdateTime: propertyStored.updateTime
  }]);
  return property2;
}

// src/server/live-supply.ts
var trustLabels2 = {
  truth: ["Truth", "\u0627\u0644\u0635\u062F\u0642"],
  readiness: ["Readiness", "\u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629"],
  privacy: ["Privacy", "\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629"],
  comfort: ["Comfort", "\u0627\u0644\u0631\u0627\u062D\u0629"],
  arrival: ["Arrival", "\u0627\u0644\u0648\u0635\u0648\u0644"],
  moment: ["Moment integrity", "\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0644\u062D\u0638\u0629"]
};
var shieldLabels2 = {
  fire: ["Fire", "\u0627\u0644\u062D\u0631\u064A\u0642"],
  water: ["Water", "\u0627\u0644\u0645\u064A\u0627\u0647"],
  access: ["Access", "\u0627\u0644\u062F\u062E\u0648\u0644"],
  electrical: ["Electrical", "\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621"],
  child: ["Child safety", "\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644"],
  emergency: ["Emergency", "\u0627\u0644\u0637\u0648\u0627\u0631\u0626"]
};
var momentLabels = {
  slow_morning: ["Slow Morning", "\u0627\u0644\u0635\u0628\u0627\u062D \u0627\u0644\u0647\u0627\u062F\u0626"],
  long_table: ["Long Table", "\u0627\u0644\u0645\u0627\u0626\u062F\u0629 \u0627\u0644\u0645\u0645\u062A\u062F\u0629"],
  afternoon_drift: ["Afternoon Drift", "\u0633\u0643\u0648\u0646 \u0627\u0644\u0638\u0647\u064A\u0631\u0629"],
  night_swim: ["Night Swim", "\u0627\u0644\u0633\u0628\u0627\u062D\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629"],
  fire_conversation: ["Fire Conversation", "\u062D\u0648\u0627\u0631 \u062D\u0648\u0644 \u0627\u0644\u0646\u0627\u0631"],
  silent_reading: ["Silent Reading", "\u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0635\u0627\u0645\u062A\u0629"]
};
var cleanString4 = (value, field, max = 180) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};
var optionalString2 = (value, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";
var requireInteger3 = (value, field, min, max) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new LiveStoreError(`invalid_${field}`);
  return number;
};
var requireIsoDay = (value, field) => {
  const day = cleanString4(value, field, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new LiveStoreError(`invalid_${field}`);
  const parsed = /* @__PURE__ */ new Date(`${day}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new LiveStoreError(`invalid_${field}`);
  return day;
};
var requireHttpsUrl = (value, field) => {
  const raw = cleanString4(value, field, 1200);
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") throw new Error("not https");
    return url.toString();
  } catch {
    throw new LiveStoreError(`invalid_${field}`);
  }
};
var requirePartner = async (id, role) => {
  const partnerId = cleanString4(id, `${role}_partner_id`, 160);
  const stored = await getDocument("partners", partnerId);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic || stored.data.status !== "active" || stored.data.role !== role) {
    throw new LiveStoreError(`active_${role}_required`, 409);
  }
  return stored.data;
};
var requireCurrentPartner = async (session, role) => {
  const partner = await sessionPartner(session);
  if (!partner || partner.status !== "active") throw new LiveStoreError("live_partner_required", 403);
  if (role && partner.role !== role) throw new LiveStoreError(`${role}_authority_required`, 403);
  return partner;
};
var requirePlatformAdmin = async (session) => {
  const partner = await requireCurrentPartner(session);
  if (!partner.platformAdmin) throw new LiveStoreError("platform_admin_required", 403);
  return partner;
};
var getProperty = async (id) => {
  const stored = await getDocument("properties", id);
  if (!stored || stored.data.dataMode !== "live" || stored.data.synthetic) throw new LiveStoreError("property_not_found", 404);
  return stored;
};
var assessmentId = (propertyId) => `assessment-${propertyId}`;
var decisionId = (propertyId) => `decision-${propertyId}`;
var pendingGate = (key, labels) => ({
  key,
  label: labels[key][0],
  labelAr: labels[key][1],
  status: "pending"
});
async function assignOwnerToProperty(session, propertyId, input) {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== "sourced") throw new LiveStoreError("owner_assignment_requires_sourced_stage", 409);
  const owner = await requirePartner(input.ownerPartnerId, "owner");
  const consentReference = cleanString4(input.ownerConsentReference, "owner_consent_reference", 180);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const updated = {
    ...propertyStored.data,
    ownerPartnerId: owner.id,
    ownerConsentReference: consentReference,
    supplyStage: "owner_engaged",
    updatedAt: now
  };
  await commitDocuments([{ mode: "replace", collection: "properties", id: propertyId, data: updated, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}
async function assignOperatorToProperty(session, propertyId, input) {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (["sourced", "declined", "live"].includes(propertyStored.data.supplyStage)) throw new LiveStoreError("operator_assignment_not_available", 409);
  const operator = await requirePartner(input.operatorPartnerId, "operator");
  const updated = { ...propertyStored.data, operatorPartnerId: operator.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await commitDocuments([{ mode: "replace", collection: "properties", id: propertyId, data: updated, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}
async function assignCommunityAuthorityToProperty(session, propertyId, input) {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (["sourced", "declined", "live"].includes(propertyStored.data.supplyStage)) throw new LiveStoreError("community_authority_assignment_not_available", 409);
  const authority = await requirePartner(input.communityAuthorityPartnerId, "community_authority");
  const updated = { ...propertyStored.data, communityAuthorityPartnerId: authority.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await commitDocuments([{ mode: "replace", collection: "properties", id: propertyId, data: updated, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}
async function schedulePropertyAssessment(session, propertyId, input) {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (!["owner_engaged", "paused"].includes(propertyStored.data.supplyStage)) throw new LiveStoreError("assessment_schedule_not_available", 409);
  if (!propertyStored.data.ownerPartnerId || !propertyStored.data.ownerConsentReference) throw new LiveStoreError("verified_owner_engagement_required", 409);
  const assessor = await requirePartner(input.assessorPartnerId, "assessor");
  if ([propertyStored.data.ownerPartnerId, propertyStored.data.scoutPartnerId].includes(assessor.id)) throw new LiveStoreError("assessor_must_be_independent", 409);
  const scheduledFor = requireIsoDay(input.scheduledFor, "scheduled_for");
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  if (scheduledFor < today) throw new LiveStoreError("assessment_date_in_past");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = assessmentId(propertyId);
  const existing = await getDocument("assessments", id);
  const assessment2 = {
    id,
    dataMode: "live",
    synthetic: false,
    createdAt: existing?.data.createdAt || now,
    updatedAt: now,
    propertyId,
    assessorPartnerId: assessor.id,
    independenceConfirmed: false,
    scheduledFor,
    completedAt: void 0,
    result: "scheduled",
    trustGates: TRUST_GATE_KEYS.map((key) => pendingGate(key, trustLabels2)),
    shieldGates: SHIELD_GATE_KEYS.map((key) => pendingGate(key, shieldLabels2)),
    provenMomentKeys: [],
    evidenceCount: 0,
    evidenceReferences: [],
    recommendation: "",
    recommendationAr: ""
  };
  const property2 = {
    ...propertyStored.data,
    assessorPartnerId: assessor.id,
    supplyStage: "assessment_scheduled",
    provenMoments: [],
    updatedAt: now
  };
  await commitDocuments([
    existing ? { mode: "replace", collection: "assessments", id, data: assessment2, expectedUpdateTime: existing.updateTime } : { mode: "create", collection: "assessments", id, data: assessment2 },
    { mode: "replace", collection: "properties", id: propertyId, data: property2, expectedUpdateTime: propertyStored.updateTime }
  ]);
  return assessment2;
}
var normalizeFinalGates = (value, keys, labels, field) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new LiveStoreError(`invalid_${field}`);
  const input = value;
  const providedKeys = Object.keys(input);
  if (providedKeys.length !== keys.length || providedKeys.some((key) => !keys.includes(key))) throw new LiveStoreError(`invalid_${field}`);
  return keys.map((key) => {
    const raw = input[key];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new LiveStoreError(`invalid_${field}_${key}`);
    const record2 = raw;
    const status = record2.status;
    if (!["passed", "failed"].includes(status)) throw new LiveStoreError(`invalid_${field}_${key}_status`);
    const evidenceReference = cleanString4(record2.evidenceReference, `${field}_${key}_evidence`, 180);
    return { key, label: labels[key][0], labelAr: labels[key][1], status, evidenceReference };
  });
};
var normalizeProvenMoments = (value, completedAt) => {
  if (!Array.isArray(value)) throw new LiveStoreError("invalid_proven_moments");
  if (value.length > MOMENT_KEYS.length) throw new LiveStoreError("invalid_proven_moments");
  const seen = /* @__PURE__ */ new Set();
  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new LiveStoreError("invalid_proven_moment");
    const record2 = item;
    const key = cleanString4(record2.key, "moment_key", 64);
    if (!MOMENT_KEYS.includes(key) || seen.has(key)) throw new LiveStoreError("invalid_or_duplicate_moment_key");
    seen.add(key);
    const evidenceId = cleanString4(record2.evidenceReference, "moment_evidence_reference", 180);
    const labels = momentLabels[key];
    return {
      key,
      title: labels[0],
      titleAr: labels[1],
      summary: `${labels[0]} was independently proven during the physical assessment.`,
      summaryAr: `\u062A\u0645 \u062A\u0648\u062B\u064A\u0642 ${labels[1]} \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A.`,
      evidenceId,
      provenAt: completedAt
    };
  });
};
async function submitPropertyAssessment(session, propertyId, input) {
  const assessor = await requireCurrentPartner(session, "assessor");
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== "assessment_scheduled" || propertyStored.data.assessorPartnerId !== assessor.id) {
    throw new LiveStoreError("assigned_assessment_required", 403);
  }
  const id = assessmentId(propertyId);
  const assessmentStored = await getDocument("assessments", id);
  if (!assessmentStored || assessmentStored.data.assessorPartnerId !== assessor.id || assessmentStored.data.result !== "scheduled") {
    throw new LiveStoreError("scheduled_assessment_record_required", 409);
  }
  if (input.independenceConfirmed !== true) throw new LiveStoreError("independence_confirmation_required");
  const completedAt = (/* @__PURE__ */ new Date()).toISOString();
  const trustGates = normalizeFinalGates(input.trustGates, TRUST_GATE_KEYS, trustLabels2, "trust_gates");
  const shieldGates = normalizeFinalGates(input.shieldGates, SHIELD_GATE_KEYS, shieldLabels2, "shield_gates");
  const provenMoments = normalizeProvenMoments(input.provenMoments, completedAt);
  const evidenceReferences = [...new Set([
    ...trustGates.map((gate) => gate.evidenceReference || ""),
    ...shieldGates.map((gate) => gate.evidenceReference || ""),
    ...provenMoments.map((moment) => moment.evidenceId)
  ].filter(Boolean))];
  const recommendation = cleanString4(input.recommendation, "recommendation", 1e3);
  const recommendationAr = optionalString2(input.recommendationAr, 1e3) || recommendation;
  const candidate = {
    ...assessmentStored.data,
    updatedAt: completedAt,
    completedAt,
    independenceConfirmed: true,
    trustGates,
    shieldGates,
    provenMomentKeys: provenMoments.map((moment) => moment.key),
    evidenceCount: evidenceReferences.length,
    evidenceReferences,
    recommendation,
    recommendationAr,
    result: "conditions"
  };
  const assessmentCheck = evaluateAssessment(candidate);
  const hasFailedGate = [...trustGates, ...shieldGates].some((gate) => gate.status === "failed");
  const result = assessmentCheck.passed ? "passed" : hasFailedGate ? "failed" : "conditions";
  const assessment2 = { ...candidate, result };
  const property2 = {
    ...propertyStored.data,
    provenMoments,
    supplyStage: result === "passed" ? "decision_pending" : "paused",
    updatedAt: completedAt
  };
  await commitDocuments([
    { mode: "replace", collection: "assessments", id, data: assessment2, expectedUpdateTime: assessmentStored.updateTime },
    { mode: "replace", collection: "properties", id: propertyId, data: property2, expectedUpdateTime: propertyStored.updateTime }
  ]);
  return assessment2;
}
async function submitPropertyOwnerDecision(session, propertyId, input) {
  const owner = await requireCurrentPartner(session, "owner");
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== "decision_pending" || propertyStored.data.ownerPartnerId !== owner.id) {
    throw new LiveStoreError("assigned_owner_decision_required", 403);
  }
  const assessmentStored = await getDocument("assessments", assessmentId(propertyId));
  if (!assessmentStored || assessmentStored.data.result !== "passed" || !evaluateAssessment(assessmentStored.data).passed) {
    throw new LiveStoreError("passed_assessment_required", 409);
  }
  const id = decisionId(propertyId);
  if (await getDocument("ownerDecisions", id)) throw new LiveStoreError("owner_decision_already_recorded", 409);
  const decision2 = cleanString4(input.decision, "decision", 20);
  if (!["go", "defer", "decline"].includes(decision2)) throw new LiveStoreError("invalid_owner_decision");
  const decidedAt = (/* @__PURE__ */ new Date()).toISOString();
  const note = optionalString2(input.note, 1e3);
  const noteAr = optionalString2(input.noteAr, 1e3) || note;
  const record2 = {
    id,
    dataMode: "live",
    synthetic: false,
    createdAt: decidedAt,
    updatedAt: decidedAt,
    propertyId,
    ownerPartnerId: owner.id,
    decision: decision2,
    decidedAt,
    payoutReady: false,
    conditions: [],
    note,
    noteAr
  };
  let property2 = { ...propertyStored.data, updatedAt: decidedAt };
  if (decision2 === "go") {
    const nightlyFloorEgp = Number(input.nightlyFloorEgp);
    if (!Number.isFinite(nightlyFloorEgp) || nightlyFloorEgp <= 0) throw new LiveStoreError("positive_owner_floor_required");
    if (input.payoutReady !== true) throw new LiveStoreError("payout_readiness_required");
    if (typeof input.communityApprovalRequired !== "boolean") throw new LiveStoreError("community_policy_required");
    if (input.communityApprovalRequired && !property2.communityAuthorityPartnerId) throw new LiveStoreError("named_community_authority_required", 409);
    record2.nightlyFloorEgp = nightlyFloorEgp;
    record2.payoutReady = true;
    property2 = {
      ...property2,
      nightlyFloorEgp,
      payoutReady: true,
      communityApprovalRequired: input.communityApprovalRequired,
      supplyStage: "activation_ready"
    };
  } else if (decision2 === "defer") {
    property2 = { ...property2, supplyStage: "paused" };
  } else {
    property2 = { ...property2, supplyStage: "declined", joiningVisible: false, publiclyVisible: false, sealIssued: false };
  }
  await commitDocuments([
    { mode: "create", collection: "ownerDecisions", id, data: record2 },
    { mode: "replace", collection: "properties", id: propertyId, data: property2, expectedUpdateTime: propertyStored.updateTime }
  ]);
  return record2;
}
async function activateLiveProperty(session, propertyId, input) {
  const operator = await requireCurrentPartner(session, "operator");
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== "activation_ready" || propertyStored.data.operatorPartnerId !== operator.id) {
    throw new LiveStoreError("assigned_activation_required", 403);
  }
  const assessmentStored = await getDocument("assessments", assessmentId(propertyId));
  const decisionStored = await getDocument("ownerDecisions", decisionId(propertyId));
  if (!assessmentStored || !decisionStored) throw new LiveStoreError("assessment_and_owner_decision_required", 409);
  if (input.activationChecklistComplete !== true) throw new LiveStoreError("activation_checklist_required");
  const calendarAuthority = cleanString4(input.calendarAuthority, "calendar_authority", 30);
  if (!["little_hut", "external"].includes(calendarAuthority)) throw new LiveStoreError("explicit_calendar_authority_required");
  const requestedBookingMode = cleanString4(input.bookingMode, "booking_mode", 20);
  if (!["request", "instant"].includes(requestedBookingMode)) throw new LiveStoreError("invalid_booking_mode");
  const maxGuests = requireInteger3(input.maxGuests, "max_guests", 1, 20);
  const bedroomCount = requireInteger3(input.bedroomCount, "bedroom_count", 0, 20);
  const heroImage = requireHttpsUrl(input.heroImage, "hero_image");
  const galleryRaw = Array.isArray(input.galleryImages) ? input.galleryImages : [];
  if (galleryRaw.length > 12) throw new LiveStoreError("too_many_gallery_images");
  const galleryImages = galleryRaw.map((item) => requireHttpsUrl(item, "gallery_image"));
  if (propertyStored.data.communityApprovalRequired && !propertyStored.data.communityAuthorityPartnerId) {
    throw new LiveStoreError("named_community_authority_required", 409);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const candidate = {
    ...propertyStored.data,
    updatedAt: now,
    calendarAuthority,
    bookingMode: requestedBookingMode,
    activationChecklistComplete: true,
    maxGuests,
    bedroomCount,
    heroImage,
    galleryImages,
    summary: `An independently assessed Little Hut home in ${propertyStored.data.location}. See the proven Moments below.`,
    summaryAr: `\u0628\u064A\u062A \u0644\u064A\u062A\u0644 \u0647\u062A \u062A\u0645 \u062A\u0642\u064A\u064A\u0645\u0647 \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644 \u0641\u064A ${propertyStored.data.locationAr}. \u062A\u0638\u0647\u0631 \u0627\u0644\u0644\u062D\u0638\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0623\u062F\u0646\u0627\u0647.`
  };
  const resolvedMode = resolveBookingMode(candidate).mode;
  const ready = { ...candidate, bookingMode: resolvedMode };
  const liveCheck = evaluateGoLive(ready, assessmentStored.data, decisionStored.data);
  if (!liveCheck.allowed) throw new LiveStoreError("go_live_gate_failed", 409);
  if (!ready.operatorPartnerId || ready.provenMoments.length < 2 || !ready.heroImage || ready.maxGuests < 1) {
    throw new LiveStoreError("go_live_operational_fields_incomplete", 409);
  }
  const live = {
    ...ready,
    supplyStage: "live",
    publiclyVisible: true,
    joiningVisible: false,
    sealIssued: true,
    updatedAt: now
  };
  await commitDocuments([{ mode: "replace", collection: "properties", id: propertyId, data: live, expectedUpdateTime: propertyStored.updateTime }]);
  return live;
}

// src/server/partner-invites.ts
import crypto8 from "node:crypto";
var INVITE_TTL_MS = 48 * 60 * 60 * 1e3;
var ROLES = /* @__PURE__ */ new Set(["owner", "scout", "operator", "assessor", "community_authority"]);
var requireString2 = (value, field, max = 160) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};
var requireEmail = (value) => {
  const email = requireString2(value, "email", 254).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new LiveStoreError("invalid_email");
  return email;
};
function hashInviteToken(token) {
  return crypto8.createHash("sha256").update(token, "utf8").digest("hex");
}
function inviteCanBeAccepted(invite, now = /* @__PURE__ */ new Date()) {
  return invite.status === "pending" && new Date(invite.expiresAt).getTime() > now.getTime();
}
function inviteCanResume(invite, now = /* @__PURE__ */ new Date()) {
  return invite.status === "claiming" && new Date(invite.expiresAt).getTime() > now.getTime();
}
var requirePlatformAdmin2 = async (session) => {
  const partner = await sessionPartner(session);
  if (!partner || partner.status !== "active" || !partner.platformAdmin) {
    throw new LiveStoreError("platform_admin_required", 403);
  }
  return partner;
};
async function issuePartnerInvite(session, input) {
  const admin = await requirePlatformAdmin2(session);
  const email = requireEmail(input.email);
  const role = requireString2(input.role, "role", 40);
  if (!ROLES.has(role)) throw new LiveStoreError("invalid_role");
  const now = /* @__PURE__ */ new Date();
  const existingInvites = await listDocuments("partnerInvites");
  const duplicate = existingInvites.some(({ data }) => data.email === email && (inviteCanBeAccepted(data, now) || inviteCanResume(data, now)));
  if (duplicate) throw new LiveStoreError("pending_invite_exists", 409);
  const token = crypto8.randomBytes(32).toString("base64url");
  const id = hashInviteToken(token);
  const createdAt = now.toISOString();
  const invite = {
    id,
    dataMode: "live",
    synthetic: false,
    email,
    role,
    name: requireString2(input.name, "name", 120),
    nameAr: typeof input.nameAr === "string" && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : requireString2(input.name, "name", 120),
    organisation: typeof input.organisation === "string" && input.organisation.trim() ? input.organisation.trim().slice(0, 160) : void 0,
    serviceArea: requireString2(input.serviceArea, "service_area", 120),
    serviceAreaAr: typeof input.serviceAreaAr === "string" && input.serviceAreaAr.trim() ? input.serviceAreaAr.trim().slice(0, 120) : requireString2(input.serviceArea, "service_area", 120),
    status: "pending",
    createdByPartnerId: admin.id,
    createdAt,
    updatedAt: createdAt,
    expiresAt: new Date(now.getTime() + INVITE_TTL_MS).toISOString()
  };
  await createDocument("partnerInvites", id, invite);
  return { invite, token };
}
async function listPartnerInvites(session) {
  await requirePlatformAdmin2(session);
  const invites = await listDocuments("partnerInvites");
  return invites.map(({ data }) => data).filter((invite) => invite.dataMode === "live" && !invite.synthetic).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
async function revokePartnerInvite(session, id) {
  await requirePlatformAdmin2(session);
  const stored = await getDocument("partnerInvites", id);
  if (!stored) throw new LiveStoreError("invite_not_found", 404);
  if (stored.data.status === "accepted") throw new LiveStoreError("accepted_invite_cannot_be_revoked", 409);
  if (stored.data.status === "revoked") return stored.data;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const updated = { ...stored.data, status: "revoked", updatedAt: now };
  await replaceDocument("partnerInvites", id, updated, stored.updateTime);
  return updated;
}
async function acceptPartnerInvite(token, password) {
  const rawToken = requireString2(token, "invite_token", 200);
  const id = hashInviteToken(rawToken);
  const initial = await getDocument("partnerInvites", id);
  if (!initial || !inviteCanBeAccepted(initial.data) && !inviteCanResume(initial.data)) {
    throw new LiveStoreError("invite_invalid_or_expired", 410);
  }
  const startedFromPending = initial.data.status === "pending";
  let claimData = initial.data;
  let claimUpdateTime = initial.updateTime;
  if (startedFromPending) {
    const claiming = { ...initial.data, status: "claiming", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    const claimed = await replaceDocument("partnerInvites", id, claiming, initial.updateTime).catch((error) => {
      if (error instanceof Error && error.message === "record_changed_concurrently") throw new LiveStoreError("invite_already_claimed", 409);
      throw error;
    });
    claimData = claiming;
    claimUpdateTime = claimed.updateTime;
  }
  let identityCreated = !startedFromPending;
  try {
    const identity = await authenticatePassword(initial.data.email, String(password || ""), startedFromPending);
    identityCreated = true;
    let partner;
    const existingPartner = await getDocument("partners", identity.uid);
    if (existingPartner) {
      partner = existingPartner.data;
      if (partner.dataMode !== "live" || partner.synthetic || partner.role !== initial.data.role || partner.status !== "active") {
        throw new LiveStoreError("existing_partner_conflicts_with_invite", 409);
      }
    } else {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      partner = {
        id: identity.uid,
        dataMode: "live",
        synthetic: false,
        createdAt: now,
        updatedAt: now,
        role: initial.data.role,
        status: "active",
        platformAdmin: false,
        name: initial.data.name,
        nameAr: initial.data.nameAr,
        organisation: initial.data.organisation,
        serviceArea: initial.data.serviceArea,
        serviceAreaAr: initial.data.serviceAreaAr
      };
      await createDocument("partners", partner.id, partner);
    }
    const acceptedAt = (/* @__PURE__ */ new Date()).toISOString();
    const accepted = {
      ...claimData,
      status: "accepted",
      updatedAt: acceptedAt,
      acceptedAt,
      acceptedPartnerId: partner.id
    };
    try {
      await replaceDocument("partnerInvites", id, accepted, claimUpdateTime);
    } catch (error) {
      const latest = await getDocument("partnerInvites", id);
      if (!latest || latest.data.status !== "accepted" || latest.data.acceptedPartnerId !== partner.id) throw error;
    }
    return { uid: identity.uid, email: identity.email, partner };
  } catch (error) {
    if (!identityCreated && startedFromPending) {
      const restored = { ...initial.data, status: "pending", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      await replaceDocument("partnerInvites", id, restored, claimUpdateTime).catch(() => void 0);
    }
    if (error instanceof LiveStoreError) throw error;
    const code = error instanceof Error ? error.message : "invite_acceptance_failed";
    throw new LiveStoreError(code, 400);
  }
}

// server.ts
var app = express();
var port = 3e3;
var isProduction = process.env.NODE_ENV === "production";
var configuredLimit = Number(process.env.AUTOMATION_RATE_LIMIT || 30);
var automationRateLimit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? Math.floor(configuredLimit) : 30;
var automationGuard = createDemoAutomationGuard();
var automationLimiter = createFixedWindowRateLimiter(automationRateLimit, 6e4);
var authLimiter = createFixedWindowRateLimiter(12, 6e4);
var publicEnquiryLimiter = createFixedWindowRateLimiter(10, 6e4);
app.use("/api", express.json({ limit: "64kb" }));
var clientKey = (req) => req.socket.remoteAddress || "unknown";
var requireSession = (req) => {
  const session = readSession(req);
  if (!session) throw new LiveStoreError("authentication_required", 401);
  return session;
};
var sendError = (res, error) => {
  if (error instanceof LiveStoreError) return res.status(error.status).json({ error: error.code });
  console.error("[LHL server]", error);
  return res.status(500).json({ error: "server_error" });
};
var safeSecretEqual = (left, right) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto9.timingSafeEqual(a, b);
};
var requireOutboxSecret = (req) => {
  const configured = process.env.LHL_OUTBOX_SECRET?.trim();
  if (!configured) throw new LiveStoreError("live_outbox_not_configured", 503);
  const supplied = req.headers["x-lhl-outbox-secret"];
  if (typeof supplied !== "string" || !safeSecretEqual(supplied, configured)) {
    throw new LiveStoreError("invalid_outbox_secret", 401);
  }
};
var inviteUrl = (token) => {
  const appUrl = process.env.APP_URL?.trim();
  if (!appUrl) throw new LiveStoreError("app_url_not_configured", 503);
  let url;
  try {
    url = new URL("/accept-invite", appUrl);
  } catch {
    throw new LiveStoreError("app_url_invalid", 503);
  }
  url.searchParams.set("token", token);
  return url.toString();
};
var datasetResponse = async (req) => {
  const session = readSession(req);
  const dataset = await loadLiveDataset(session);
  if (!session) {
    dataset.properties = dataset.properties.map((property2) => ({
      ...property2,
      ownerConsentReference: void 0,
      communityAuthorityPartnerId: void 0,
      inventoryBaseline: void 0
    }));
  }
  return dataset;
};
app.post("/api/auth/sign-up", async (req, res) => {
  if (!authLimiter.allow(clientKey(req))) return res.status(429).json({ error: "auth_rate_limited" });
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const bootstrapEmail = process.env.LHL_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  if (!bootstrapEmail || email !== bootstrapEmail) return res.status(403).json({ error: "signup_not_invited" });
  try {
    const identity = await authenticatePassword(email, String(req.body?.password || ""), true);
    const session = setSession(res, identity.uid, identity.email);
    return res.status(201).json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch (error) {
    const code = error instanceof Error ? error.message : "authentication_failed";
    return res.status(400).json({ error: code });
  }
});
app.post("/api/auth/accept-invite", async (req, res) => {
  if (!authLimiter.allow(clientKey(req))) return res.status(429).json({ error: "auth_rate_limited" });
  try {
    const accepted = await acceptPartnerInvite(req.body?.token, req.body?.password);
    const session = setSession(res, accepted.uid, accepted.email);
    return res.status(201).json({ authenticated: true, email: session.email, partner: accepted.partner });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/auth/sign-in", async (req, res) => {
  if (!authLimiter.allow(clientKey(req))) return res.status(429).json({ error: "auth_rate_limited" });
  try {
    const identity = await authenticatePassword(String(req.body?.email || ""), String(req.body?.password || ""), false);
    const session = setSession(res, identity.uid, identity.email);
    return res.json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch {
    return res.status(401).json({ error: "invalid_email_or_password" });
  }
});
app.post("/api/auth/sign-out", (_req, res) => {
  clearSession(res);
  return res.status(204).end();
});
app.get("/api/auth/me", async (req, res) => {
  const session = readSession(req);
  if (!session) return res.json({ authenticated: false, partner: null });
  try {
    return res.json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.get("/api/live/dataset", async (req, res) => {
  try {
    return res.json({ dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/bootstrap/scout", async (req, res) => {
  try {
    const partner = await bootstrapFirstScout(requireSession(req), req.body || {});
    return res.status(201).json({ partner, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.get("/api/live/invites", async (req, res) => {
  try {
    const invites = await listPartnerInvites(requireSession(req));
    return res.json({ invites });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/invites", async (req, res) => {
  try {
    const issued = await issuePartnerInvite(requireSession(req), req.body || {});
    return res.status(201).json({ invite: issued.invite, inviteUrl: inviteUrl(issued.token) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/invites/:id/revoke", async (req, res) => {
  try {
    const invite = await revokePartnerInvite(requireSession(req), req.params.id);
    return res.json({ invite });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/scout/properties", async (req, res) => {
  try {
    const property2 = await createScoutProperty(requireSession(req), req.body || {});
    return res.status(201).json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/owner-consent", async (req, res) => {
  try {
    const property2 = await recordScoutOwnerConsent(requireSession(req), req.params.id, req.body || {});
    return res.json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/assign-owner", async (req, res) => {
  try {
    const session = requireSession(req);
    const dataset = await loadLiveDataset(session);
    const property2 = dataset.properties.find((item) => item.id === req.params.id);
    if (!property2?.ownerConsentReference) throw new LiveStoreError("scout_owner_consent_required", 409);
    const updated = await assignOwnerToProperty(session, req.params.id, {
      ...req.body || {},
      ownerConsentReference: property2.ownerConsentReference
    });
    return res.json({ property: updated, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/assign-operator", async (req, res) => {
  try {
    const property2 = await assignOperatorToProperty(requireSession(req), req.params.id, req.body || {});
    return res.json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/assign-community-authority", async (req, res) => {
  try {
    const property2 = await assignCommunityAuthorityToProperty(requireSession(req), req.params.id, req.body || {});
    return res.json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/schedule-assessment", async (req, res) => {
  try {
    const session = requireSession(req);
    const dataset = await loadLiveDataset(session);
    const property2 = dataset.properties.find((item) => item.id === req.params.id);
    if (property2?.supplyStage === "paused" && dataset.ownerDecisions.some((decision2) => decision2.propertyId === property2.id)) {
      throw new LiveStoreError("owner_decision_pause_cannot_be_reassessed", 409);
    }
    const assessment2 = await schedulePropertyAssessment(session, req.params.id, req.body || {});
    return res.json({ assessment: assessment2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/assessment", async (req, res) => {
  try {
    const assessment2 = await submitPropertyAssessment(requireSession(req), req.params.id, req.body || {});
    return res.json({ assessment: assessment2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/owner-decision", async (req, res) => {
  try {
    const decision2 = await submitPropertyOwnerDecision(requireSession(req), req.params.id, req.body || {});
    return res.json({ decision: decision2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/activate", async (req, res) => {
  try {
    const property2 = await activateLiveProperty(requireSession(req), req.params.id, req.body || {});
    return res.json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/properties/:id/inventory-baseline", async (req, res) => {
  try {
    const property2 = await recordInventoryBaseline(requireSession(req), req.params.id, req.body || {});
    return res.json({ property: property2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/enquiries", async (req, res) => {
  if (!publicEnquiryLimiter.allow(clientKey(req))) return res.status(429).json({ error: "enquiry_rate_limited" });
  try {
    const enquiry2 = await createLiveEnquiry(req.body || {});
    return res.status(201).json({ enquiry: enquiry2 });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/enquiries/:id/readiness", async (req, res) => {
  try {
    const enquiry2 = await recordStayReadiness(requireSession(req), req.params.id, req.body || {});
    return res.json({ enquiry: enquiry2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/enquiries/:id/proofstay/:phase", async (req, res) => {
  try {
    if (req.params.phase !== "pre_stay" && req.params.phase !== "post_stay") throw new LiveStoreError("invalid_proofstay_phase", 400);
    const enquiry2 = await captureProofStaySnapshot(requireSession(req), req.params.id, req.params.phase, req.body || {});
    return res.json({ enquiry: enquiry2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/enquiries/:id/advance", async (req, res) => {
  try {
    const enquiry2 = await advanceLiveEnquiry(requireSession(req), req.params.id, req.body || {});
    return res.json({ enquiry: enquiry2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/live/enquiries/:id/community-approval", async (req, res) => {
  try {
    const enquiry2 = await recordLiveCommunityApproval(requireSession(req), req.params.id, req.body?.evidenceReference);
    return res.json({ enquiry: enquiry2, dataset: await datasetResponse(req) });
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/internal/live-outbox/drain", async (req, res) => {
  try {
    requireOutboxSecret(req);
    const limit = Number(req.body?.limit || 20);
    const result = await drainLiveOutbox(Number.isFinite(limit) ? limit : 20);
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
});
app.post("/api/activepieces", async (req, res) => {
  if (!automationLimiter.allow(clientKey(req))) {
    res.setHeader("retry-after", "60");
    return res.status(429).json({ error: "automation_rate_limited" });
  }
  const webhookUrl = process.env.ACTIVEPIECES_WEBHOOK_URL;
  const sharedSecret = process.env.ACTIVEPIECES_SHARED_SECRET;
  if (!webhookUrl || !sharedSecret) {
    return res.status(503).json({ error: "automation_not_configured" });
  }
  let prepared;
  try {
    prepared = automationGuard.prepare(req.body);
  } catch (error) {
    if (error instanceof AutomationIngressError) {
      return res.status(error.status).json({ error: error.code });
    }
    return res.status(400).json({ error: "invalid_automation_event" });
  }
  let parsedWebhook;
  try {
    parsedWebhook = new URL(webhookUrl);
  } catch {
    return res.status(503).json({ error: "invalid_automation_configuration" });
  }
  const localDev = parsedWebhook.hostname === "localhost" || parsedWebhook.hostname === "127.0.0.1";
  if (parsedWebhook.protocol !== "https:" && !(localDev && parsedWebhook.protocol === "http:")) {
    return res.status(503).json({ error: "webhook_must_use_https" });
  }
  const timestamp = Date.now().toString();
  const body = JSON.stringify(prepared.event);
  const signature = crypto9.createHmac("sha256", sharedSecret).update(`${timestamp}.${body}`).digest("hex");
  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lhl-event-id": prepared.event.id,
        "x-lhl-timestamp": timestamp,
        "x-lhl-signature": `sha256=${signature}`,
        "x-lhl-simulation": "true"
      },
      body,
      signal: AbortSignal.timeout(8e3)
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: "automation_upstream_rejected", status: upstream.status });
    }
    prepared.commit();
    return res.status(202).json({ accepted: true, eventId: prepared.event.id });
  } catch {
    return res.status(502).json({ error: "automation_upstream_unavailable" });
  }
});
if (isProduction) {
  const dist = path.join(process.cwd(), "dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}
app.listen(port, "0.0.0.0", () => {
  console.log(`Little Hut Light listening on :${port}`);
});
