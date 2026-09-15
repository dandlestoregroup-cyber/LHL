import React, { useMemo } from 'react';
import { 
  ComposedDigitalGuestbook, 
  ComposedGuestbookModule 
} from '../../data/guestbookData';
import { 
  Wifi, 
  Key, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Car, 
  Compass, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Check, 
  Copy, 
  ChevronRight, 
  Info, 
  Waves, 
  Coffee, 
  Sun, 
  Heart, 
  VolumeX, 
  ExternalLink,
  Star,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';

interface DigitalGuestbookProps {
  guestbook: ComposedDigitalGuestbook;
  lang: 'en' | 'ar';
  isRTL: boolean;
}

export const DigitalGuestbook: React.FC<DigitalGuestbookProps> = ({ guestbook, lang, isRTL }) => {
  const { property, compound, hostContact, composedModules } = guestbook;

  return (
    <div className="bg-[#FAF5EE] min-h-screen font-sans text-[#2A201C] selection:bg-[#B84E36] selection:text-white">
      {/* Editorial Header */}
      <header className="relative h-[70vh] md:h-[80vh] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={property.heroImage} 
            alt={property.name}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A201C] via-[#2A201C]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#B84E36] text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-xs shadow-lg">
                Little Hut Verified
              </span>
              <span className="text-[#DECBB9] text-[10px] font-mono uppercase tracking-widest">
                {compound.region}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-serif text-white leading-none tracking-tight">
              {lang === 'ar' ? property.nameAr : property.name}
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-[#DECBB9] font-light leading-relaxed">
              {lang === 'ar' 
                ? `مرحباً بك في ${property.nameAr}. دليلنا الرقمي التفاعلي مُعد خصيصاً ليرافق إقامتك الاستثنائية.`
                : `Welcome to ${property.name}. A curated digital experience designed for your unhurried stay.`}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4 text-[#F5C767]" />
                <span className="text-xs font-mono uppercase tracking-wider">{guestbook.checkInTime} Check-in</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 text-[#B84E36]" />
                <span className="text-xs font-mono uppercase tracking-wider">{property.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content Modules */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-32">
        {composedModules.map((module, idx) => (
          <GuestbookModuleRenderer 
            key={module.id} 
            module={module} 
            guestbook={guestbook}
            lang={lang}
            isRTL={isRTL}
          />
        ))}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-[#2A201C] text-[#FAF5EE] py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif mb-4">Little Hut</h2>
            <p className="text-[#7E6C60] text-sm max-w-xs">
              Curating the world's most evocative architectural sanctuaries.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[#DECBB9] hover:text-white transition-colors uppercase text-[10px] tracking-widest font-mono">Journal</a>
            <a href="#" className="text-[#DECBB9] hover:text-white transition-colors uppercase text-[10px] tracking-widest font-mono">Standards</a>
            <a href="#" className="text-[#DECBB9] hover:text-white transition-colors uppercase text-[10px] tracking-widest font-mono">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const GuestbookModuleRenderer: React.FC<{
  module: ComposedGuestbookModule;
  guestbook: ComposedDigitalGuestbook;
  lang: 'en' | 'ar';
  isRTL: boolean;
}> = ({ module, guestbook, lang, isRTL }) => {
  const { lifestyleAssets } = module;

  return (
    <section id={module.id} className="space-y-12">
      {/* Lifestyle Injection (Editorial Hero for Section) */}
      {lifestyleAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${isRTL ? 'order-2' : ''}`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B84E36]">
              {lang === 'ar' ? lifestyleAssets[0].badgeAr : lifestyleAssets[0].badge}
            </span>
            <h3 className="text-4xl md:text-5xl font-serif leading-tight">
              {lang === 'ar' ? lifestyleAssets[0].titleAr : lifestyleAssets[0].title}
            </h3>
            <p className="text-lg text-[#5C4B40] font-light leading-relaxed">
              {lang === 'ar' ? lifestyleAssets[0].captionAr : lifestyleAssets[0].caption}
            </p>
          </div>
          <div className="aspect-[4/5] md:aspect-square overflow-hidden rounded-sm shadow-2xl">
            <img 
              src={lifestyleAssets[0].imageUrl} 
              alt={lifestyleAssets[0].title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      )}

      {/* Module Content */}
      <div className="bg-white border border-[#EBDDD1] p-8 md:p-16 rounded-sm shadow-sm">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2A201C]">
            {lang === 'ar' ? module.titleAr : module.title}
          </h2>
          <div className="h-px bg-[#EBDDD1] flex-grow" />
        </div>

        {module.type === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-[#5C4B40] leading-relaxed">
                {lang === 'ar' 
                  ? `أهلاً بك يا ${guestbook.guestName}. لقد قمنا بتجهيز هذا المسكن بعناية فائقة لتوفير تجربة غامرة تعيد لك توازنك.`
                  : `Welcome, ${guestbook.guestName}. We've prepared this residence with meticulous care to ensure a restorative and immersive experience.`}
              </p>
              <div className="flex items-center gap-4 pt-6">
                <img 
                  src={guestbook.hostContact.avatarUrl} 
                  alt={guestbook.hostContact.name} 
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-[#FAF5EE]"
                />
                <div>
                  <h4 className="font-bold text-[#2A201C]">{guestbook.hostContact.name}</h4>
                  <p className="text-xs text-[#7E6C60]">{lang === 'ar' ? guestbook.hostContact.roleAr : guestbook.hostContact.role}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF5EE] p-8 rounded-sm border border-[#EBDDD1] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-[#B84E36]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Connectivity</span>
                </div>
                <span className="text-[10px] font-mono bg-[#B84E36]/10 text-[#B84E36] px-2 py-1 rounded-full">{guestbook.wifiSpeedMbps} Mbps</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7E6C60]">Network</span>
                  <span className="text-sm font-mono font-bold">{guestbook.wifiSsid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7E6C60]">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold bg-white px-2 py-1 rounded border border-[#EBDDD1]">{guestbook.wifiPass}</span>
                    <Copy className="w-4 h-4 text-[#B84E36] cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {module.type === 'essentials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#B84E36]">
                <Key className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-widest">Access</h4>
              </div>
              <p className="text-sm text-[#5C4B40] leading-relaxed">
                {lang === 'ar' ? guestbook.compound.gateAccessProtocol.instructionsAr : guestbook.compound.gateAccessProtocol.instructions}
              </p>
              <div className="text-[10px] font-mono p-3 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xs">
                {lang === 'ar' ? 'رمز القفل الذكي: ' : 'Smart Lock Code: '}
                <span className="font-bold text-[#B84E36]">{guestbook.smartLockCode}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#B84E36]">
                <Clock className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-widest">Timing</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF5EE] p-3 rounded-xs text-center">
                  <span className="text-[9px] uppercase text-[#7E6C60] block">In</span>
                  <span className="text-sm font-bold">{guestbook.checkInTime}</span>
                </div>
                <div className="bg-[#FAF5EE] p-3 rounded-xs text-center">
                  <span className="text-[9px] uppercase text-[#7E6C60] block">Out</span>
                  <span className="text-sm font-bold">{guestbook.checkOutTime}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#B84E36]">
                <Car className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-widest">Parking</h4>
              </div>
              <p className="text-sm text-[#5C4B40] leading-relaxed">
                {guestbook.parkingSpot}
              </p>
            </div>
          </div>
        )}

        {module.type === 'moments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guestbook.provenMomentsNotes.map((moment, i) => (
              <div key={i} className="group p-8 bg-[#FAF5EE] rounded-sm border border-[#EBDDD1] hover:border-[#B84E36] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <Sparkles className="w-6 h-6 text-[#B84E36]" />
                  <span className="text-[10px] font-mono text-[#7E6C60]">{moment.idealTimeWindow}</span>
                </div>
                <h4 className="text-2xl font-serif mb-4">{lang === 'ar' ? moment.nameAr : moment.name}</h4>
                <p className="text-sm text-[#5C4B40] leading-relaxed mb-6">
                  {lang === 'ar' ? moment.whereToExperienceAr : moment.whereToExperience}
                </p>
                <div className="text-[10px] font-mono text-[#6E7C62] uppercase tracking-wider pt-4 border-t border-[#EBDDD1]">
                  {moment.bpsVerifiedMetric}
                </div>
              </div>
            ))}
          </div>
        )}

        {module.type === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {guestbook.homeAppliances.map((app, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 bg-[#FAF5EE] rounded-full flex items-center justify-center shrink-0 border border-[#EBDDD1]">
                  <Coffee className="w-5 h-5 text-[#B84E36]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#2A201C]">{lang === 'ar' ? app.titleAr : app.title}</h4>
                  <p className="text-xs text-[#5C4B40] leading-relaxed">{lang === 'ar' ? app.instructionAr : app.instruction}</p>
                  <div className="text-[11px] italic text-[#B84E36] pt-2">
                    Tip: {lang === 'ar' ? app.quickTipAr : app.quickTip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {module.type === 'local' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guestbook.scoutRecommendations.map((rec, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-[#EBDDD1] rounded-xs mb-4 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=600`} 
                      alt={rec.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#B84E36]">
                    <span>{rec.category}</span>
                    <span>{rec.distance}</span>
                  </div>
                  <h4 className="font-bold text-sm">{lang === 'ar' ? rec.titleAr : rec.title}</h4>
                  <p className="text-xs text-[#5C4B40] leading-relaxed">{lang === 'ar' ? rec.descriptionAr : rec.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#2A201C] p-8 rounded-sm text-white">
              <h4 className="font-serif text-xl mb-4">Compound Rules & Courtesies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-mono text-[#DECBB9] uppercase tracking-widest">Quiet Hours</h5>
                  <p className="text-sm leading-relaxed text-[#DECBB9]">
                    {lang === 'ar' ? guestbook.compound.quietHours.descriptionAr : guestbook.compound.quietHours.description}
                  </p>
                  <div className="text-xl font-serif text-[#F5C767]">
                    {guestbook.compound.quietHours.start} – {guestbook.compound.quietHours.end}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-mono text-[#DECBB9] uppercase tracking-widest">Core Rules</h5>
                  <ul className="space-y-2">
                    {guestbook.compound.compoundRules.map((rule, i) => (
                      <li key={i} className="text-xs flex gap-3 text-[#DECBB9]">
                        <span className="text-[#B84E36] mt-0.5">•</span>
                        {lang === 'ar' ? rule.ruleAr : rule.rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {module.type === 'rules' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-center text-[#5C4B40] text-sm">
              To preserve the sanctuary experience for all, we kindly ask you to observe these house rules.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: VolumeX, title: 'No Loud Music', desc: 'Maintain acoustic silence, especially on terraces.' },
                { icon: Home, title: 'No Smoking', desc: 'Indoors is strictly smoke-free to preserve air quality.' },
                { icon: Sparkles, title: 'Spotless Standard', desc: 'Report any issues immediately to our on-site team.' },
                { icon: Clock, title: 'Respect Checkout', desc: 'Standard checkout is 11:00 AM for deep sanitization.' },
              ].map((rule, i) => (
                <div key={i} className="flex gap-4 p-6 bg-[#FAF5EE] rounded-xs">
                  <rule.icon className="w-6 h-6 text-[#B84E36] shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm mb-1">{rule.title}</h5>
                    <p className="text-xs text-[#5C4B40]">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {module.type === 'contacts' && (
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="space-y-6 max-w-md">
              <h4 className="text-3xl font-serif">We're here to help.</h4>
              <p className="text-sm text-[#5C4B40] leading-relaxed">
                Whether you need an extra set of linens, help with the espresso machine, or local dining reservations, our team is a tap away.
              </p>
              <div className="flex gap-4">
                <a 
                  href={`tel:${guestbook.hostContact.phone}`} 
                  className="px-6 py-3 bg-[#2A201C] text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#1D1613] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call Host
                </a>
                <a 
                  href={guestbook.hostContact.whatsappUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#20bd5a] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="w-full md:w-96 bg-[#FAF5EE] p-8 rounded-sm border border-[#EBDDD1] space-y-6">
              <h5 className="text-[10px] font-mono text-[#B84E36] uppercase tracking-widest font-bold">Emergency Contacts</h5>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span>Compound Security</span>
                  <span className="font-mono font-bold">{guestbook.compound.gateAccessProtocol.securityPhone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Local Clinic</span>
                  <span className="font-mono font-bold">+20 120 000 1969</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Police / Ambulance</span>
                  <span className="font-mono font-bold">122 / 123</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {module.type === 'checkout' && (
          <div className="bg-[#FAF0EB] p-8 md:p-12 rounded-sm text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="text-3xl font-serif text-[#B84E36]">Leaving Your Sanctuary</h4>
              <p className="text-sm text-[#5C4B40]">
                We hope your stay has been restorative. As you prepare to leave, please follow these simple steps to ensure a smooth transition for the next guest.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-widest">1. Seal the Space</h5>
                <p className="text-xs text-[#5C4B40]">Close all windows and terrace doors. Turn off the AC units and interior lights.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-widest">2. Final Departure</h5>
                <p className="text-xs text-[#5C4B40]">Pull the door shut and press '#' on the smart lock keypad to verify the seal.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-widest">3. Share the Love</h5>
                <p className="text-xs text-[#5C4B40]">Leave a note in the guestbook memories to inspire the next traveler.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
