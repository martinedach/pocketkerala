"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  getSubscriberMilestoneThreshold,
  milestoneEarlySupporterEn,
  milestoneEarlySupporterMl,
  milestoneThanksTitleEn,
  milestoneThanksTitleMl,
  milestoneUnavailableEn,
  milestoneUnavailableMl,
} from "@/lib/subscriberMilestone";
import { parseYoutubeChannelHandle } from "@/lib/youtubeChannelHandle";

/** Default @handle (https://www.youtube.com/@PocketKerala) — same API key, `channels.list` `forHandle`. */
const DEFAULT_MILESTONE_CHANNEL_HANDLE = "PocketKerala";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;

type Lang = "en" | "ml";

type CountdownSectionProps = {
  lang: Lang;
  postLaunchMessage: string;
  description: string;
  videoSrc: string;
};

function parseSubscriberCount(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function CountdownSection({
  lang,
  postLaunchMessage,
  description,
  videoSrc,
}: CountdownSectionProps) {
  const [videoUrl, setVideoUrl] = useState(videoSrc);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null);
  const [countdownMessage, setCountdownMessage] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState(() =>
    lang === "en" ? milestoneUnavailableEn() : milestoneUnavailableMl(),
  );

  useEffect(() => {
    const launchDate = new Date("Jan 2, 2026 18:30:00 GMT+0530").getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = launchDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setCountdownMessage("");
      } else {
        clearInterval(interval);
        setTimeLeft(null);
        setCountdownMessage(postLaunchMessage);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [postLaunchMessage]);

  useEffect(() => {
    const loadVideoUrl = async () => {
      const { data, error } = await supabase
        .from("homepage_settings")
        .select("video_url")
        .eq("id", "default")
        .maybeSingle();

      if (error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load homepage_settings.video_url", error);
        return;
      }

      if (data?.video_url) {
        setVideoUrl(data.video_url);
      }
    };

    loadVideoUrl();
  }, [videoSrc]);

  useEffect(() => {
    const rawHandle =
      typeof process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_HANDLE === "string"
        ? process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_HANDLE.trim()
        : "";
    const handleFromEnv = rawHandle
      ? parseYoutubeChannelHandle(rawHandle)
      : null;

    const envChannelId =
      typeof process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID === "string"
        ? process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID.trim()
        : "";

    const statsUrl = handleFromEnv
      ? `/api/admin/youtube-channel?handle=${encodeURIComponent(handleFromEnv)}`
      : envChannelId.length > 0
        ? `/api/admin/youtube-channel?channelId=${encodeURIComponent(envChannelId)}`
        : `/api/admin/youtube-channel?handle=${encodeURIComponent(DEFAULT_MILESTONE_CHANNEL_HANDLE)}`;

    let cancelled = false;
    fetch(statsUrl)
      .then(async (res) => {
        const data = (await res.json()) as {
          error?: string;
          subscriberCount?: unknown;
        };
        if (!res.ok || data.error) {
          return { ok: false as const, subscriberCount: null };
        }
        const subscriberCount = parseSubscriberCount(data.subscriberCount);
        return {
          ok: subscriberCount !== null,
          subscriberCount,
        };
      })
      .then((result) => {
        if (cancelled) return;
        if (!result.ok || result.subscriberCount === null) {
          setMilestoneTitle(
            lang === "en" ? milestoneUnavailableEn() : milestoneUnavailableMl(),
          );
          return;
        }
        const threshold = getSubscriberMilestoneThreshold(
          result.subscriberCount,
        );
        if (threshold === null) {
          setMilestoneTitle(
            lang === "en"
              ? milestoneEarlySupporterEn()
              : milestoneEarlySupporterMl(),
          );
          return;
        }
        setMilestoneTitle(
          lang === "en"
            ? milestoneThanksTitleEn(threshold)
            : milestoneThanksTitleMl(threshold),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setMilestoneTitle(
            lang === "en" ? milestoneUnavailableEn() : milestoneUnavailableMl(),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <section className="announcement-section">
      <h2 className="milestone-title">{milestoneTitle}</h2>

      <div id="countdown-timer" className="countdown-container">
        {timeLeft && (
          <>
            <div className="countdown-box">
              <div className="countdown-value">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-value">{timeLeft.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-value">{timeLeft.minutes}</div>
              <div className="countdown-label">Mins</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-value">{timeLeft.seconds}</div>
              <div className="countdown-label">Secs</div>
            </div>
          </>
        )}
      </div>
      <div id="countdown-message" className="countdown-message">
        {countdownMessage}
      </div>

      <div className="video-container">
        <iframe
          src={videoUrl}
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <p>{description}</p>
    </section>
  );
}

