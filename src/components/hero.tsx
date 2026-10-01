import { ChevronRightIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-brand-navy-deep text-white">
      {/* Full-bleed car — keep it vivid */}
      <div className="hero-animate-car absolute inset-0">
        <img
          src="/racing-car.jpg"
          alt="SportPesa Racing Point Formula 1 car"
          className="h-full w-full scale-105 object-cover object-[72%_42%] brightness-[1.08] contrast-[1.08] saturate-[1.35] md:object-[78%_40%]"
        />
        {/* Readability only on the copy side — leave the car open */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep from-0% via-brand-navy-deep/88 via-[32%] to-transparent to-[68%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/70 via-transparent via-40% to-brand-navy-deep/25" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(ellipse_at_70%_55%,rgb(236_0_140/0.22),transparent_60%)]"
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col px-5 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20 lg:px-20 xl:px-24">
        <div className="flex min-h-0 w-full max-w-[min(100%,42rem)] flex-1 flex-col justify-between gap-10 py-[clamp(0.5rem,4vh,2.5rem)]">
          <img
            src="/sport-pesa-racing-logo-white.png"
            alt="SportPesa Racing"
            className="hero-animate-rise h-auto w-[min(100%,19rem)] shrink-0 opacity-90 sm:w-[min(100%,22rem)] md:w-[min(100%,26rem)]"
            style={{ animationDelay: '80ms' }}
          />

          <div className="flex flex-col gap-6 sm:gap-8">
            <h1
              className="hero-animate-rise font-heading font-semibold tracking-[0.02em] uppercase"
              style={{ animationDelay: '220ms' }}
            >
              <span className="block whitespace-nowrap text-[clamp(1.15rem,4.6vw+0.35rem,3.25rem)] leading-[1.05] text-white">
                BEEN AROUND THE WORLD.
              </span>
              <span className="mt-3 block whitespace-nowrap text-[clamp(1.35rem,5.4vw+0.4rem,3.85rem)] leading-[1.05] text-brand-pink-hot sm:mt-4">
                NOW HOME FOR GOOD.
              </span>
            </h1>

            <p
              className="hero-animate-rise font-heading text-[clamp(0.7rem,1.6vw+0.35rem,1.05rem)] font-semibold tracking-[0.04em] text-white uppercase"
              style={{ animationDelay: '360ms' }}
            >
              <span className="block whitespace-nowrap">
                GET UP CLOSE AND PERSONAL
              </span>
              <span className="mt-1.5 block whitespace-nowrap">
                WITH A PIECE OF RACING HISTORY.
              </span>
            </p>
          </div>

          <div
            className="hero-animate-rise flex shrink-0 flex-wrap items-center gap-3"
            style={{ animationDelay: '480ms' }}
          >
            <Button
              render={<a href="#register" />}
              nativeButton={false}
              size="lg"
              className="hero-animate-glow h-12 rounded-full bg-brand-pink px-8 text-base font-semibold tracking-wide text-white uppercase hover:bg-brand-pink-hot"
            >
              REGISTER NOW
              <ChevronRightIcon className="size-5" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
