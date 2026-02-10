"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;

type CountdownSectionProps = {
  milestoneTitle: string;
  postLaunchMessage: string;
  description: string;
  videoSrc: string;
};

export function CountdownSection({
  milestoneTitle,
  postLaunchMessage,
  description,
  videoSrc,
}: CountdownSectionProps) {
  const [videoUrl, setVideoUrl] = useState(videoSrc);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null);
  const [countdownMessage, setCountdownMessage] = useState("");

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

