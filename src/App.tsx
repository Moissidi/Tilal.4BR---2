import { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown,
  Trees, 
  Waves, 
  Home, 
  Shield, 
  Maximize,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Layers,
  Cpu,
  X,
  List,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  ExternalLink,
  Send
} from 'lucide-react';

// --- BACKGROUND CANVAS PARTICLES ---
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // FIX 1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // FIX 2

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // FIX 3

    let animationFrameId: number; // FIX 4
    let particles: { x: number; y: number; vx: number; vy: number; size: number; phase: number; phaseSpeed: number; }[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;
        
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        const alpha = (Math.sin(p.phase) + 1) / 2 * 0.6 + 0.1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 110, ${alpha})`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

// --- SPOTLIGHT CURSOR (LAZY FOLLOW - DESKTOP ONLY) ---
const SpotlightCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null); // FIX 5
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (window.matchMedia("(hover: none)").matches) return;

    const onMouseMove = (e: MouseEvent) => { // FIX 6
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number; // FIX 7
    const update = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="hidden md:block fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-40"
      style={{
        background: 'radial-gradient(circle, rgba(200,169,110, 0.06) 0%, transparent 60%)',
        willChange: 'transform'
      }}
    />
  );
};

const App = () => {
  const [view, setView] = useState('presentation');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVilla, setActiveVilla] = useState('oasis');
  const [activePlan, setActivePlan] = useState(0);
  const [propertyValue, setPropertyValue] = useState(4300000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const PERSONAL_TAG = "LEONID MOISSIDI";
  const WA_LINK = "https://wa.me/971549906252";
  const PROFILE_PIC = "https://i.ibb.co/fVrJfrC9/Profile.jpg";
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqM8KeKqQjGYJgb_i5yajD5ePWRC5rPjZkpR1DKI6o7HntT4-TrAb6etgHRCi4CUGd0Q/exec";

  const slides = [
    {
      id: 'vision',
      eyebrow: 'A Historic Milestone',
      title: 'Tilal Binghatti',
      subtitle: 'Our Legacy Reimagined on the Horizon',
      content: 'For the first time, Binghatti\'s architectural signature unfolds across a 10-million-square-foot masterplan. Our design DNA, once reserved for the sky, takes root in the soil.',
    },
    {
      id: 'proximity',
      eyebrow: 'Prime Location',
      title: 'Proximity',
      subtitle: 'Seamlessly Connected to the City',
      locations: [
        { name: 'DESS COLLEGE', time: '4 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f647e29678e77:0xcdf250d7a526d631' },
        { name: 'GEMS WELLINGTON ACADEMY', time: '8 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f693bee420e9f:0x5e4e0c403a9ffec9' },
        { name: 'FAKEEH HOSPITAL', time: '10 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f646c90e80fbf:0xa778b5a056f1d85c' },
        { name: 'OUTLET MALL', time: '15 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f64a9adde0391:0xccb93df3295373f7' },
        { name: 'DUBAI MALL', time: '18 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f682829c85c07:0xa5eda9fb3c93b69d' },
        { name: 'DXB AIRPORT', time: '18 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f5d0693260e69:0xe695d4007a48eee9' },
        { name: 'AL MAKTOUM AIRPORT', time: '30 MIN', link: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3e5f74fb6ad1102b:0xa27756b3aca0d918' }
      ]
    },
    {
      id: 'collections',
      eyebrow: 'The Residence Collections',
      title: 'Oasis || Dunes',
      subtitle: 'Curated 4 & 5 Bedroom Environments',
      content: 'Choose your ideal lifestyle setting within the community.'
    },
    {
      id: 'superiority',
      eyebrow: 'Architectural Superiority',
      title: 'Mansion-Grade Luxury',
      subtitle: 'Why Tilal Binghatti Outperforms',
      stats: [
        { icon: <Home size={24} />, value: '8 Meters', label: 'DOUBLE-HEIGHT LIVING' },
        { icon: <Maximize size={24} />, value: '4 Meters', label: 'CEILING HEIGHTS' },
        { icon: <Waves size={24} />, value: '4.5 x 10m', label: 'RESORT-SCALE POOLS' },
        { icon: <Shield size={24} />, value: '10 Meters', label: 'REAR PRIVACY SETBACK' },
      ],
      amenitiesTitle: 'A World of 50+ Amenities',
      amenitiesStats: [
        { icon: <Maximize size={24} />, value: '621,815+', label: 'SQM PHASE 1' },
        { icon: <Waves size={24} />, value: '12,000 SQM', label: 'SUNKEN PEARL SHORE' },
        { icon: <Trees size={24} />, value: '20,000+', label: 'TREES PLANTED' },
        { icon: <Shield size={24} />, value: '1.6 KM', label: 'JOGGING TRACK' },
      ]
    },
    {
      id: 'pricing',
      eyebrow: 'Interactive Calculator',
      title: '60/40 Payment Plans',
      subtitle: 'Flexible Villa Ownership',
      pricingInfo: {
        plans: [
          {
            name: "Option 1: Monthly",
            description: "Structured with 0.5% monthly installments and 10% annual balloon payments.",
            breakdown: [
              { percentage: 20, label: 'Upfront', milestone: '10% Booking + 10% in 30 Days' },
              { percentage: 40, label: 'During Construction', milestone: 'Annual Balloons + Monthly:', recurring: { label: 'Monthly (0.5%)', pct: 0.5 } },
              { percentage: 40, label: 'On Handover', milestone: 'Completion' }
            ],
            schedule: [
              { d: '31-May-2026', p: 10 }, { d: '30-Jun-2026', p: 10 },
              { d: '31-Jul-2026', p: 0.5 }, { d: '31-Aug-2026', p: 0.5 }, { d: '30-Sep-2026', p: 0.5 }, { d: '31-Oct-2026', p: 0.5 }, { d: '30-Nov-2026', p: 0.5 },
              { d: '31-Dec-2026', p: 10 },
              { d: '31-Jan-2027', p: 0.5 }, { d: '28-Feb-2027', p: 0.5 }, { d: '31-Mar-2027', p: 0.5 }, { d: '30-Apr-2027', p: 0.5, yearMarker: 'End of Year 1' }, { d: '31-May-2027', p: 0.5 },
              { d: '30-Jun-2027', p: 0.5 }, { d: '31-Jul-2027', p: 0.5 }, { d: '31-Aug-2027', p: 0.5 }, { d: '30-Sep-2027', p: 0.5 }, { d: '31-Oct-2027', p: 0.5 }, { d: '30-Nov-2027', p: 0.5 },
              { d: '31-Dec-2027', p: 10 },
              { d: '31-Jan-2028', p: 0.5 }, { d: '29-Feb-2028', p: 0.5 }, { d: '31-Mar-2028', p: 0.5 }, { d: '30-Apr-2028', p: 0.5, yearMarker: 'End of Year 2' }, { d: '31-May-2028', p: 0.5 },
              { d: '30-Jun-2028', p: 5 },
              { d: '31-Jul-2028', p: 0.5 }, { d: '31-Aug-2028', p: 0.5 }, { d: '30-Sep-2028', p: 0.5 }, { d: '31-Oct-2028', p: 0.5 }, { d: '30-Nov-2028', p: 0.5 },
              { d: '31-Dec-2028', p: 2 },
              { d: 'Completion', p: 40, yearMarker: 'Handover' }
            ]
          },
          {
            name: "Option 2: Quarterly",
            description: "Conveniently spaced out with 5% payments every quarter.",
            breakdown: [
              { percentage: 20, label: 'Upfront', milestone: '10% Booking + 10% in 30 Days' },
              { percentage: 40, label: 'During Construction', milestone: 'Evenly Distributed:', recurring: { label: 'Quarterly (5%)', pct: 5 } },
              { percentage: 40, label: 'On Handover', milestone: 'Completion' }
            ],
            schedule: [
              { d: '31-May-2026', p: 10 }, { d: '30-Jun-2026', p: 10 },
              { d: '30-Sep-2026', p: 5 }, { d: '31-Dec-2026', p: 5 },
              { d: '31-Mar-2027', p: 5 }, { d: '30-Jun-2027', p: 5 }, { d: '30-Sep-2027', p: 5 }, { d: '31-Dec-2027', p: 5 },
              { d: '31-Mar-2028', p: 5 }, { d: '30-Jun-2028', p: 2.5 }, { d: '30-Sep-2028', p: 2.5 },
              { d: 'Completion', p: 40, yearMarker: 'Handover' }
            ]
          },
          {
            name: "Option 3: Bi-Annual",
            description: "Optimized for larger, less frequent installments of 10% every 6 months.",
            breakdown: [
              { percentage: 20, label: 'Upfront', milestone: '10% Booking + 10% in 30 Days' },
              { percentage: 40, label: 'During Construction', milestone: 'Twice a Year:', recurring: { label: 'Bi-Annual (10%)', pct: 10 } },
              { percentage: 40, label: 'On Handover', milestone: 'Completion' }
            ],
            schedule: [
              { d: '31-May-2026', p: 10 }, { d: '30-Jun-2026', p: 10 },
              { d: '31-Dec-2026', p: 10 },
              { d: '30-Jun-2027', p: 10 }, { d: '31-Dec-2027', p: 10 },
              { d: '30-Jun-2028', p: 10 },
              { d: 'Completion', p: 40, yearMarker: 'Handover' }
            ]
          },
          {
            name: "Option 4: Flexi",
            description: "A flexible mix of 2.5% intervals and 10% annual payments.",
            breakdown: [
              { percentage: 20, label: 'Upfront', milestone: '10% Booking + 10% in 30 Days' },
              { percentage: 40, label: 'During Construction', milestone: 'Annual Balloons + Intervals:', recurring: { label: 'Intervals (2.5%)', pct: 2.5 } },
              { percentage: 40, label: 'On Handover', milestone: 'Completion' }
            ],
            schedule: [
              { d: '31-May-2026', p: 10 }, { d: '30-Jun-2026', p: 10 },
              { d: '30-Sep-2026', p: 2.5 }, { d: '31-Dec-2026', p: 10 },
              { d: '30-Apr-2027', p: 2.5 }, { d: '30-Jun-2027', p: 2.5 }, { d: '31-Oct-2027', p: 2.5 }, { d: '31-Dec-2027', p: 10 },
              { d: '31-Mar-2028', p: 2.5 }, { d: '30-Jun-2028', p: 2.5 }, { d: '30-Sep-2028', p: 2.5 }, { d: '31-Dec-2028', p: 2.5 },
              { d: 'Completion', p: 40, yearMarker: 'Handover' }
            ]
          },
          {
            name: "Option 5: UAE",
            description: "Exclusive 50:50 payment plan for UAE Nationals with 5% down payment.",
            breakdown: [
              { percentage: 5, label: 'Down Payment', milestone: 'To Secure Your Villa' },
              { percentage: 45, label: 'During Construction', milestone: 'Annual Balloons + Monthly:', recurring: { label: 'Monthly (0.45%)', pct: 0.45 } },
              { percentage: 50, label: 'On Handover', milestone: 'Completion' }
            ],
            schedule: [
              { d: '31-May-2026', p: 5 }, { d: '30-Jun-2026', p: 5 },
              { d: '31-Jul-2026', p: 0.45 }, { d: '31-Aug-2026', p: 0.45 }, { d: '30-Sep-2026', p: 0.45 }, { d: '31-Oct-2026', p: 0.45 }, { d: '30-Nov-2026', p: 0.45 },
              { d: '31-Dec-2026', p: 10 },
              { d: '31-Jan-2027', p: 0.45 }, { d: '28-Feb-2027', p: 0.45 }, { d: '31-Mar-2027', p: 0.45 }, { d: '30-Apr-2027', p: 0.45, yearMarker: 'End of Year 1' }, { d: '31-May-2027', p: 0.45 },
              { d: '30-Jun-2027', p: 5 },
              { d: '31-Jul-2027', p: 0.45 }, { d: '31-Aug-2027', p: 0.45 }, { d: '30-Sep-2027', p: 0.45 }, { d: '31-Oct-2027', p: 0.45 }, { d: '30-Nov-2027', p: 0.45 },
              { d: '31-Dec-2027', p: 10 },
              { d: '31-Jan-2028', p: 0.45 }, { d: '29-Feb-2028', p: 0.45 }, { d: '31-Mar-2028', p: 0.45 }, { d: '30-Apr-2028', p: 0.45, yearMarker: 'End of Year 2' }, { d: '31-May-2028', p: 0.45 },
              { d: '30-Jun-2028', p: 3 },
              { d: '31-Jul-2028', p: 0.45 }, { d: '31-Aug-2028', p: 0.45 }, { d: '30-Sep-2028', p: 0.45 }, { d: '31-Oct-2028', p: 0.45 }, { d: '30-Nov-2028', p: 0.45 },
              { d: '31-Dec-2028', p: 0.75 },
              { d: 'Completion', p: 50, yearMarker: 'Handover' }
            ]
          }
        ]
      }
    },
    {
      id: 'inventory_matrix',
      eyebrow: 'Investment Overview',
      title: 'Inventory Details',
      subtitle: 'Price, BUA & Plot Matrix',
      matrix: [
        { type: '4 Bed Mid Unit', priceRange: '4,200,000 – 5,000,000', bua: '2,784', plot: '1,622 – 3,059' },
        { type: '5 Bed Premium End', priceRange: '5,100,000 – 5,950,000', bua: '2,824', plot: '1,996 – 3,401' },
        { type: '5 Bed Grand Unit', priceRange: '6,250,000 – 6,750,000', bua: '3,065', plot: '3,430 – 4,973' },
        { type: '6 Bed Twin Villa', priceRange: '6,900,000 – 8,200,000', bua: '3,672', plot: '2,818 – 6,333' },
        { type: '6 Bed Stand Alone', priceRange: '16,000,000 – 17,500,000', bua: '6,919', plot: '5,167 – 7,592' },
        { type: '7 Bed Premium', priceRange: '49,500,000', bua: '10,602', plot: '9,346' },
        { type: 'Mansion', priceRange: '150,000,000', bua: '23,895', plot: '39,434' }
      ]
    },
    {
      id: 'comparison',
      eyebrow: 'Sales Benchmark',
      title: 'Market Value',
      subtitle: '4 Bedroom Townhouses (2026 Forecast)',
      comparisonMatrix: [
        { community: 'DAMAC LAGOONS', psf: '1,715', bua: '2,273', plot: '1,550', highlighted: false },
        { community: 'TILAL AL GHAF', psf: '2,026', bua: '2,443', plot: '2,272', highlighted: false },
        { community: 'DAMAC ISLANDS', psf: '1,799', bua: '2,194', plot: '1,550', highlighted: false },
        { community: 'VILLANOVA', psf: '1,628', bua: '2,157', plot: '1,799', highlighted: false },
        { community: 'TILAL BINGHATTI', psf: '1,597', bua: '2,784', plot: '1,681', highlighted: true }
      ],
      transactions: {
        title: "SALES TRANSACTIONS",
        subtitle: "4 BEDROOM TOWNHOUSES (2026)",
        ready: { type: "READY", label: "AVERAGE PSF (AED)", value: "1,806 PSF", growth: "3.4%" },
        offPlan: { type: "OFF-PLAN", label: "AVERAGE PSF (AED)", value: "1,715 PSF", growth: "8.3%" }
      },
      footer: 'SOURCE: DXB INTERACT, BAYUT & DLD'
    },
    {
      id: 'advisory',
      eyebrow: 'Executive Advisory',
      title: 'Connect with Us',
      subtitle: '',
      advisor: {
        name: 'Leonid Moissidi',
        designation: 'Premium Property Consultant',
        whatsapp: WA_LINK,
        phone: '+971 54 990 6252',
        email: 'info@binghatti.com'
      }
    }
  ];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const openDetailsPage = (villaType: string) => { // FIX 8
    setActiveVilla(villaType);
    setView('details');
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // FIX 9
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formParams = new URLSearchParams();
      formParams.append('name', leadForm.name);
      formParams.append('email', leadForm.email);
      formParams.append('phone', leadForm.phone);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString(),
        mode: "no-cors"
      });
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setShowLeadForm(false);
        setSubmitSuccess(false);
        setLeadForm({ name: '', email: '', phone: '' });
      }, 3000);
      
    } catch (error) {
      console.error("Form submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPresentation = () => (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className="absolute w-full h-full flex flex-col items-center slide-transition px-4 sm:px-6 pt-20 sm:pt-24 pb-28 sm:pb-32 overflow-x-hidden overflow-y-auto overscroll-y-contain no-scrollbar"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            transform: index === currentSlide ? 'translateY(0) scale(1)' : index < currentSlide ? 'translateY(-48px) scale(0.95)' : 'translateY(48px) scale(0.95)',
            pointerEvents: index === currentSlide ? 'auto' : 'none'
          }}
        >
          <div className="w-full max-w-7xl flex flex-col items-center text-center pb-12">
            <p className="text-[0.65rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#c8a96e] mb-4 sm:mb-6 mt-4 font-semibold">
              {slide.eyebrow}
            </p>
            
            <h1 className="serif-font font-light text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-3 sm:mb-4 gold-shimmer-text leading-tight px-2">
              {slide.title}
            </h1>
            
            <h2 className="text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#e2c98a] opacity-80 mb-6 sm:mb-10 px-4">
              {slide.subtitle}
            </h2>

            {slide.id === 'vision' && (
              <div className="max-w-2xl mx-auto px-4">
                <div className="w-[1px] h-10 sm:h-12 bg-gradient-to-b from-[#c8a96e] to-transparent mx-auto mb-6 sm:mb-8" />
                <p className="text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose text-[#ede0c4] opacity-70">
                  {slide.content}
                </p>
              </div>
            )}

            {slide.id === 'superiority' && (
              <div className="w-full flex flex-col items-center pb-10">
                <div className="w-full overflow-x-auto overscroll-x-contain no-scrollbar pb-6 sm:pb-12">
                  <div className="flex flex-nowrap lg:grid lg:grid-cols-4 gap-4 sm:gap-6 w-full mt-4 sm:mt-6 px-4 min-w-max lg:min-w-0 items-stretch">
                    {slide.stats?.map((stat, i) => (
                      <div 
                        key={`lux-${i}`} 
                        className={`interactive-card px-6 sm:px-8 py-10 sm:py-12 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[280px] w-[280px] sm:w-[320px] lg:w-full transition-opacity duration-1000 ease-out
                          ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        <div className="flex flex-col items-center w-full max-w-full">
                          <div className="text-[#c8a96e] mb-6 sm:mb-8 opacity-100 brightness-125 flex items-center justify-center scale-125">{stat.icon}</div>
                          <div className="flex flex-col items-center w-full">
                            <div className="serif-font text-2xl sm:text-3xl md:text-4xl text-[#ede0c4] mb-5 tracking-widest leading-none font-medium whitespace-nowrap text-center">{stat.value}</div>
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#c8a96e]/50 to-transparent mb-5" />
                            <div className="text-[0.65rem] sm:text-[0.75rem] tracking-[0.4em] uppercase text-[#e2c98a] font-bold text-center leading-relaxed brightness-150 px-2 opacity-95">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center w-full my-4">
                  <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-[#c8a96e]/50 to-[#c8a96e]/20 mb-6" />
                  <h3 className="serif-font font-light text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#ede0c4] mb-8 gold-shimmer-text leading-tight px-4">{slide.amenitiesTitle}</h3>
                </div>
                <div className="w-full overflow-x-auto overscroll-x-contain no-scrollbar pb-6 sm:pb-0">
                  <div className="flex flex-nowrap lg:grid lg:grid-cols-4 gap-4 sm:gap-6 w-full px-4 min-w-max lg:min-w-0 items-stretch">
                    {slide.amenitiesStats?.map((stat, i) => (
                      <div 
                        key={`amn-${i}`} 
                        className={`interactive-card px-6 sm:px-8 py-10 sm:py-12 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[280px] w-[280px] sm:w-[320px] lg:w-full transition-opacity duration-1000 ease-out
                          ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${(i + 4) * 100}ms` }}
                      >
                        <div className="flex flex-col items-center w-full max-w-full">
                          <div className="text-[#c8a96e] mb-6 sm:mb-8 opacity-100 brightness-125 flex items-center justify-center scale-125">{stat.icon}</div>
                          <div className="flex flex-col items-center w-full">
                            <div className="serif-font text-2xl sm:text-3xl md:text-4xl text-[#ede0c4] mb-5 tracking-widest leading-none font-medium whitespace-nowrap text-center">{stat.value}</div>
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#c8a96e]/50 to-transparent mb-5" />
                            <div className="text-[0.65rem] sm:text-[0.75rem] tracking-[0.4em] uppercase text-[#e2c98a] font-bold text-center leading-relaxed brightness-150 px-2 opacity-95">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {slide.id === 'proximity' && (
              <div className="w-full mt-4 max-w-2xl mx-auto flex flex-col items-center space-y-3 sm:space-y-4 pb-4">
                {slide.locations?.map((loc, i) => (
                  <a 
                    key={i} 
                    href={loc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 rounded-full border border-[#c8a96e]/20 bg-[#080a06]/80 backdrop-blur-md hover:border-[#c8a96e]/50 transition-all group"
                  >
                    <div className="flex items-center gap-4 sm:gap-5 truncate">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#c8a96e]/10 flex items-center justify-center text-[#c8a96e] flex-shrink-0 group-hover:bg-[#c8a96e] group-hover:text-[#080a06] transition-colors">
                        <MapPin size={16} />
                      </div>
                      <span className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#ede0c4] truncate group-hover:text-white flex items-center gap-2">
                        {loc.name}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      <span className="serif-font text-lg sm:text-2xl text-[#c8a96e]">{loc.time}</span>
                      <Clock size={16} className="text-[#6a6b57] opacity-60" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {slide.id === 'pricing' && (
              <div className="w-full mt-4 max-w-5xl mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mb-8 sm:mb-12 w-full">
                  <label className="text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase text-[#c8a96e] mb-4 sm:mb-5">Property Value (AED)</label>
                  <div className="relative group flex items-center border border-[#c8a96e]/30 bg-[#c8a96e]/[0.05] rounded-2xl overflow-hidden w-full max-w-full sm:max-w-lg transition-colors">
                    <div className="hidden sm:flex items-center justify-center px-6 border-r border-[#c8a96e]/20 py-4 sm:py-6">
                      <span className="text-xl sm:text-2xl text-[#c8a96e] serif-font tracking-widest">AED</span>
                    </div>
                    <input
                      type="number"
                      value={propertyValue || ''}
                      onChange={(e) => setPropertyValue(Number(e.target.value))}
                      className="hide-spin-button bg-transparent text-4xl sm:text-5xl md:text-6xl text-[#ede0c4] text-center serif-font focus:outline-none w-full py-5 px-4"
                      placeholder="4300000"
                    />
                    <div className="absolute right-3 sm:right-5 flex flex-col gap-2 sm:gap-3">
                      <button onClick={() => setPropertyValue(p => (p || 0) + 100000)} className="text-[#6a6b57] hover:text-[#c8a96e]"><ChevronUp size={28} /></button>
                      <button onClick={() => setPropertyValue(p => Math.max(0, (p || 0) - 100000))} className="text-[#6a6b57] hover:text-[#c8a96e]"><ChevronDown size={28} /></button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
                  {slide.pricingInfo?.plans.map((plan, i) => (
                    <button key={i} onClick={() => setActivePlan(i)} 
                      className={`px-4 sm:px-6 py-3 sm:py-4 text-[0.6rem] sm:text-xs tracking-[0.2em] uppercase transition-all border rounded-xl
                        ${activePlan === i ? 'border-[#c8a96e] bg-[#c8a96e]/20 text-[#c8a96e] font-bold' : 'border-[#1e2019] text-[#6a6b57] hover:text-[#ede0c4] hover:border-[#c8a96e]/50'}`}>
                      {plan.name}
                    </button>
                  ))}
                </div>
                <div className="w-full flex flex-col items-center min-h-[400px]">
                  <button onClick={() => setShowTable(!showTable)} className="mb-8 sm:mb-12 flex items-center gap-3 text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] border border-[#c8a96e]/30 px-6 py-3 sm:py-4 hover:bg-[#c8a96e]/10 rounded-xl transition-all">
                    <List size={16} /> {showTable ? "Hide Detailed Schedule" : "View Detailed Schedule"}
                  </button>
                  {!showTable ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full px-4 animate-fade-in">
                      {slide.pricingInfo?.plans[activePlan].breakdown.map((item, i) => (
                        <div key={i} className="interactive-card p-6 sm:p-8 flex flex-col items-center text-center">
                          <h4 className="serif-font text-4xl sm:text-5xl md:text-6xl text-[#c8a96e] mb-2">{item.percentage}%</h4>
                          <p className="text-base sm:text-xl text-white mb-3 font-medium">{new Intl.NumberFormat('en-AE').format((propertyValue * item.percentage) / 100)}</p>
                          <p className="text-[0.65rem] sm:text-xs tracking-[0.15em] uppercase text-[#c8a96e] mb-2">{item.label}</p>
                          <p className="text-[0.65rem] text-[#ede0c4]/60 font-light">{item.milestone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full border border-[#c8a96e]/20 bg-[#080a06]/80 rounded-2xl overflow-hidden animate-fade-in">
                      <div className="max-h-[400px] overflow-y-auto overscroll-y-contain no-scrollbar overflow-x-auto overscroll-x-contain">
                        <table className="w-full text-left border-collapse min-w-[550px]">
                          <thead className="bg-[#1e2019] sticky top-0 z-10">
                            <tr>
                              <th className="py-4 px-5 text-[0.6rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] border-b border-[#c8a96e]/20">Date</th>
                              <th className="py-4 px-5 text-[0.6rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] border-b border-[#c8a96e]/20 text-right">%</th>
                              <th className="py-4 px-5 text-[0.6rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] border-b border-[#c8a96e]/20 text-right">AED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slide.pricingInfo?.plans[activePlan].schedule.map((row, idx) => (
                              <tr key={idx} className="border-b border-[#1e2019] hover:bg-[#c8a96e]/10">
                                <td className="py-4 px-5 text-xs sm:text-sm text-[#ede0c4]">
                                  <div className="flex items-center gap-3">
                                    {row.d} {row.yearMarker && <span className="text-[0.55rem] bg-[#c8a96e] text-[#080a06] px-2 py-0.5 rounded-md uppercase font-bold tracking-widest">{row.yearMarker}</span>}
                                  </div>
                                </td>
                                <td className="py-4 px-5 text-xs sm:text-sm text-[#ede0c4] text-right font-medium">{row.p}%</td>
                                <td className="py-4 px-5 text-xs sm:text-sm text-white text-right font-medium tracking-wide">{new Intl.NumberFormat('en-AE').format((propertyValue * row.p) / 100)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {slide.id === 'inventory_matrix' && (
              <div className="w-full mt-6 px-2 overflow-x-auto no-scrollbar">
                <div className="min-w-[800px] border border-[#c8a96e]/30 bg-[#080a06]/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1e2019] border-b border-[#c8a96e]/50">
                      <tr>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e]">TYPE</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">PRICE (AED)</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">BUA (SQFT)</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">PLOT (SQFT)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slide.matrix?.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#1e2019] group hover:bg-[#c8a96e]/5 transition-colors">
                          <td className="py-6 px-8 text-sm sm:text-base text-[#ede0c4] whitespace-nowrap tracking-wide">{row.type}</td>
                          <td className="py-6 px-8 text-base sm:text-xl text-[#c8a96e] text-right serif-font font-medium">{row.priceRange}</td>
                          <td className="py-6 px-8 text-sm sm:text-base text-[#ede0c4]/80 text-right serif-font tracking-wide">{row.bua}</td>
                          <td className="py-6 px-8 text-sm sm:text-base text-[#ede0c4]/60 text-right serif-font tracking-wide">{row.plot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {slide.id === 'comparison' && (
              <div className="w-full mt-6 flex flex-col items-center">
                <div className="w-full border border-[#c8a96e]/30 bg-[#080a06]/80 rounded-2xl overflow-hidden overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-[#1e2019] border-b border-[#c8a96e]/50">
                      <tr>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e]">COMMUNITY</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">AVG. PSF (AED)</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">AVG. BUA (SQFT)</th>
                        <th className="py-5 px-6 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-[#c8a96e] text-right">AVG. PLOT (SQFT)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slide.comparisonMatrix?.map((row, idx) => (
                        <tr key={idx} className={`border-b border-[#1e2019] ${row.highlighted ? 'bg-[#c8a96e]/10' : 'opacity-60 hover:opacity-100 hover:bg-[#c8a96e]/5 transition-all'}`}>
                          <td className="py-6 px-8 text-sm sm:text-base text-[#ede0c4] whitespace-nowrap tracking-wide flex items-center gap-4 h-full">
                            {row.community}
                            {row.highlighted && (
                              <span className="bg-[#c8a96e] text-[#080a06] text-[0.6rem] px-3 py-1 rounded-md font-bold tracking-widest whitespace-nowrap">BEST PSF VALUE</span>
                            )}
                          </td>
                          <td className={`py-6 px-8 text-base sm:text-xl text-right serif-font font-medium ${row.highlighted ? 'text-[#c8a96e]' : 'text-[#c8a96e]'}`}>{row.psf}</td>
                          <td className={`py-6 px-8 text-sm sm:text-base text-right serif-font tracking-wide ${row.highlighted ? 'text-white' : 'text-[#ede0c4]/80'}`}>{row.bua}</td>
                          <td className="py-6 px-8 text-sm sm:text-base text-[#ede0c4]/60 text-right serif-font tracking-wide">{row.plot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-full mt-12 sm:mt-20 flex flex-col items-center animate-fade-in">
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#c8a96e]/50 to-transparent mb-8" />
                  <h3 className="serif-font font-light text-3xl sm:text-5xl text-[#ede0c4] uppercase tracking-widest mb-3">{slide.transactions?.title}</h3>
                  <p className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-[#ede0c4]/80 mb-12">{slide.transactions?.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 justify-center items-center w-full">
                    <div className="flex flex-col items-center">
                      <h4 className="serif-font text-2xl sm:text-3xl text-[#ede0c4] tracking-[0.2em] mb-8 uppercase">{slide.transactions?.ready.type}</h4>
                      <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/5 flex flex-col items-center justify-center p-8 text-center shadow-2xl"
                           style={{ background: 'radial-gradient(circle at 40% 30%, rgba(200, 210, 190, 0.2) 0%, rgba(10, 12, 8, 1) 70%)' }}>
                        <p className="text-[0.65rem] sm:text-xs tracking-[0.15em] uppercase text-[#ede0c4]/80 mb-6 leading-relaxed max-w-[80%]">{slide.transactions?.ready.label}</p>
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <span className="text-xl sm:text-2xl text-[#ede0c4] tracking-widest">{slide.transactions?.ready.value}</span>
                          <div className="bg-[#1e221a] flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                            <span className="text-xs sm:text-sm text-white font-medium">{slide.transactions?.ready.growth}</span>
                            <ChevronUp size={16} className="text-[#4ade80]" strokeWidth={4} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <h4 className="serif-font text-2xl sm:text-3xl text-[#ede0c4] tracking-[0.2em] mb-8 uppercase">{slide.transactions?.offPlan.type}</h4>
                      <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/5 flex flex-col items-center justify-center p-8 text-center shadow-2xl"
                           style={{ background: 'radial-gradient(circle at 40% 30%, rgba(200, 210, 190, 0.2) 0%, rgba(10, 12, 8, 1) 70%)' }}>
                        <p className="text-[0.65rem] sm:text-xs tracking-[0.15em] uppercase text-[#ede0c4]/80 mb-6 leading-relaxed max-w-[80%]">{slide.transactions?.offPlan.label}</p>
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <span className="text-xl sm:text-2xl text-[#ede0c4] tracking-widest">{slide.transactions?.offPlan.value}</span>
                          <div className="bg-[#1e221a] flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                            <span className="text-xs sm:text-sm text-white font-medium">{slide.transactions?.offPlan.growth}</span>
                            <ChevronUp size={16} className="text-[#4ade80]" strokeWidth={4} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-16 text-[0.6rem] sm:text-xs tracking-wider uppercase text-[#6a6b57]">{slide.footer}</p>
              </div>
            )}

            {slide.id === 'collections' && (
              <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
                {['oasis', 'dunes'].map((villa) => (
                  <div key={villa} onClick={() => setActiveVilla(villa)}
                    className={`collection-toggle p-8 sm:p-12 text-left border transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] sm:min-h-[400px]
                      ${activeVilla === villa ? 'border-[#c8a96e] bg-[#c8a96e]/10 scale-[1.02] shadow-xl' : 'border-[#1e2019] bg-black/40 opacity-50 grayscale'}`}>
                    <div>
                      <h3 className="serif-font text-4xl sm:text-6xl text-[#ede0c4] mb-2 capitalize">The {villa}</h3>
                      <p className="text-[0.6rem] sm:text-xs tracking-[0.3em] text-[#c8a96e] uppercase mb-6 sm:mb-10 font-semibold">{villa === 'oasis' ? 'Heart of Community' : 'Comfort & Active'}</p>
                      {activeVilla === villa && (
                        <div onClick={(e) => { e.stopPropagation(); openDetailsPage(villa); }}
                          className="inline-flex items-center gap-3 text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] hover:text-white transition-colors font-bold mt-4">
                          Explore Specs <ArrowRight size={16} />
                        </div>
                      )}
                    </div>
                    <ul className="text-[0.7rem] sm:text-sm text-[#ede0c4]/70 space-y-3 mt-auto font-light">
                      <li className="flex items-center gap-3"><Check size={12} className="text-[#c8a96e]"/> {villa === 'oasis' ? 'Centrally Located' : 'Family Oriented'}</li>
                      <li className="flex items-center gap-3"><Check size={12} className="text-[#c8a96e]"/> {villa === 'oasis' ? 'Beachfront Access' : 'Green Walkways'}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {slide.id === 'advisory' && (
              <div className="w-full flex flex-col items-center px-4">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 mb-8 rounded-full border border-[#c8a96e]/30 p-2 bg-[#c8a96e]/5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#080a06]">
                    <img src={PROFILE_PIC} alt={slide.advisor?.name} className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full max-w-lg mt-8">
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-[#c8a96e] text-[#080a06] py-5 sm:py-6 text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#e2c98a] transition-all rounded-xl">
                    <MessageCircle size={18} fill="currentColor" /> WhatsApp
                  </a>
                  <a href={`tel:${slide.advisor?.phone.replace(/\s+/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-3 border border-[#c8a96e]/30 px-6 py-5 sm:py-6 text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#ede0c4] bg-[#c8a96e]/5 rounded-xl hover:bg-[#c8a96e]/10 transition-colors">
                    <Phone size={16} /> Call Advisor
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailsPage = () => {
    const features = [
      { icon: <Home size={24} />, title: "4 Bedrooms", sub: "Attached Baths" },
      { icon: <Layers size={24} />, title: "G+2+Roof", sub: "Multi-Level" },
      { icon: <Compass size={24} />, title: "Elevator", sub: "Standard" },
      { icon: <Cpu size={24} />, title: "Smart Home", sub: "Integrated" }
    ];
    return (
      <div className="absolute inset-0 w-full h-full bg-[#080a06] z-[100] flex flex-col animate-fade-in px-6 sm:px-16 pt-28 sm:pt-32 pb-16 overflow-y-auto overscroll-y-contain">
        <div className="fixed top-0 left-0 w-full px-6 sm:px-10 py-8 z-[110] flex justify-between items-center bg-[#080a06]/80 backdrop-blur-xl border-b border-[#c8a96e]/10">
          <button onClick={() => setView('presentation')} className="flex items-center gap-3 text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e] hover:text-white transition-colors font-bold">
            <ArrowLeft size={16} /> Overview
          </button>
          <div className="serif-font text-xl sm:text-2xl tracking-[0.1em] text-[#6a6b57] uppercase font-light">Binghatti</div>
        </div>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 max-w-7xl mx-auto w-full items-center mt-6">
          <div className="text-center lg:text-left w-full lg:flex-1 px-4 sm:px-0">
            <p className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-[#c8a96e] mb-4 sm:mb-6 font-semibold">Mid Unit Villa Specifications</p>
            <h1 className="serif-font text-6xl sm:text-8xl lg:text-9xl gold-shimmer-text mb-4 sm:mb-6 leading-none">The {activeVilla}</h1>
            <h2 className="text-sm sm:text-base lg:text-lg tracking-[0.15em] uppercase text-[#e2c98a] opacity-90 mb-8 sm:mb-10 lg:border-l-[2px] border-[#c8a96e] lg:pl-6 italic font-light">Inspired by an Evergreen Spirit</h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              {["Double-Height", "Drivers & Maids", "Storage Room"].map((tag, i) => (
                <div key={i} className="border border-[#c8a96e]/30 px-4 py-2 text-[0.55rem] sm:text-xs tracking-[0.1em] uppercase text-[#ede0c4] bg-[#c8a96e]/5 rounded-lg">{tag}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:flex-1 max-w-2xl">
            {features.map((feature, idx) => (
              <div key={idx} className="border border-[#1e2019] bg-white/[0.02] p-6 sm:p-10 flex flex-col items-center lg:items-start text-center lg:text-left group transition-all rounded-2xl">
                <div className="text-[#c8a96e] mb-5 sm:mb-6 opacity-80 group-hover:opacity-100 scale-125">{feature.icon}</div>
                <h4 className="serif-font text-2xl sm:text-3xl text-[#ede0c4] mb-2">{feature.title}</h4>
                <p className="text-[0.55rem] sm:text-xs tracking-[0.2em] uppercase text-[#6a6b57]">{feature.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden overscroll-none" style={{ backgroundColor: "#080a06", color: "#ede0c4", fontFamily: "'Montserrat', sans-serif", fontWeight: 300, touchAction: "manipulation" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@100;300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root { --gold: #c8a96e; --gold-light: #e2c98a; --cream: #ede0c4; --border: rgba(200,169,110,0.15); }
        body, html { margin: 0; padding: 0; overflow: hidden; overscroll-behavior: none; }
        .serif-font { font-family: 'Cormorant Garamond', serif; }
        @keyframes shimmer { 0% { background-position: -300% center; } 100% { background-position: 300% center; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .gold-shimmer-text { background: linear-gradient(90deg, #ede0c4 0%, #c8a96e 20%, #fff 40%, #e2c98a 60%, #c8a96e 80%, #ede0c4 100%); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 8s linear infinite; }
        .slide-transition { transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-btn { transition: all 0.3s; background: rgba(8,10,6,0.5); backdrop-filter: blur(8px); pointer-events: auto; }
        .nav-btn:active { transform: scale(0.9); background: var(--gold); color: #080a06; }
        .interactive-card { border: 1px solid var(--border); border-radius: 20px; background: rgba(255,255,255,0.03); transition: all 0.5s ease-out; backdrop-filter: blur(12px); box-shadow: inset 0 0 20px rgba(200,169,110,0.05); }
        .interactive-card:hover { border-color: var(--gold); background: rgba(200, 169, 110, 0.08); box-shadow: 0 10px 40px -10px rgba(200, 169, 110, 0.2); }
        .collection-toggle { border-radius: 20px; }
        .hide-spin-button { -moz-appearance: textfield; }
        .hide-spin-button::-webkit-inner-spin-button, .hide-spin-button::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .interactive-watermark-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; z-index: 1000; display: flex; align-items: center; justify-content: center; background: linear-gradient(to top, #080a06 80%, transparent); border-top: 1px solid rgba(200, 169, 110, 0.1); backdrop-filter: blur(6px); transition: all 0.3s ease; text-decoration: none !important; }
        .watermark-content { white-space: nowrap; display: flex; align-items: center; gap: 0.75rem; color: rgba(200, 169, 110, 0.8); }
        .watermark-label { font-family: 'Montserrat', sans-serif; font-weight: 300; font-size: 0.6rem; letter-spacing: 0.4em; text-transform: uppercase; }
        .orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; opacity: 0.4; }
        .orb-1 { width: 60vw; height: 60vw; max-width: 800px; max-height: 800px; background: radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%); top: -10%; left: -10%; animation: float1 25s ease-in-out infinite alternate; }
        .orb-2 { width: 50vw; height: 50vw; max-width: 700px; max-height: 700px; background: radial-gradient(circle, rgba(226,201,138,0.1) 0%, transparent 70%); bottom: -10%; right: -10%; animation: float2 30s ease-in-out infinite alternate; }
        .orb-3 { width: 40vw; height: 40vw; max-width: 600px; max-height: 600px; background: radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%); top: 40%; left: 60%; animation: float3 28s ease-in-out infinite alternate; }
        @keyframes float1 { 0% { transform: translate(0,0) scale(1); opacity: 0.3; } 50% { transform: translate(10vw,5vh) scale(1.1); opacity: 0.5; } 100% { transform: translate(-5vw,15vh) scale(0.9); opacity: 0.3; } }
        @keyframes float2 { 0% { transform: translate(0,0) scale(0.9); opacity: 0.4; } 50% { transform: translate(-15vw,-10vh) scale(1.1); opacity: 0.6; } 100% { transform: translate(5vw,-20vh) scale(1); opacity: 0.4; } }
        @keyframes float3 { 0% { transform: translate(0,0) scale(1.1); opacity: 0.5; } 50% { transform: translate(-10vw,15vh) scale(0.9); opacity: 0.3; } 100% { transform: translate(10vw,-10vh) scale(1.2); opacity: 0.5; } }
      `}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <ParticleCanvas />
      <SpotlightCursor />

      <header className="absolute top-0 left-0 w-full px-6 sm:px-10 py-6 sm:py-8 z-50 flex justify-between items-center bg-gradient-to-b from-[#080a06]/90 to-transparent">
        <div className="serif-font text-xl sm:text-2xl tracking-[0.1em] text-[#c8a96e] uppercase font-light">Binghatti</div>
        {view === 'presentation' && (
          <div className="hidden md:flex gap-2 px-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-[2px] rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-[#c8a96e]' : 'w-4 bg-[#c8a96e]/20'}`} />
            ))}
          </div>
        )}
        {view === 'presentation' && (
          <div className="flex gap-3 sm:gap-5">
            <button onClick={handlePrev} className="nav-btn w-12 h-12 rounded-full flex items-center justify-center text-[#c8a96e] border border-[#c8a96e]/20 bg-[#080a06]/50"><ChevronLeft size={20} /></button>
            <button onClick={handleNext} className="nav-btn w-12 h-12 rounded-full flex items-center justify-center text-[#c8a96e] border border-[#c8a96e]/20 bg-[#080a06]/50"><ChevronRight size={20} /></button>
          </div>
        )}
      </header>

      {view === 'presentation' ? renderPresentation() : renderDetailsPage()}

      <button onClick={() => setShowLeadForm(true)}
        className="fixed bottom-20 right-6 z-[90] flex items-center gap-3 bg-[#c8a96e] text-[#080a06] px-6 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:scale-105 hover:bg-[#e2c98a] transition-all shadow-[0_0_30px_rgba(200,169,110,0.3)] group">
        <span className="hidden sm:block">Register Interest</span>
        <span className="sm:hidden">Register</span>
        <Send size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {view === 'presentation' && (
        <div className="absolute bottom-16 left-0 w-full flex justify-center z-40 pointer-events-none mb-1">
          <div className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-[#6a6b57] bg-[#080a06]/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      )}

      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="interactive-watermark-bar">
        <div className="watermark-content">
          <span className="watermark-label">Exclusively by {PERSONAL_TAG}</span>
          <MessageCircle size={14} className="text-[#c8a96e]" />
          <ExternalLink size={12} className="opacity-40" />
        </div>
      </a>

      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#080a06]/95 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-[#c8a96e] p-3 bg-[#1e2019]/50 rounded-full border border-[#c8a96e]/20" onClick={() => setSelectedImage(null)}><X size={28} /></button>
          <img src={selectedImage} alt="Highlight" className="max-w-full max-h-[80vh] rounded-2xl border border-[#c8a96e]/30 shadow-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      
      {showLeadForm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#080a06]/95 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md border border-[#c8a96e]/30 bg-[#080a06] p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(200,169,110,0.15)]">
            <button className="absolute top-5 right-5 text-[#c8a96e] hover:text-white transition-colors" onClick={() => setShowLeadForm(false)}><X size={24} /></button>
            <h3 className="serif-font text-4xl sm:text-5xl text-[#ede0c4] mb-3 text-center">Register Interest</h3>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6a6b57] mb-10 text-center">Please provide your details below</p>
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full border-2 border-[#c8a96e] flex items-center justify-center text-[#c8a96e] mb-6"><Check size={40} /></div>
                <h4 className="serif-font text-3xl text-[#ede0c4] mb-3">Thank You!</h4>
                <p className="text-xs tracking-[0.1em] text-[#6a6b57] uppercase">Your request has been submitted securely.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <label className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e]">Full Name</label>
                  <input required type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full bg-transparent border-b border-[#c8a96e]/30 text-[#ede0c4] py-3 focus:outline-none focus:border-[#c8a96e] text-base transition-colors" />
                </div>
                <div>
                  <label className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e]">Email Address</label>
                  <input required type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full bg-transparent border-b border-[#c8a96e]/30 text-[#ede0c4] py-3 focus:outline-none focus:border-[#c8a96e] text-base transition-colors" />
                </div>
                <div>
                  <label className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-[#c8a96e]">Phone Number</label>
                  <input required type="tel" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-[#c8a96e]/30 text-[#ede0c4] py-3 focus:outline-none focus:border-[#c8a96e] text-base transition-colors" />
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-3 bg-[#c8a96e] text-[#080a06] py-5 text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#e2c98a] transition-all disabled:opacity-60 disabled:cursor-not-allowed rounded-xl">
                  {isSubmitting ? 'Sending...' : <><span>Submit Request</span><Send size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
