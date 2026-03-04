/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronRight, Truck, ShieldCheck, Bookmark, Play, ArrowUp, X } from 'lucide-react';
import Header from './components/Header';
import BottomBar from './components/BottomBar';
import FlashSaleBanner from './components/FlashSaleBanner';
import Checkout from './components/Checkout';
import VariationModal from './components/VariationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('Visão geral');
  const [isShippingFree, setIsShippingFree] = useState(false);
  const [isCouponRedeemed, setIsCouponRedeemed] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('23:59:58');
  const [selection, setSelection] = useState<any>(null);

  const productData = {
    name: "Tênis Olympikus Corre Supra 2",
    currentPrice: 89.90,
    originalPrice: 699.90,
    images: [
      'https://i.ibb.co/Df3VSn2d/image.png',
      'https://i.ibb.co/F4DDWfXV/image.png',
      'https://i.ibb.co/B5jqCn4Q/image.png',
      'https://i.ibb.co/BKTrBDc9/image.png',
      'https://i.ibb.co/DHm9xrBS/image.png',
      'https://i.ibb.co/11vhrVj/image.png',
      'https://i.ibb.co/60r6T9rH/image.png',
      'https://i.ibb.co/1fC9Zrzq/image.png',
      'https://i.ibb.co/PRQmJMv/image.png',
      'https://i.ibb.co/tM7XxNkY/image.png',
      'https://i.ibb.co/PzvSY6mC/image.png',
      'https://i.ibb.co/xtj7FXHQ/image.png',
      'https://i.ibb.co/s9h5XSfZ/image.png',
      'https://i.ibb.co/bjFqxd3n/image.png'
    ]
  };

  const overviewRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    let targetRef;
    switch (tab) {
      case 'Visão geral': targetRef = overviewRef; break;
      case 'Avaliações': targetRef = reviewsRef; break;
      case 'Descrição': targetRef = descriptionRef; break;
    }
    
    if (targetRef?.current) {
      const headerOffset = 88; // Header + Tabs height
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleRedeem = () => {
    setIsCouponRedeemed(true);
    setIsShippingFree(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const productImages = productData.images;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width) + 1;
    setCurrentImageIndex(index);
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F5] pb-20 font-sans text-[#222222] ${showPopup ? 'overflow-hidden h-screen' : ''}`}>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPopup(false)} />
          
          <div className="relative w-full max-w-[280px] animate-in fade-in zoom-in duration-200">
            {/* Header with Yellow Text and Red X */}
            <div className="flex items-center justify-center relative mb-2.5">
              <h2 className="text-[#FFD700] font-black text-[13px] tracking-tight text-center drop-shadow-sm">
                OFERTA EXCLUSIVA PARA VOCÊ
              </h2>
              <button 
                onClick={() => setShowPopup(false)} 
                className="absolute -right-1 text-[#F4435D] hover:opacity-80 transition-opacity"
              >
                <X className="w-6 h-6" strokeWidth={3} />
              </button>
            </div>

            {/* Main Card */}
            <div className="w-full bg-[#F4435D] rounded-[22px] overflow-hidden shadow-2xl">
              {/* White Top Section with Curved Bottom */}
              <div className="relative bg-white pt-7 pb-4 px-5 text-center border-x-[6px] border-[#F4435D]">
                <h3 className="text-[42px] font-black text-[#222222] leading-none tracking-tighter mb-2">
                  70% OFF
                </h3>
                <p className="text-[#F4435D] font-bold text-[18px] mb-4">
                  no seu pedido!
                </p>
                
                <div className="space-y-0.5 text-[12px] text-[#222222] font-semibold leading-tight mb-6">
                  <p>Garanta agora os melhores</p>
                  <p>produtos com desconto real.</p>
                  <p>Aproveite: estoque limitado com 70% OFF.</p>
                </div>

                {/* The Convex Curve at the bottom of white section */}
                <div 
                  className="absolute -bottom-4 left-[-6px] right-[-6px] h-8 bg-white border-x-[6px] border-[#F4435D] rounded-b-[50%]"
                />
              </div>

              {/* Red/Pink Bottom Section */}
              <div className="pt-7 pb-5 px-5 flex flex-col items-center gap-4">
                {/* Timer Box */}
                <div className="bg-[#D81B60] text-white text-[13px] font-bold px-7 py-2 rounded-[8px] shadow-md">
                  Termina em {timeLeft}
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={() => setShowPopup(false)}
                  className="bg-white text-[#F4435D] w-full py-3 rounded-full font-black text-[16px] shadow-lg active:scale-[0.98] transition-transform"
                >
                  Resgatar agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />
      
      <main className="pt-11" ref={overviewRef}>
        {/* Product Image Carousel */}
        <div className="relative aspect-square bg-white overflow-hidden">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full"
            onScroll={handleScroll}
          >
            {productImages.map((src, i) => (
              <div key={i} className="min-w-full h-full snap-center">
                <img 
                  src={src} 
                  alt={`Product ${i + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 right-3 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {currentImageIndex}/{productImages.length}
          </div>
        </div>

        <FlashSaleBanner 
          currentPrice={productData.currentPrice} 
          originalPrice={productData.originalPrice} 
          timeLeft={timeLeft}
        />

        {/* Product Info Section */}
        <section className="bg-white px-3 py-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#FFEEEB] px-1.5 py-0.5 rounded-[1px]">
              <Truck className="w-3 h-3 text-[#EE4D2D]" />
              <span className="text-[11px] text-[#EE4D2D] font-bold">
                2x R$ {(productData.currentPrice / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sem juros
              </span>
              <ChevronRight className="w-3 h-3 text-[#EE4D2D]" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#FFEEEB] px-2 py-1 rounded-[1px]">
            <span className="text-[#EE4D2D] text-[11px] font-bold">Economize 3% com bônus</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#EE4D2D]" />
          </div>

          <div className="flex justify-between items-start gap-4">
            <h1 className="text-[14px] font-medium leading-[1.3] text-[#222222] line-clamp-2">
              Tênis Olympikus Corre Supra 2
            </h1>
            <button className="pt-0.5">
              <Bookmark className="w-5 h-5 text-[#888888]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-[#EE4D2D] text-[#EE4D2D]" />
              <span className="text-[13px] font-bold text-[#EE4D2D] underline underline-offset-2">5.0</span>
              <span className="text-[11px] text-[#888888] ml-0.5">(3)</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-200" />
            <span className="text-[12px] text-[#555555]">34 vendidos</span>
          </div>
        </section>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scrollbar sticky top-11 z-40">
          {['Visão geral', 'Avaliações', 'Descrição'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => scrollToSection(tab)}
              className={`px-4 py-2.5 text-[13px] whitespace-nowrap relative ${activeTab === tab ? 'text-[#EE4D2D] font-bold' : 'text-[#555555]'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#EE4D2D]" />}
            </button>
          ))}
        </div>

        {/* Shipping Section */}
        <section className="bg-white mt-1.5 px-3 py-3 space-y-3">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#00BFA5] mt-0.5" strokeWidth={1.5} />
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[13px] font-bold ${isShippingFree ? 'text-[#00BFA5]' : 'text-[#222222]'}`}>
                    {isShippingFree ? 'Frete grátis' : 'R$ 8,93'}
                  </span>
                  <span className="text-[11px] text-[#555555]">Receba em até 2 a 4 dias</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#888888]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#888888]">Taxa de envio: </span>
                <span className={`text-[11px] text-[#888888] ${isShippingFree ? 'line-through' : ''}`}>R$ 8,93</span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setIsVariationModalOpen(true)}
            className="border-t border-gray-50 pt-3 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {[
                  'https://i.ibb.co/Df3VSn2d/image.png',
                  'https://i.ibb.co/F4DDWfXV/image.png',
                  'https://i.ibb.co/B5jqCn4Q/image.png',
                  'https://i.ibb.co/BKTrBDc9/image.png'
                ].map((img, i) => (
                  <div key={i} className="w-9 h-9 border border-white rounded-[2px] overflow-hidden bg-gray-50">
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <span className="text-[12px] text-[#222222]">19 opções disponíveis</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </div>
        </section>

        {/* Protection Section */}
        <section className="bg-white mt-1.5 px-3 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF7A38]" strokeWidth={1.5} />
              <span className="text-[13px] font-bold">Proteção do cliente</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              'Devolução gratuita',
              'Reembolso automático por danos',
              'Pagamento seguro',
              'Reembolso automático por atraso'
            ].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="text-[#EE4D2D] text-[10px] font-black">✓</span>
                <span className="text-[11px] text-[#555555] truncate">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Coupons Section */}
        <section className="bg-white mt-1.5 px-3 py-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold">Ofertas</span>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[1, 2].map(i => (
              <div key={i} className="min-w-[240px] border border-[#00BFA5]/20 rounded-[2px] p-2 flex items-center justify-between bg-[#F6FFFE]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-[#222222]">Cupom de envio</span>
                    <span className="bg-[#00BFA5] text-white text-[9px] px-1 rounded-[1px] font-black">x3</span>
                  </div>
                  <p className="text-[9px] text-[#555555] leading-tight">Desconto de R$ 10 no frete em pedidos acima de R$ 9</p>
                </div>
                <button 
                  onClick={handleRedeem}
                  disabled={isCouponRedeemed}
                  className={`${isCouponRedeemed ? 'bg-gray-400' : 'bg-[#00BFA5]'} text-white text-[10px] px-2 py-1 rounded-[2px] font-bold ml-2 transition-colors`}
                >
                  {isCouponRedeemed ? 'Resgatado' : 'Resgatar'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section className="bg-white mt-1.5 px-3 py-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold">Vídeos de criadores (3)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                url: 'https://res.cloudinary.com/dgokajcvg/video/upload/v1772036626/video_699bead8cdcf07.10508756_ml7phf.mp4',
                title: 'Unboxing do tênis mais leve do ano!'
              },
              {
                url: 'https://res.cloudinary.com/dgokajcvg/video/upload/v1772036619/video_699bead8cf0d19.78578178_taaxpm.mp4',
                title: 'Teste de impacto: amortecimento 10'
              },
              {
                url: 'https://res.cloudinary.com/dgokajcvg/video/upload/v1772036620/video_699bead8cbde97.47519552_x6zrxi.mp4',
                title: 'Minha escolha para maratonas'
              }
            ].map((video, i) => (
              <div key={i} className="relative aspect-[9/16] rounded-[4px] overflow-hidden bg-black">
                <video 
                  src={video.url} 
                  className="w-full h-full object-cover opacity-80"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 pointer-events-none">
                  <p className="text-[9px] text-white font-bold line-clamp-2 leading-tight drop-shadow-lg">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section ref={reviewsRef} className="bg-white mt-1.5 px-3 py-3 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold">Avaliações dos clientes (25)</span>
            <button className="text-[12px] text-[#EE4D2D] font-medium flex items-center gap-0.5">
              Ver mais <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold">4.4</span>
            <span className="text-[11px] text-[#888888]">/5</span>
            <div className="flex items-center gap-0.5 ml-1">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />)}
              <Star className="w-3 h-3 text-gray-200" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full border border-[#888888] flex items-center justify-center ml-1">
              <span className="text-[8px] text-[#888888] font-black">i</span>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { 
                user: 'C**la B.', 
                comment: 'Muito leve e confortável para correr. O amortecimento é excelente! Chegou muito bem embalado.', 
                images: [
                  'https://i.ibb.co/2Y0BLg2B/image.png'
                ] 
              },
              { 
                user: 'A**a M.', 
                comment: 'É perfeito! Apenas comprem. O tênis é lindo e parece ser bem durável, ótimo para treinos.', 
                images: [
                  'https://i.ibb.co/3m3xKXKS/image.png'
                ] 
              },
              { 
                user: 'M**a S.', 
                comment: 'Melhor custo-benefício que já encontrei. Perfeito para meus treinos diários e corridas longas.', 
                images: [
                  'https://i.ibb.co/7JpvRxxz/image.png',
                  'https://i.ibb.co/xtx3mYnv/image.png',
                  'https://i.ibb.co/5pstv5v/image.png'
                ] 
              },
              { 
                user: 'J**a P.', 
                comment: 'A cor é vibrante e o ajuste no pé é perfeito. Recomendo muito para quem busca performance.', 
                images: [
                  'https://i.ibb.co/XfKSsg21/image.png'
                ] 
              },
              { 
                user: 'R**a L.', 
                comment: 'Surpreso com a qualidade. Muito estável e seguro para corridas de rua. Vale muito a pena!', 
                images: [
                  'https://i.ibb.co/cSRKygBY/image.png'
                ] 
              }
            ].map((review, i) => {
              const profilePics = [
                'https://randomuser.me/api/portraits/women/65.jpg',
                'https://randomuser.me/api/portraits/women/44.jpg',
                'https://randomuser.me/api/portraits/women/68.jpg',
                'https://randomuser.me/api/portraits/women/50.jpg',
                'https://randomuser.me/api/portraits/women/75.jpg'
              ];
              return (
                <div key={i} className="space-y-2 pb-1 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                      <img src={profilePics[i]} referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[12px] font-medium text-[#222222]">{review.user}</span>
                  </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-2.5 h-2.5 fill-[#FFC107] text-[#FFC107]" />)}
                </div>
                <p className="text-[11px] text-[#888888]">Item: none</p>
                <p className="text-[13px] text-[#222222] leading-relaxed">{review.comment}</p>
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {review.images.map((src, imgIdx) => (
                    <div key={imgIdx} className="relative w-[82px] h-[82px] flex-shrink-0 rounded-[2px] overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={src} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

          <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
            <span className="text-[13px] font-bold">Avaliações da loja (61 mil)</span>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1 bg-white rounded-[2px] py-2 px-3 flex items-center justify-center gap-2 border border-gray-200">
              <div className="w-4 h-4 rounded-full border border-[#888888] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#888888] rounded-full" />
              </div>
              <span className="text-[11px] text-[#555555] font-medium">Inclui imagens ou vídeos (7 mil)</span>
            </div>
            <div className="bg-white rounded-[2px] py-2 px-3 flex items-center justify-center gap-1 border border-gray-200">
              <span className="text-[11px] text-[#555555] font-bold">5</span>
              <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
              <span className="text-[11px] text-[#555555] font-medium">(43,2 mil)</span>
            </div>
          </div>
        </section>

        {/* Store Section */}
        <section className="bg-white mt-2 px-3 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[2px] border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50">
                <img src="https://i.ibb.co/LD8kgv7x/image.png" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#222222]">Olympikus Corrida</h3>
                <p className="text-[11px] text-[#888888]">329.2K vendido(s)</p>
              </div>
            </div>
            <button className="border border-[#EE4D2D] text-[#EE4D2D] px-4 py-1 rounded-[2px] text-[12px] font-bold">
              Visitar
            </button>
          </div>
          <div className="flex items-center gap-8 text-[11px] border-b border-gray-50 pb-4">
            <div className="flex gap-1.5">
              <span className="font-black text-[#EE4D2D]">70%</span>
              <span className="text-[#555555]">responde em 24 horas</span>
            </div>
            <div className="flex gap-1.5">
              <span className="font-black text-[#EE4D2D]">96%</span>
              <span className="text-[#555555]">envios pontuais</span>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section ref={descriptionRef} className="bg-white mt-2 px-3 py-5 space-y-5">
          <h2 className="text-[13px] font-black uppercase tracking-tight text-[#222222]">Sobre este produto</h2>
          <div className="space-y-6 text-[12px] leading-relaxed text-[#555555]">
          

            <div className="space-y-3">
              <ul className="space-y-3">
                Ouvimos os corredores brasileiros e entendemos as maiores necessidades na hora de aumentar o desempenho. Foi assim que chegamos ao novo calçado favorito das competições. Com ainda mais tecnologia, esse lançamento une conforto, leveza e resiliência para acompanhar você em qualquer prova. NT-X PRO 2.0 Entressola superior em PEBA expandido com Nitrogênio (SFC), garantindo nível máximo de amortecimento, além de alta resiliência, baixa deformação e extrema leveza. CARBON G Revestida com grafeno, a placa de carbono é desenvolvida com fibras contínuas e bidirecionais para impulsionar a sua corrida, sem comprometer a estabilidade. Sua nova geometria também oferece rigidez elevada para maximizar o desempenho. BORRACHA COCRIADA COM A MICHELIN Tecnologia exclusiva que proporciona maior aderência e reduz o desgaste do calçado. OXITEC 4.0 Tela no cabedal que permite maior respirabilidade e resistência, com aplicações de ETPU frequenciado em toda gáspea. PUXADOR Detalhe em fita para facilitar o calce. PALMILHA NT-X Super leve, apresenta um alto retorno de energia e permite a circulação do ar, garantindo conforto redobrado. FORRO Uma mescla de poliéster e elastano que confere durabilidade e flexibilidade ao tênis. ATACADOR APRIMORADO Funcionalidade que deixa a amarração ajustada precisamente ao seu pé, oferecendo segurança ao longo de toda a atividade. LINGUETA Confeccionada em Eco-suede com perfuros para reduzir o peso e acrescentar maciez ao tênis.
              </ul>
            </div>
          </div>
        </section>
      </main>

      <BottomBar onBuyNow={() => setIsVariationModalOpen(true)} />

      <VariationModal 
        isOpen={isVariationModalOpen}
        onClose={() => setIsVariationModalOpen(false)}
        product={productData}
        onConfirm={(data) => {
          setSelection(data);
          setIsVariationModalOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={productData}
        timeLeft={timeLeft}
        selection={selection}
      />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-16 right-3 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-40 opacity-80"
      >
        <ArrowUp className="w-5 h-5 text-[#555555]" strokeWidth={1.5} />
      </button>
    </div>
  );
}
