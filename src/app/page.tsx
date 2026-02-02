"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { wrappedData } from "@/data/wrappedData";

const slideTransition = { type: "spring", stiffness: 140, damping: 24 } as const;
type Slide = (typeof wrappedData.slides)[number];

function useCountUp(value: number, formatter: (val: number) => string) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(formatter(0));

  useEffect(() => {
    const clamp = (latest: number) =>
      value >= 0 ? Math.min(latest, value) : Math.max(latest, value);

    motionValue.set(0);
    const controls = animate(motionValue, value, {
      type: "tween",
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(formatter(clamp(latest)));
      },
      onComplete: () => {
        setDisplay(formatter(value));
      },
    });

    return () => controls.stop();
  }, [motionValue, value, formatter]);

  return display;
}

function BackgroundMedia({
  src,
  overlay,
}: {
  src: string;
  overlay: number;
}) {
  const isVideo = src.endsWith(".mp4");

  return (
    <div className="absolute inset-0">
      {isVideo ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img
          className="h-full w-full object-cover"
          src={src}
          alt=""
          loading="lazy"
        />
      )}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay }}
      />
    </div>
  );
}

function ProgressBar({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  return (
    <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <motion.div
              className="h-full rounded-full bg-white"
              initial={false}
              animate={{
                width: isComplete || isActive ? "100%" : "0%",
                opacity: isComplete || isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        );
      })}
    </div>
  );
}

