
import React, { useState } from 'react';
import { AppState } from '../types';

interface OffersProps {
  state: AppState;
  onBack: () => void;
  onNavigate: (screen: AppState['currentScreen']) => void;
}

const OffersScreen: React.FC<OffersProps> = ({ state, onBack, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const t = {
    ENG: {
      header: 'Student Perks',
      welcome: 'Ready to save?',
      saved: 'TOTAL MONEY SAVED',
      thisWeek: 'this week',
      categories: ['All', 'Tech', 'Fashion', 'Music', 'Food'],
      dailyDeal: 'FEATURED UNiDAYS DEALS',
      viewAll: 'VIEW ALL',
      trending: 'TRENDING FOR STUDENTS',
      location: 'VERIFIED FOR YOUR UNIVERSITY',
      save: 'SAVE',
      askGuru: 'Ask Guru'
    },
    HIN: {
      header: 'स्टूडेंट ऑफर्स',
      welcome: 'बचत के लिए तैयार?',
      saved: 'कुल बचत राशि',
      thisWeek: 'इस सप्ताह',
      categories: ['सभी', 'टेक', 'फैशन', 'म्यूजिक', 'खाना'],
      dailyDeal: 'आज की खास डील्स',
      viewAll: 'सब देखें',
      trending: 'छात्रों के बीच लोकप्रिय',
      location: 'आपकी यूनिवर्सिटी के लिए सत्यापित',
      save: 'बचत',
      askGuru: 'गुरु से पूछें'
    }
  }[state.language];

  const categories = [
    { label: 'All', icon: 'grid_view' },
    { label: 'Tech', icon: 'laptop_mac' },
    { label: 'Fashion', icon: 'checkroom' },
    { label: 'Music', icon: 'headphones' },
    { label: 'Food', icon: 'lunch_dining' },
  ];

  const featuredDeals = [
    {
      title: 'Apple Education',
      desc: 'Save up to ₹10,000 on Mac and iPad for Uni.',
      save: '₹10K',
      category: 'EDUCATION STORE',
      icon: 'school',
      url: 'https://www.apple.com/in/shop/education-pricing',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Adobe Creative Cloud',
      desc: 'Get 60% off on 20+ creative apps.',
      save: '60% OFF',
      category: 'DESIGN TOOLS',
      icon: 'palette',
      url: 'https://www.adobe.com/creativecloud/plans.html?plan=edu',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const brandGrid = [
    { 
      merchant: 'Nike', 
      offer: 'Flat 10% Student Discount', 
      save: '₹800+', 
      badge: '-10%', 
      category: 'Fashion',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', 
      url: 'https://www.nike.com/in/student-discount',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      merchant: 'Spotify', 
      offer: 'Premium Student @ ₹59/mo', 
      save: '₹60/mo', 
      badge: '50% Off', 
      category: 'Music',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', 
      url: 'https://www.spotify.com/in-en/student/',
      img: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      merchant: 'Levi\'s', 
      offer: 'Flat 15% off for Students', 
      save: '₹500+', 
      badge: 'Sale', 
      category: 'Fashion',
      logo: 'https://static.brandirectory.com/logos/levis_logo.png', 
      url: 'https://www.levi.in/student-discount',
      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      merchant: 'Samsung', 
      offer: 'Up to 30% off on Mobiles', 
      save: '₹5000+', 
      badge: '30%', 
      category: 'Tech',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 
      url: 'https://www.samsung.com/in/microsite/student-advantage/',
      img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      merchant: 'Zomato', 
      offer: 'Free Delivery for Students', 
      save: '₹40/order', 
      badge: 'Free', 
      category: 'Food',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg', 
      url: 'https://www.zomato.com',
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400' 
    },
  ];

  const filteredBrands = selectedCategory === 'All' 
    ? brandGrid 
    : brandGrid.filter(b => b.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto no-scrollbar pb-40 transition-colors">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            {state.user.avatar ? (
              <img src={state.user.avatar} className="size-11 rounded-full border-2 border-primary ring-4 ring-primary/10 object-cover" alt="Profile" />
            ) : (
              <div className="size-11 rounded-full bg-white border-2 border-primary ring-4 ring-primary/10"></div>
            )}
            <div className="absolute -top-1 -right-1 bg-primary text-background-dark size-5 rounded-full flex items-center justify-center border-2 border-black">
              <span className="material-symbols-outlined text-[10px] font-black">verified</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-black leading-tight tracking-tight">{t.header}</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t.welcome}, {state.user.name}</p>
          </div>
        </div>
        <button onClick={onBack} className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/60">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="space-y-8 pt-6 px-5 md:px-8">
        {/* Savings Tracker Card */}
        <div>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0c0c0c] p-6 md:p-8 border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.saved}</p>
                <div className="flex flex-col gap-2">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">₹0</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-wise bg-wise/10 px-3 py-1 rounded-full border border-wise/20 uppercase tracking-widest">+ ₹0 {t.thisWeek}</span>
                  </div>
                </div>
              </div>
              <div className="size-14 md:size-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                <span className="material-symbols-outlined text-3xl md:text-4xl">confirmation_number</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button 
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex shrink-0 items-center justify-center gap-x-2 rounded-2xl px-5 py-3.5 transition-all active:scale-95 border cursor-pointer ${selectedCategory === cat.label ? 'bg-primary border-primary text-background-dark font-black shadow-lg shadow-primary/20' : 'bg-[#121212] border-white/10 text-white/70 hover:bg-[#1a1a1a]'}`}
            >
              <span className={`material-symbols-outlined text-lg ${selectedCategory === cat.label ? 'text-background-dark' : 'text-white/60'}`}>{cat.icon}</span>
              <p className="text-xs uppercase tracking-[0.1em] font-black">{cat.label}</p>
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-base font-black uppercase tracking-[0.1em]">{t.dailyDeal}</h2>
            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">{t.viewAll}</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar pb-4 gap-5">
            {featuredDeals.map(deal => (
              <a 
                key={deal.title} 
                href={deal.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%] block relative rounded-[2.5rem] overflow-hidden aspect-[16/10] group shadow-2xl border border-white/10"
              >
                <img src={deal.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 brightness-[0.7]" alt={deal.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">{deal.icon}</span>
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.15em]">{deal.category}</span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-white text-xl md:text-2xl font-black tracking-tight flex-1">{deal.title}</h3>
                    <div className="bg-primary text-background-dark px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                      {t.save} {deal.save}
                    </div>
                  </div>
                  <p className="text-white/60 text-[13px] font-medium leading-relaxed line-clamp-1">{deal.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="flex flex-col gap-6 pb-20">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-base font-black uppercase tracking-[0.1em]">{t.trending}</h2>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">{t.location}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {filteredBrands.map(n => (
              <a 
                key={n.merchant} 
                href={n.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-[#0c0c0c] border border-white/5 rounded-[2rem] p-4 flex flex-col gap-4 active:scale-[0.98] transition-all hover:bg-white/5 shadow-xl overflow-hidden"
              >
                <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden">
                  <img src={n.img} className="absolute inset-0 w-full h-full object-cover brightness-[0.8] group-hover:scale-110 transition-transform duration-700" alt={n.merchant} />
                  <div className="absolute top-3 right-3 bg-white rounded-xl p-2 shadow-2xl flex items-center justify-center">
                    <img src={n.logo} className="size-5 object-contain" alt="Logo" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-black text-sm">{n.merchant}</h4>
                    <span className="text-[9px] bg-primary text-background-dark px-2 py-0.5 rounded-lg font-black">{n.badge}</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 leading-tight">{n.offer}</p>
                  <div className="flex items-center gap-1.5 py-1.5 px-3 bg-wise/10 rounded-xl border border-wise/10 w-fit">
                    <span className="material-symbols-outlined text-[12px] text-wise">verified</span>
                    <span className="text-[9px] font-black text-wise uppercase tracking-widest">{t.save} {n.save}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Robot Guru Button on Mobile */}
      <div className="md:hidden fixed bottom-28 right-5 z-40">
        <button 
          onClick={() => onNavigate('chat')}
          className="bg-[#0c0c0c] border border-primary/20 text-primary rounded-full size-16 shadow-[0_0_30px_rgba(208,187,149,0.1)] flex items-center justify-center transition-all hover:scale-110 active:scale-90"
        >
          <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-black">smart_toy</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default OffersScreen;
