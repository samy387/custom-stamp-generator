/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';

type StampShape = 'circle' | 'oval' | 'square' | 'rectangle' | 'rounded-square';

export default function App() {
  const [companyName, setCompanyName] = useState('شركة النور للتجارة والمقاولات | AL-NOOR TRADING CO.');
  const [taxNumber, setTaxNumber] = useState('300123456789003');
  const [crNumber, setCrNumber] = useState('1010567890');
  const [shape, setShape] = useState<StampShape>('circle');
  const [color, setColor] = useState('#0f2b5c');
  const [borderThickness, setBorderThickness] = useState(4.5);
  const [fontWeight, setFontWeight] = useState(800);
  const [clarityMode, setClarityMode] = useState<'ultra' | 'subtle' | 'vintage'>('ultra');
  const [exportScale, setExportScale] = useState(4); // 4 = 2000px, 300 DPI
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [bgMode, setBgMode] = useState<'paper' | 'transparent' | 'dark'>('paper');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const isTaxValid = /^\d+$/.test(taxNumber.trim());
  const isCrValid = /^\d+$/.test(crNumber.trim());
  const isCompanyValid = companyName.trim().length > 0;
  const isFormValid = isTaxValid && isCrValid && isCompanyValid;

  const hasArabic = (text: string) =>
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text || '');

  const isAr = hasArabic(companyName);

  const handleReset = () => {
    setCompanyName('');
    setTaxNumber('');
    setCrNumber('');
    setShape('circle');
    setColor('#0f2b5c');
    setBorderThickness(4.5);
    setFontWeight(800);
    setClarityMode('ultra');
    setZoomLevel(1.0);
  };

  const handleLoadSample = () => {
    setCompanyName('شركة النور للتجارة والمقاولات | AL-NOOR TRADING CO.');
    setTaxNumber('300123456789003');
    setCrNumber('1010567890');
  };

  const downloadSVG = () => {
    if (!svgRef.current || !isFormValid) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgRef.current);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stamp_${shape}_hd.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    if (!svgRef.current || !isFormValid) return;
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.style.transform = 'none';

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);
    if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = exportScale || 4;
      const viewBox = svgRef.current!.viewBox.baseVal;
      const width = Math.round((viewBox.width || 500) * scale);
      const height = Math.round((viewBox.height || 500) * scale);
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      URL.revokeObjectURL(blobURL);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `stamp_${shape}_hd.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = blobURL;
  };

  // Curved text path math
  const circleTopPath = 'M 74 250 A 176 176 0 0 1 426 250';
  const circleBottomPath = 'M 426 250 A 176 176 0 0 1 74 250';

  const ovalTopPath = 'M 82 210 A 218 138 0 0 1 518 210';
  const ovalBottomPath = 'M 518 210 A 218 138 0 0 1 82 210';

  const taxLabel = isAr ? 'الرقم الضريبي' : 'TAX';
  const crLabel = isAr ? 'السجل التجاري' : 'C.R';
  const bottomCurvedText = `${taxLabel}: ${taxNumber || '0000000000'}  ★  ${crLabel}: ${crNumber || '0000000000'}`;

  const taxRectLabel = isAr ? 'الرقم الضريبي' : 'TAX NO';
  const crRectLabel = isAr ? 'السجل التجاري' : 'C.R. NO';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h1 className="text-lg font-bold tracking-tight">صانع الأختام الرسمي عالي الدقة (300 DPI)</h1>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded hidden md:inline">
            فيكتور فائق الوضوح Vector HD
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">بيانات وتخصيص الختم</h2>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-2.5 py-1"
              >
                نموذج جاهز (Sample)
              </button>
            </div>

            {/* Shape selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">شكل الختم</label>
              <div className="grid grid-cols-5 gap-2">
                {(['circle', 'oval', 'square', 'rectangle', 'rounded-square'] as StampShape[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                      shape === s
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {s === 'circle'
                        ? 'دائري'
                        : s === 'oval'
                        ? 'بيضاوي'
                        : s === 'square'
                        ? 'مربع'
                        : s === 'rectangle'
                        ? 'مستطيل'
                        : 'منحني'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label htmlFor="comp-input" className="block text-xs font-bold text-slate-700 mb-1">
                اسم الشركة أو المؤسسة <span className="text-red-500">*</span>
              </label>
              <input
                id="comp-input"
                type="text"
                dir="auto"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="مثال: شركة النور للتجارة والمقاولات"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  !isCompanyValid
                    ? 'border-red-500 bg-red-50/30 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {!isCompanyValid && (
                <p className="text-xs text-red-600 mt-1 font-semibold">اسم الشركة مطلوب ولا يمكن تركه فارغاً.</p>
              )}
            </div>

            {/* Tax Number */}
            <div className="mb-4">
              <label htmlFor="tax-input" className="block text-xs font-bold text-slate-700 mb-1">
                الرقم الضريبي (أرقام فقط) <span className="text-red-500">*</span>
              </label>
              <input
                id="tax-input"
                type="text"
                dir="ltr"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="300123456789003"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  !isTaxValid
                    ? 'border-red-500 bg-red-50/30 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {!isTaxValid && (
                <p className="text-xs text-red-600 mt-1 font-semibold">
                  {taxNumber.trim() === ''
                    ? 'الرقم الضريبي مطلوب.'
                    : 'يجب أن يحتوي الرقم الضريبي على أرقام فقط (0–9).'}
                </p>
              )}
            </div>

            {/* CR Number */}
            <div className="mb-5">
              <label htmlFor="cr-input" className="block text-xs font-bold text-slate-700 mb-1">
                رقم السجل التجاري (أرقام فقط) <span className="text-red-500">*</span>
              </label>
              <input
                id="cr-input"
                type="text"
                dir="ltr"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="1010567890"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  !isCrValid
                    ? 'border-red-500 bg-red-50/30 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {!isCrValid && (
                <p className="text-xs text-red-600 mt-1 font-semibold">
                  {crNumber.trim() === ''
                    ? 'رقم السجل التجاري مطلوب.'
                    : 'يجب أن يحتوي رقم السجل التجاري على أرقام فقط (0–9).'}
                </p>
              )}
            </div>

            {/* Clarity mode tabs */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">مظهر ووضوح الحبر</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setClarityMode('ultra')}
                  className={`py-1.5 rounded ${
                    clarityMode === 'ultra' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  فائق الوضوح HD
                </button>
                <button
                  type="button"
                  onClick={() => setClarityMode('subtle')}
                  className={`py-1.5 rounded ${
                    clarityMode === 'subtle' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  حبر طبيعي
                </button>
                <button
                  type="button"
                  onClick={() => setClarityMode('vintage')}
                  className={`py-1.5 rounded ${
                    clarityMode === 'vintage' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ختم كلاسيكي
                </button>
              </div>
            </div>

            {/* Font weight */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>سماكة ووضوح الخط</span>
                <span className="text-blue-900 font-bold">{fontWeight}</span>
              </div>
              <input
                type="range"
                min="600"
                max="900"
                step="100"
                value={fontWeight}
                onChange={(e) => setFontWeight(parseInt(e.target.value, 10))}
                className="w-full accent-blue-900"
              />
            </div>

            {/* Thickness */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>سماكة الإطار</span>
                <span className="text-blue-900 font-bold">{borderThickness.toFixed(1)}px</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="9"
                step="0.5"
                value={borderThickness}
                onChange={(e) => setBorderThickness(parseFloat(e.target.value))}
                className="w-full accent-blue-900"
              />
            </div>

            {/* Colors */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">لون حبر الختم</label>
              <div className="flex items-center gap-2 flex-wrap">
                {['#0f2b5c', '#0c2340', '#111827', '#991b1b', '#14532d', '#581c87'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : ''
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full border border-slate-300 cursor-pointer"
                />
              </div>
            </div>

            {/* DPI Setting */}
            <div className="mb-6">
              <label htmlFor="dpi-select" className="block text-xs font-bold text-slate-700 mb-1">
                دقة تصدير صورة PNG
              </label>
              <select
                id="dpi-select"
                value={exportScale}
                onChange={(e) => setExportScale(parseFloat(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value={4}>فائقة الوضوح 300 DPI Ultra HD (2000 &times; 2000 بكسل)</option>
                <option value={6}>دقة قصوى 600 DPI Master Print (3000 &times; 3000 بكسل)</option>
                <option value={2.5}>دقة قياسية Standard (1250 &times; 1250 بكسل)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={downloadPNG}
                disabled={!isFormValid}
                className="py-3 px-4 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تحميل PNG عالي الدقة
              </button>
              <button
                type="button"
                onClick={downloadSVG}
                disabled={!isFormValid}
                className="py-3 px-4 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تحميل SVG فيكتور
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="col-span-2 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                إعادة تعيين الحقول (Reset)
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs sticky top-20">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">المعاينة المباشرة</h2>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                  {shape === 'circle'
                    ? 'دائري'
                    : shape === 'oval'
                    ? 'بيضاوي'
                    : shape === 'square'
                    ? 'مربع'
                    : shape === 'rectangle'
                    ? 'مستطيل'
                    : 'منحني'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs font-bold">
                  {[1.0, 1.25, 1.5].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoomLevel(z)}
                      className={`px-2 py-0.5 rounded ${
                        zoomLevel === z ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {Math.round(z * 100)}%
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs font-bold">
                  {(['paper', 'transparent', 'dark'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setBgMode(m)}
                      className={`px-2 py-0.5 rounded ${
                        bgMode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {m === 'paper' ? 'ورقة' : m === 'transparent' ? 'شفاف' : 'داكن'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`w-full min-h-[480px] rounded-lg flex items-center justify-center p-6 border border-slate-200 overflow-hidden ${
                bgMode === 'paper'
                  ? 'bg-white'
                  : bgMode === 'dark'
                  ? 'bg-slate-900'
                  : 'bg-slate-100'
              }`}
            >
              <div style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}>
                <svg
                  ref={svgRef}
                  viewBox={shape === 'oval' || shape === 'rectangle' ? '0 0 600 420' : '0 0 500 500'}
                  className="max-w-full max-h-[450px]"
                  style={{
                    fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif",
                    shapeRendering: 'geometricPrecision',
                    textRendering: 'geometricPrecision'
                  }}
                >
                  <defs>
                    <filter id="react-subtle-filter" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" xChannelSelector="R" yChannelSelector="G" result="roughened" />
                      <feColorMatrix type="matrix" in="roughened" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.98 0" />
                    </filter>
                    <filter id="react-vintage-filter" x="-10%" y="-10%" width="120%" height="120%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="roughened" />
                      <feColorMatrix type="matrix" in="noise" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -7" result="porosity" />
                      <feComposite in="roughened" in2="porosity" operator="out" result="inkBleed" />
                      <feColorMatrix type="matrix" in="inkBleed" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.94 0" />
                    </filter>
                    <path id="react-circle-top" d={circleTopPath} fill="none" />
                    <path id="react-circle-bottom" d={circleBottomPath} fill="none" />
                    <path id="react-oval-top" d={ovalTopPath} fill="none" />
                    <path id="react-oval-bottom" d={ovalBottomPath} fill="none" />
                  </defs>

                  <g
                    filter={
                      clarityMode === 'subtle'
                        ? 'url(#react-subtle-filter)'
                        : clarityMode === 'vintage'
                        ? 'url(#react-vintage-filter)'
                        : undefined
                    }
                  >
                    {shape === 'circle' && (
                      <>
                        <circle cx="250" cy="250" r="226" fill="none" stroke={color} strokeWidth={borderThickness} strokeLinecap="round" />
                        <circle cx="250" cy="250" r="210" fill="none" stroke={color} strokeWidth={Math.max(1.75, borderThickness * 0.52)} />
                        <circle cx="250" cy="250" r="142" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="4 3" opacity="0.9" />
                        <text x="66" y="255.5" textAnchor="middle" fill={color} fontSize="15">★</text>
                        <text x="434" y="255.5" textAnchor="middle" fill={color} fontSize="15">★</text>
                        <text
                          fill={color}
                          fontSize={companyName.length > 35 ? 16 : 20}
                          fontWeight={fontWeight}
                          dominantBaseline="central"
                        >
                          <textPath href="#react-circle-top" startOffset="50%" textAnchor="middle">
                            {companyName || 'اسم الشركة'}
                          </textPath>
                        </text>
                        <text
                          fill={color}
                          fontSize={bottomCurvedText.length > 35 ? 13 : 15}
                          fontWeight={Math.min(fontWeight, 800)}
                          dominantBaseline="central"
                        >
                          <textPath href="#react-circle-bottom" startOffset="50%" textAnchor="middle">
                            {bottomCurvedText}
                          </textPath>
                        </text>
                        <g transform="translate(250, 250)">
                          <polygon points="0,-36 10,-12 36,-12 16,4 23,28 0,14 -23,28 -16,4 -36,-12 -10,-12" fill={color} />
                          <polygon points="-58,-5 -53,6 -41,6 -51,13 -48,24 -58,18 -68,24 -65,13 -75,6 -63,6" fill={color} transform="scale(0.55)" opacity="0.85" />
                          <polygon points="58,-5 63,6 75,6 65,13 68,24 58,18 48,24 51,13 41,6 53,6" fill={color} transform="scale(0.55)" opacity="0.85" />
                          <text x="0" y="48" textAnchor="middle" fill={color} fontSize="12" fontWeight="800" letterSpacing="2.5px">
                            {isAr ? 'معتمد رسمياً' : 'OFFICIAL SEAL'}
                          </text>
                        </g>
                      </>
                    )}

                    {shape === 'oval' && (
                      <>
                        <ellipse cx="300" cy="210" rx="278" ry="188" fill="none" stroke={color} strokeWidth={borderThickness} strokeLinecap="round" />
                        <ellipse cx="300" cy="210" rx="260" ry="170" fill="none" stroke={color} strokeWidth={Math.max(1.75, borderThickness * 0.52)} />
                        <ellipse cx="300" cy="210" rx="176" ry="102" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="4 3.5" opacity="0.88" />
                        <text x="74" y="215.5" textAnchor="middle" fill={color} fontSize="15">★</text>
                        <text x="526" y="215.5" textAnchor="middle" fill={color} fontSize="15">★</text>
                        <text
                          fill={color}
                          fontSize={companyName.length > 35 ? 16 : 21}
                          fontWeight={fontWeight}
                          dominantBaseline="central"
                        >
                          <textPath href="#react-oval-top" startOffset="50%" textAnchor="middle">
                            {companyName || 'اسم الشركة'}
                          </textPath>
                        </text>
                        <text
                          fill={color}
                          fontSize={bottomCurvedText.length > 35 ? 13.5 : 15}
                          fontWeight={Math.min(fontWeight, 800)}
                          dominantBaseline="central"
                        >
                          <textPath href="#react-oval-bottom" startOffset="50%" textAnchor="middle">
                            {bottomCurvedText}
                          </textPath>
                        </text>
                        <g transform="translate(300, 210)">
                          <polygon points="0,-28 8,-9 28,-9 12,3 18,22 0,11 -18,22 -12,3 -28,-9 -8,-9" fill={color} />
                          <text x="0" y="42" textAnchor="middle" fill={color} fontSize="12" fontWeight="800" letterSpacing="2.5px">
                            {isAr ? 'توثيق رسمي' : 'CERTIFIED SEAL'}
                          </text>
                        </g>
                      </>
                    )}

                    {(shape === 'square' || shape === 'rounded-square') && (
                      <>
                        <rect
                          x="24"
                          y="24"
                          width="452"
                          height="452"
                          rx={shape === 'rounded-square' ? 45 : 0}
                          fill="none"
                          stroke={color}
                          strokeWidth={borderThickness}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="38"
                          y="38"
                          width="424"
                          height="424"
                          rx={shape === 'rounded-square' ? 32 : 0}
                          fill="none"
                          stroke={color}
                          strokeWidth={Math.max(1.75, borderThickness * 0.52)}
                          strokeLinejoin="round"
                        />
                        <text x="250" y="125" textAnchor="middle" fill={color} fontSize={companyName.length > 35 ? 17 : 22} fontWeight={fontWeight}>
                          {companyName || 'اسم الشركة'}
                        </text>
                        <line x1="75" y1="168" x2="220" y2="168" stroke={color} strokeWidth="1.8" />
                        <text x="250" y="174" textAnchor="middle" fill={color} fontSize="17">★</text>
                        <line x1="280" y1="168" x2="425" y2="168" stroke={color} strokeWidth="1.8" />
                        <text x="250" y="235" textAnchor="middle" fill={color} fontSize="19" fontWeight={Math.min(fontWeight, 800)}>
                          {taxRectLabel}: {taxNumber || '0000000000'}
                        </text>
                        <text x="250" y="285" textAnchor="middle" fill={color} fontSize="19" fontWeight={Math.min(fontWeight, 800)}>
                          {crRectLabel}: {crNumber || '0000000000'}
                        </text>
                        <line x1="100" y1="330" x2="220" y2="330" stroke={color} strokeWidth="1.2" strokeDasharray="4 3" />
                        <text x="250" y="335" textAnchor="middle" fill={color} fontSize="14">◆</text>
                        <line x1="280" y1="330" x2="400" y2="330" stroke={color} strokeWidth="1.2" strokeDasharray="4 3" />
                        <text x="250" y="380" textAnchor="middle" fill={color} fontSize="13.5" fontWeight="800" letterSpacing="4px">
                          ★ OFFICIAL REGISTRATION ★
                        </text>
                      </>
                    )}

                    {shape === 'rectangle' && (
                      <>
                        <rect x="24" y="24" width="552" height="352" fill="none" stroke={color} strokeWidth={borderThickness} strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="38" y="38" width="524" height="324" fill="none" stroke={color} strokeWidth={Math.max(1.75, borderThickness * 0.52)} strokeLinejoin="round" />
                        <text x="300" y="105" textAnchor="middle" fill={color} fontSize={companyName.length > 35 ? 18 : 23} fontWeight={fontWeight}>
                          {companyName || 'اسم الشركة'}
                        </text>
                        <line x1="75" y1="145" x2="270" y2="145" stroke={color} strokeWidth="1.8" />
                        <text x="300" y="151" textAnchor="middle" fill={color} fontSize="17">★</text>
                        <line x1="330" y1="145" x2="525" y2="145" stroke={color} strokeWidth="1.8" />
                        <text x="300" y="202" textAnchor="middle" fill={color} fontSize="19.5" fontWeight={Math.min(fontWeight, 800)}>
                          {taxRectLabel}: {taxNumber || '0000000000'}
                        </text>
                        <text x="300" y="250" textAnchor="middle" fill={color} fontSize="19.5" fontWeight={Math.min(fontWeight, 800)}>
                          {crRectLabel}: {crNumber || '0000000000'}
                        </text>
                        <line x1="120" y1="288" x2="260" y2="288" stroke={color} strokeWidth="1.2" strokeDasharray="4 3" />
                        <text x="300" y="293" textAnchor="middle" fill={color} fontSize="14">◆</text>
                        <line x1="340" y1="288" x2="480" y2="288" stroke={color} strokeWidth="1.2" strokeDasharray="4 3" />
                        <text x="300" y="328" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" letterSpacing="4px">
                          AUTHORIZED COMPANY STAMP
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