function SlideText({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const stagger = {
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: slideTransition },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {eyebrow ? (
        <motion.p
          variants={item}
          className="text-xs uppercase tracking-[0.4em] text-white/60"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h1
        variants={item}
        className="text-3xl font-extrabold leading-tight text-white"
        style={{
          fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
        }}
      >
        {title}
      </motion.h1>
      {subtitle ? (
        <motion.p
          variants={item}
          className="text-sm font-medium text-white/70"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function SlideContent({ id }: { id: string }) {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const fadeStagger = {
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: slideTransition },
  };

  const formatCurrency = useCallback(
    (val: number) => currencyFormatter.format(val),
    [currencyFormatter],
  );

  const formatNumber = useCallback(
    (val: number) => numberFormatter.format(val),
    [numberFormatter],
  );

  const formatPercent = useCallback((val: number) => `${val.toFixed(2)}%`, []);

  if (id === "intro") {
    const stagger = {
      show: {
        transition: {
          staggerChildren: 0.14,
        },
      },
    };

    const item = {
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: slideTransition },
    };

    return (
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="text-[16px] font-semibold tracking-[0.08em] text-white/90"
        >
          {wrappedData.intro.titleSmall}
        </motion.p>
        <motion.h1
          variants={item}
          className="text-[44px] font-extrabold leading-[1.1] text-white"
          style={{
            fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
          }}
        >
          {wrappedData.intro.titleLarge}
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-[280px] text-[14px] font-medium leading-[1.6] text-white/80"
        >
          {wrappedData.intro.lineOne}
        </motion.p>
        <motion.p
          variants={item}
          className="text-[13px] font-medium text-white"
        >
          This is your portfolio{" "}
          <span className="font-extrabold">wrapped</span>
        </motion.p>
      </motion.div>
    );
  }

  if (id === "pnl") {
    const pnlDisplay = useCountUp(wrappedData.pnl.total, formatCurrency);
    const biggestWinDisplay = useCountUp(
      wrappedData.pnl.biggestWin,
      formatCurrency,
    );
    const peakDisplay = useCountUp(
      wrappedData.pnl.peakAccountValue,
      formatCurrency,
    );
    const rateDisplay = useCountUp(wrappedData.pnl.rateOfReturn, formatPercent);

    return (
      <motion.div
        className="space-y-8 text-left"
        variants={fadeStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-2" variants={fadeItem}>
          <p className="text-[14px] font-semibold text-white/90">Total P&L</p>
          <h2
            className="text-[44px] font-extrabold leading-[1.05] text-white"
            style={{
              fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
            }}
          >
            <span className="text-[var(--profit)]">+</span>
            {pnlDisplay}
          </h2>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 gap-x-6 gap-y-8 text-white"
          variants={fadeStagger}
        >
          <motion.div variants={fadeItem}>
            <p className="text-[12px] font-semibold text-white/80">
              Biggest win
            </p>
            <p className="text-[18px] font-extrabold text-white">
              <span className="text-[var(--profit)]">+</span>
              {biggestWinDisplay}
            </p>
          </motion.div>
          <motion.div variants={fadeItem}>
            <p className="text-[12px] font-semibold text-white/80">
              Rate of return
            </p>
            <p className="text-[18px] font-extrabold text-white">
              <span className="text-[var(--profit)]">+</span>
              {rateDisplay}
            </p>
          </motion.div>
          <motion.div variants={fadeItem}>
            <p className="text-[12px] font-semibold text-white/80">
              Peak acc value
            </p>
            <p className="text-[18px] font-extrabold text-white">
              {peakDisplay}
            </p>
          </motion.div>
          <motion.div variants={fadeItem}>
            <p className="text-[12px] font-semibold text-white/80">
              Most profitable symbol
            </p>
            <p className="text-[18px] font-extrabold text-white">
              {wrappedData.pnl.mostProfitableSymbol}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (id === "ticker") {
    const totalVolumeDisplay = useCountUp(
      wrappedData.tickerSlide.totalVolume,
      formatCurrency,
    );

    return (
      <motion.div
        className="space-y-10 text-left"
        variants={fadeStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="grid grid-cols-2 gap-8 text-white"
          variants={fadeStagger}
        >
          <motion.div className="space-y-3" variants={fadeItem}>
            <p className="text-[13px] font-semibold text-white/80">
              Most traded stocks
            </p>
            <div className="space-y-2 text-[14px] font-semibold text-white">
              {wrappedData.tickerSlide.mostTraded.map((symbol, index) => (
                <div key={symbol} className="flex items-center gap-2">
                  <span className="text-white/70">{index + 1}</span>
                  <span>{symbol}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="space-y-3" variants={fadeItem}>
            <p className="text-[13px] font-semibold text-white/80">
              Trade volume
            </p>
            <div className="space-y-2 text-[14px] font-semibold text-white">
              {wrappedData.tickerSlide.tradeVolumes.map((volume, index) => (
                <div key={`${volume}-${index}`} className="flex items-center gap-2">
                  <span className="text-white/70">{index + 1}</span>
                  <span>{formatCurrency(volume)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="space-y-2" variants={fadeItem}>
          <p className="text-[13px] font-semibold text-white/80">Total volume</p>
          <h2
            className="text-[44px] font-extrabold leading-[1.05] text-white"
            style={{
              fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
            }}
          >
            {totalVolumeDisplay}
          </h2>
        </motion.div>
      </motion.div>
    );
  }

  if (id === "rank") {
    return (
      <motion.div
        className="space-y-6"
        variants={fadeStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeItem}>
          <SlideText
            eyebrow="P&L rank"
            title={`Top ${100 - wrappedData.rankPercentile}%`}
            subtitle="You outranked your class (Age 25 - 35)"
          />
        </motion.div>
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
          variants={fadeItem}
        >
          <div className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">
            Percentile
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[var(--profit)]"
              initial={{ width: "0%" }}
              animate={{ width: `${wrappedData.rankPercentile}%` }}
              transition={slideTransition}
            />
          </div>
          <div className="mt-3 text-sm text-white/70">
            {wrappedData.rankPercentile}th percentile
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (id === "time") {
    return (
      <motion.div
        className="space-y-8 text-center text-white"
        variants={fadeStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-2" variants={fadeItem}>
          <p className="text-[14px] font-semibold text-white/90">
            You were trading for...
          </p>
          <h2
            className="text-[40px] font-extrabold leading-[1.1] text-white"
            style={{
              fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
            }}
          >
            {wrappedData.timeSlide.tradingTime}
          </h2>
          <p className="text-[14px] font-semibold text-white/90">
            on {wrappedData.timeSlide.platform}
          </p>
        </motion.div>
        <motion.div className="grid grid-cols-2 gap-4" variants={fadeStagger}>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">
              Total logins
            </p>
            <p className="text-[20px] font-extrabold text-white">
              <span className="text-[var(--profit)]">+</span>
              {formatNumber(wrappedData.timeSlide.totalLogins)}
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">Ranking</p>
            <p className="text-[20px] font-extrabold text-white">
              {wrappedData.timeSlide.ranking}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (id === "finale") {
    const finaleRate = useCountUp(wrappedData.finale.rateOfReturn, formatPercent);

    return (
      <motion.div
        className="flex flex-col gap-6 text-left text-white"
        variants={fadeStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-3" variants={fadeItem}>
          <p className="text-[14px] font-semibold text-white/80">
            Trading archetype
          </p>
          <h2
            className="text-[40px] font-extrabold leading-[1.1] text-white"
            style={{
              fontFamily: '"Spotify Mix UI Title", "Spotify Mix UI", sans-serif',
            }}
          >
            “{wrappedData.finale.title}”
          </h2>
        </motion.div>
        <motion.div className="mt-1 grid grid-cols-2 gap-4" variants={fadeStagger}>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">
              P&L Ranking
            </p>
            <p className="text-[18px] font-extrabold text-white">
              {wrappedData.finale.pnlRanking}
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">
              Rate of return
            </p>
            <p className="text-[18px] font-extrabold text-white">
              <span className="text-[var(--profit)]">+</span>
              {finaleRate}
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">
              Most traded symbol
            </p>
            <p className="text-[18px] font-extrabold text-white">
              {wrappedData.finale.mostTradedSymbol}
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
            variants={fadeItem}
          >
            <p className="text-[12px] font-semibold text-white/80">
              Time spent
            </p>
            <p className="text-[18px] font-extrabold text-white">
              {wrappedData.finale.timeSpent}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <SlideText
      eyebrow="Trading Wrapped"
      title={wrappedData.slides[0].title}
      subtitle={wrappedData.slides[0].subtitle}
    />
  );
}

function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative h-40 w-full [perspective:1000px]">
      <motion.div
        className="h-full w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-5 text-white shadow-[0_0_30px_rgba(0,255,148,0.15)]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={slideTransition}
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-3xl p-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-white/60">
            Trading Personality
          </div>
          <div className="text-2xl font-extrabold">
            {wrappedData.archetype.title}
          </div>
          <div className="text-sm text-white/70">
            {wrappedData.archetype.description}
          </div>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-3xl p-5 text-white"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-white/60">
            Roast
          </div>
          <div className="text-lg font-semibold">{wrappedData.archetype.roast}</div>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            <span>{wrappedData.statsSummary.bestTicker}</span>
            <span>{wrappedData.statsSummary.trades} trades</span>
            <span>{wrappedData.statsSummary.tradeVolume}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const slides = wrappedData.slides as readonly Slide[];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const activeSlide = slides[currentIndex] ?? slides[0];
  const activeSlideId = activeSlide.id;
  const isIntro = activeSlideId === "intro";
  const isPnL = activeSlideId === "pnl";
  const isTicker = activeSlideId === "ticker";
  const isTime = activeSlideId === "time";
  const isFinale = activeSlideId === "finale";
  const isRank = activeSlideId === "rank";

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 py-6">
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border-[10px] border-black bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <main className="relative min-h-[720px] w-full">
          <ProgressBar total={slides.length} activeIndex={currentIndex} />
          <AnimatePresence mode="wait">
            <motion.section
              key={activeSlideId}
              className="relative min-h-[720px] w-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={slideTransition}
            >
              <BackgroundMedia
                src={activeSlide.background}
                overlay={activeSlide.overlay}
              />
              <div className="relative z-10 flex min-h-[720px] flex-col px-6 pb-10 pt-16">
                {isIntro ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <SlideContent id={activeSlideId} />
                    </div>
                    <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                      <img
                        src="/assets/figma/slide1/Vector-x1.png"
                        alt=""
                        className="h-8 w-8"
                      />
                      <span className="tracking-[0.2em]">
                        {wrappedData.intro.footer}
                      </span>
                    </div>
                  </>
                ) : isPnL ? (
                  <>
                    <div className="flex flex-1 items-center justify-start">
                      <div className="w-full max-w-[320px]">
                        <SlideContent id={activeSlideId} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                      <img
                        src="/assets/figma/slide1/Vector-x1.png"
                        alt=""
                        className="h-8 w-8"
                      />
                      <span className="tracking-[0.2em]">
                        {wrappedData.pnl.footer}
                      </span>
                    </div>
                  </>
                ) : isTicker ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="w-full max-w-[340px]">
                        <SlideContent id={activeSlideId} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                      <img
                        src="/assets/figma/slide1/Vector-x1.png"
                        alt=""
                        className="h-8 w-8"
                      />
                      <span className="tracking-[0.2em]">
                        {wrappedData.tickerSlide.footer}
                      </span>
                    </div>
                  </>
                ) : isTime ? (
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-1 items-center justify-center">
                      <div className="w-full max-w-[320px]">
                        <SlideContent id={activeSlideId} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                      <img
                        src="/assets/figma/slide1/Vector-x1.png"
                        alt=""
                        className="h-8 w-8"
                      />
                      <span className="tracking-[0.2em]">
                        {wrappedData.timeSlide.footer}
                      </span>
                    </div>
                  </div>
                ) : isFinale ? (
                  <div className="flex flex-1 flex-col justify-between pt-8">
                    <div className="w-full max-w-[340px]">
                      <SlideContent id={activeSlideId} />
                    </div>
                    <div className="flex flex-col gap-3">
                      <button className="mb-[50px] flex w-full items-center justify-center gap-2 rounded-full bg-white/85 px-5 py-3 text-sm font-semibold text-black">
                        <img
                          src="/assets/share.svg"
                          alt=""
                          className="h-4 w-4"
                        />
                        <span>Share</span>
                      </button>
                      <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                        <img
                          src="/assets/figma/slide1/Vector-x1.png"
                          alt=""
                          className="h-8 w-8"
                        />
                        <span className="tracking-[0.2em]">
                          {wrappedData.finale.footer}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : isRank ? (
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-1 items-center justify-center">
                      <div className="space-y-8">
                        <SlideContent id={activeSlideId} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between text-[12px] font-semibold text-white">
                      <img
                        src="/assets/figma/slide1/Vector-x1.png"
                        alt=""
                        className="h-8 w-8"
                      />
                      <span className="tracking-[0.2em]">
                        {wrappedData.rankSlide.footer}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-between">
                    <div />
                    <div className="space-y-8">
                      <SlideContent id={activeSlideId} />
                      <div className="text-xs uppercase tracking-[0.4em] text-white/50">
                        Tap left or right
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
          <div className="absolute inset-0 z-20 flex">
            <button
              className="h-full w-1/2 bg-transparent"
              aria-label="Previous slide"
              onClick={goPrev}
            />
            <button
              className="h-full w-1/2 bg-transparent"
              aria-label="Next slide"
              onClick={goNext}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
