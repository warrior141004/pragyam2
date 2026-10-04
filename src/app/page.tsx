import Link from "next/link";
import Image from "next/image";
import HeroArt from "@/components/home/HeroArt";
import Countdown from "@/components/home/Countdown";
import LatestEvents from "@/components/home/LatestEvents";
import { WaveRule, SectionTitle, Silhouettes } from "@/components/home/Decor";
import { SectionEdge, Doodle } from "@/components/home/Vector";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { EVENT } from "@/config/event";

export default function Home() {
  return (
    <div>
      <HeroArt />

      <section className="section-cream relative overflow-hidden">
        <SectionEdge shape="scallop" fill="#2b1e14" />
        <Image
          src="/images/pragyam-logo-dark.png"
          alt=""
          width={420}
          height={420}
          className="pointer-events-none absolute -left-28 top-6 hidden w-[380px] opacity-[0.07] md:block"
        />
        <Doodle kind="gear" size={110} className="spin-slow right-[6%] top-16 hidden md:block" />
        <Doodle kind="chip" size={80} className="float-y left-[8%] bottom-14 hidden md:block" style={{ "--t": "7s" } as React.CSSProperties} />
        <Doodle kind="cloud" size={90} className="float-y right-[14%] bottom-10 hidden lg:block" style={{ "--t": "9s", "--d": "-4s" } as React.CSSProperties} />

        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-20 text-center">
          <ScrollReveal>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink">
              {EVENT.name} is coming soon.{" "}
              <Link href="/host" className="text-orange underline underline-offset-4">
                Host an event
              </Link>{" "}
              or register for one — no account needed.
            </p>

            <div className="mt-8">
              <WaveRule
                icon={<Image src="/images/pragyam-logo-dark.png" alt="" width={28} height={28} className="h-7 w-7 opacity-80" />}
              />
            </div>

            <div className="mt-10">
              <Countdown target={EVENT.dateISO} since={EVENT.announcedISO} />
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/host" className="btn btn-orange">
                Add to the build-up — host
              </Link>
              <Link href="/events" className="btn btn-primary">
                See what&apos;s on
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Silhouettes />

      <section className="section-paper relative px-5 py-16 sm:py-20">
        <SectionEdge shape="zigzag" fill="#3a2213" />
        <Doodle kind="satellite" size={96} className="float-y left-[5%] top-24 hidden lg:block" style={{ "--t": "8s" } as React.CSSProperties} />
        <Doodle kind="dome" size={84} className="float-y right-[5%] bottom-16 hidden lg:block" style={{ "--t": "6s", "--d": "-2s" } as React.CSSProperties} />
        <ScrollReveal>
          <SectionTitle>Latest events</SectionTitle>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-5xl">
          <LatestEvents />
        </ScrollReveal>
        <ScrollReveal delay={0.15} className="mt-12 text-center">
          <Link href="/events" className="btn btn-primary">
            See all events
          </Link>
        </ScrollReveal>
      </section>

      <section className="relative bg-orange px-5 pb-20 pt-20 text-center text-white">
        <SectionEdge shape="wave" fill="#efe6d8" />
        <Doodle kind="kite" size={90} className="float-y left-[7%] top-12 hidden md:block" style={{ "--t": "8s", "--d": "-3s" } as React.CSSProperties} />
        <Doodle kind="kite" size={70} className="float-y right-[8%] top-20 hidden md:block" style={{ "--t": "10s" } as React.CSSProperties} />
        <ScrollReveal>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-white/85">For students, by students</p>
          <h2 className="font-display mt-3 text-4xl sm:text-6xl">Have an idea? Host your event</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">
            A quiz, a hackathon, a game night, a design jam — pitch it in a few minutes. Organizers review it and you get an
            email the moment it&apos;s approved.
          </p>
          <Link href="/host" className="btn btn-white mt-8">
            Propose your event
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
