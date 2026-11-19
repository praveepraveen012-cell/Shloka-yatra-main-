import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, CheckSquare, HeartPulse, Sparkles, ArrowRight, Thermometer, Luggage, Check } from 'lucide-react';

export default function PreparationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
            Preparation & Safety
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            The 12-Week Yatri Preparation Guide
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            The sacred journey begins months before you touch down in Kathmandu. Through physical conditioning, altitude awareness, and purposeful packing, you arrive ready to embrace Kailash with peace of mind.
          </p>
        </div>
      </section>

      {/* 12-Week Fitness Regimen */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="wrap px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm text-[#2F6FED] uppercase tracking-wider font-bold block mb-2">
              Physical Conditioning
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#071B3A] mb-3">
              Structured 12-Week Training Plan
            </h2>
            <p className="text-sm sm:text-base text-[#3B4E68] max-w-2xl leading-relaxed">
              Mount Kailash Parikrama reaches 5,630 meters at Dolma La Pass. Building cardiovascular stamina and leg endurance ensures a comfortable, transformative yatra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9E2EF] shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2F6FED]/10 text-[#2F6FED] border border-[#2F6FED]/30 text-xs font-bold mb-4">
                Weeks 1 – 4
              </span>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#071B3A] mb-3">
                Foundation & Aerobics
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#102C52]">
                <li>• <strong>Brisk Walking:</strong> 45 minutes daily at comfortable conversational pace.</li>
                <li>• <strong>Breathing exercises:</strong> 15 minutes of Pranayama (Anulom Vilom & Kapalabhati) morning routine.</li>
                <li>• <strong>Hydration habit:</strong> Drink 3 to 4 liters of clean water daily.</li>
                <li>• <strong>Medical check:</strong> Baseline ECG, blood pressure, and physician review.</li>
              </ul>
            </div>

            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED] shadow-md relative">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2F6FED] text-white text-xs font-bold mb-4">
                Weeks 5 – 8
              </span>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#071B3A] mb-3">
                Stamina & Stair Incline
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#102C52]">
                <li>• <strong>Stair Climbing:</strong> 20–30 minutes climbing stairs steadily without lifts.</li>
                <li>• <strong>Weekend Hikes:</strong> 8–10 km walks on natural terrain with gentle gradients.</li>
                <li>• <strong>Strength Training:</strong> Bodyweight squats, calf raises, and core stabilization.</li>
                <li>• <strong>Gear Break-in:</strong> Wear your trekking boots regularly to prevent trail blisters.</li>
              </ul>
            </div>

            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9E2EF] shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2F6FED]/10 text-[#2F6FED] border border-[#2F6FED]/30 text-xs font-bold mb-4">
                Weeks 9 – 12
              </span>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#071B3A] mb-3">
                Endurance & Pack Training
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#102C52]">
                <li>• <strong>Weighted Daypack:</strong> Walk with a 4–5 kg backpack simulating actual yatra essentials.</li>
                <li>• <strong>Long Duration Walk:</strong> One 12–14 km continuous walk every weekend.</li>
                <li>• <strong>Taper & Rest:</strong> In the final 7 days, reduce exertion; prioritize restful sleep and spiritual calm.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* High Altitude Safety Protocol */}
      <section className="py-8 sm:py-12 bg-[#071B3A] text-white">
        <div className="wrap px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8CA8CC] font-bold block mb-2">
                High-Altitude Awareness
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Understanding AMS & Safety Protocols
              </h2>
              <p className="text-sm sm:text-base text-[#D9E2EF] leading-relaxed mb-6">
                At altitudes above 3,500 meters, atmospheric pressure drops and effective oxygen intake diminishes. Our expedition team follows proven high-altitude protocols:
              </p>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#D9E2EF]">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#D9A441] shrink-0">1.</span>
                  <span><strong>Gradual Acclimatisation:</strong> Built-in acclimatisation rest days in Kerung/Nyalam and Lhasa to allow red blood cell adaptation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#D9A441] shrink-0">2.</span>
                  <span><strong>Twice-Daily Vitals Check:</strong> Morning and evening SpO2 (blood oxygen) and heart rate monitoring for every pilgrim.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#D9A441] shrink-0">3.</span>
                  <span><strong>Medical Oxygen Deployment:</strong> Certified medical oxygen cylinders and portable hyperbaric chambers accompany the convoy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#D9A441] shrink-0">4.</span>
                  <span><strong>Open Communication:</strong> Yatris must inform tour leaders immediately upon detecting mild headache, fatigue, or dizziness.</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="bg-[#041329] p-6 sm:p-8 rounded-2xl border border-[#2F6FED]/35">
                <HeartPulse size={36} className="text-[#2F6FED] mb-4" />
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-3">
                  Medical Clearance Checklist
                </h3>
                <p className="text-xs sm:text-sm text-[#D9E2EF] leading-relaxed mb-6">
                  All yatris are required to complete a medical fitness questionnaire prior to visa submission. Yatris with pre-existing cardiac, pulmonary, or severe hypertension conditions must obtain clearance from a physician.
                </p>
                <div className="bg-[#071B3A] p-4 rounded-xl border-l-4 border-[#2F6FED]">
                  <small className="text-[#2F6FED] font-bold block mb-1 uppercase tracking-wide">
                    Emergency Descent Protocol
                  </small>
                  <span className="text-xs text-[#D9E2EF] leading-relaxed block">
                    If any yatri experiences Acute Mountain Sickness (AMS) during Parikrama, emergency descent vehicles and trained escorts are deployed immediately without delay.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packing Checklist */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="wrap px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#071B3A] mb-3">
              Essential Packing Checklist
            </h2>
            <p className="text-sm sm:text-base text-[#3B4E68] max-w-xl mx-auto leading-relaxed">
              Temperatures at Kailash fluctuate between +18°C on sunny afternoons to -8°C at night at Diraphuk. Thoughtful layering is essential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9E2EF]">
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-4">
                Clothing & Layering
              </h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#102C52]">
                <li>✓ 2–3 pairs thermal innerwear (merino wool/poly)</li>
                <li>✓ Fleece jacket / windproof softshell</li>
                <li>✓ Heavy down jacket with hood (suitable for -10°C)</li>
                <li>✓ Waterproof / quick-dry trekking trousers</li>
                <li>✓ Thermal gloves + waterproof outer mittens</li>
                <li>✓ Woollen trekking socks (4–5 pairs)</li>
              </ul>
            </div>

            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9E2EF]">
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-4">
                Footwear & Trek Gear
              </h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#102C52]">
                <li>✓ Waterproof trekking boots with ankle support</li>
                <li>✓ Camp shoes / comfortable slip-on sneakers</li>
                <li>✓ Pair of adjustable trekking poles</li>
                <li>✓ UV400 polarized sunglasses (essential for snow glare)</li>
                <li>✓ High-lumen headlamp with spare batteries</li>
                <li>✓ 1-litre insulated thermos flask for warm water</li>
              </ul>
            </div>

            <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9E2EF]">
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-4">
                Provided by Shloka Yatra
              </h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#102C52]">
                <li>★ Heavy-duty Shloka Yatra duffel bag for main luggage</li>
                <li>★ Waterproof rain poncho</li>
                <li>★ Warm fleece beanie hat</li>
                <li>★ Wide-brim sun protection cap</li>
                <li>★ Water bottle holster with shoulder strap</li>
                <li>★ Certified medical oxygen cylinders for the group</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg transition-colors"
            >
              <span>Ready for Kailash? Proceed to Registration</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
