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

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-14 pt-10 sm:px-10 sm:pb-16 md:justify-center md:px-14 lg:px-20 xl:px-24">
        <div className="max-w-xl md:max-w-2xl">
          <img
            src="/sport-pesa-racing-logo-white.png"
            alt="SportPesa Racing"
            className="hero-animate-rise h-auto w-[min(100%,19rem)] opacity-90 sm:w-[min(100%,22rem)] md:w-[min(100%,26rem)]"
            style={{ animationDelay: '80ms' }}
          />

          <h1
            className="hero-animate-rise mt-8 font-heading text-[clamp(2.35rem,7vw,4.75rem)] leading-[0.95] font-semibold tracking-wide text-[#dce3ff] uppercase sm:mt-10"
            style={{ animationDelay: '220ms' }}
          >
            The car is touring{' '}
            <span className="text-brand-pink-hot">Kenyan malls</span>
          </h1>

          <p
            className="hero-animate-rise mt-5 max-w-md text-base leading-relaxed text-[#b8c4ef]/85 sm:text-lg"
            style={{ animationDelay: '360ms' }}
          >
            Register for your chance to see the SportPesa Racing car up close
            and take photos with the legend.
          </p>

          <div
            className="hero-animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '480ms' }}
          >
            <Button
              render={<a href="#register" />}
              nativeButton={false}
              size="lg"
              className="hero-animate-glow h-12 rounded-full bg-brand-pink px-8 text-base font-semibold tracking-wide text-white hover:bg-brand-pink-hot"
            >
              Register to view the car
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
