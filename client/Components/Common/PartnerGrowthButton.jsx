import React, { useContext, useEffect, useState } from "react";
import { Badge, BlockStack, Button, InlineGrid, InlineStack, Modal, Spinner, Text } from "@shopify/polaris";
import { CalendarTimeIcon, ChartVerticalIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { ProfileContext } from "@/Context/ProfileContext";
import { generatePartnerAppUrl } from "../../Utils/Utils";
import Meeting from "./Meeting";

export default function PartnerGrowthButton() {
  const { profileData } = useContext(ProfileContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);

  const caseStudies = [
    {
      tagline: "SEO strategy",
      heading: "How Hero Life Care Achieved 200% Growth with Our Shopify eCommerce SEO Strategy",
      description:
        "How Webrex Studio's strategic SEO approach transformed Hero Life Care's online presence, delivering 3× search impressions, 2× CTR improvement, and $23K in revenue growth.",
      url: "https://www.webrexstudio.com/case-studies/hero-life-care-seo-case-study/",
    },
    {
      tagline: "SEO and marketplace",
      heading: "430% Traffic Surge & 277% Impression Growth in 6 Months FavoriteBikes SEO Case Study",
      description:
        "How we transformed FavoriteBikes' search visibility with targeted SEO optimization and marketplace alignment, driving significant traffic growth and Costco marketplace success.",
      url: "https://www.webrexstudio.com/case-studies/favoritebikes-seo-improvement/",
    },
    {
      tagline: "Overall Shopify design and optimisation",
      heading:
        "Conversion Rate Jumped from 0.2% to 1.3% & Weekly Orders Grew 4–5× StepUp Coffee Shopify Case Study",
      description:
        "How Webrex streamlined StepUp Coffee's product strategy, improved UX performance, and lifted conversions with a brand-first approach.",
      url: "https://www.webrexstudio.com/case-studies/stepup-case-study/",
    },
    {
      tagline: "CRO",
      heading: "Mobile Speed Increased 194% & Desktop Performance Rose 77% Bullion Knot Shopify Optimization",
      description:
        "How Webrex Studio optimized Bullion Knot's Shopify performance achieving exceptional speed improvements and Core Web Vitals excellence for better UX & conversion readiness.",
      url: "https://www.webrexstudio.com/case-studies/bullion-knot-speed/",
    },
    {
      tagline: "Custom development",
      heading: "18% Conversion Increase & 50% Faster Load Times Through a Shopify Redesign",
      description:
        "How Webrex Studio transformed FavoriteBikes with custom Shopify development and CRO-driven redesign, creating a faster, scalable, app-free store with +18% conversion lift.",
      url: "https://www.webrexstudio.com/case-studies/favorite-bike-redesign/",
    },
  ];

  const videoData = [
    {
      url: "https://www.loom.com/share/74dab80cf50141eea3fb9985c9398997",
      websiteUrl: "https://www.webrexstudio.com",
      embedUrl:
        "https://www.loom.com/embed/96ef2a3e85a54de4b5b2a5fdde7df26f?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&hide_speed=true",
    },
    {
      url: "https://www.loom.com/share/49a867b790ae42548b065e791df91d7c",
      websiteUrl: "https://www.webrexstudio.com",
      embedUrl:
        "https://www.loom.com/embed/7d97f48d74454b99a6a337d49b7d8064?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&hide_speed=true",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  const nextVideoSlide = () => {
    setVideoLoading(true);
    setCurrentVideoSlide((prev) => (prev + 1) % videoData.length);
  };

  const prevVideoSlide = () => {
    setVideoLoading(true);
    setCurrentVideoSlide((prev) => (prev - 1 + videoData.length) % videoData.length);
  };

  const handleRedirect = (url) => {
    if (url) {
      const appName = process.env.SHOPIFY_APP_NAME || "Webrex AI SEO Optimizer Schema";
      const urlWithUtm = generatePartnerAppUrl(url, appName);
      window.open(urlWithUtm, "_blank");
    }
  };

  useEffect(() => {
    if (!showTooltip) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showTooltip, caseStudies.length]);

  useEffect(() => {
    if (showTooltip) {
      setVideoLoading(true);
    }
  }, [showTooltip]);

  if (!profileData) return;

  return (
    <>
      <Button
        onClick={() => setShowTooltip(!showTooltip)}
        icon={ChartVerticalIcon}
        variant="primary"
        tone="success"
      >
        <Text variant="bodyLg">{t("common.Case Study 200% SEO Growth")}</Text>
      </Button>
      <Modal
        fullScreen={true}
        open={showTooltip}
        onClose={() => setShowTooltip(false)}
        title={
          <BlockStack>
            <Text variant="headingMd">{t("common.Case Study 200% SEO Growth")}</Text>
            <Text variant="bodySm" tone="subdued">
              {t("common.Data-backed SEO improvements that boost traffic, rankings, and sales.")}
            </Text>
          </BlockStack>
        }
      >
        <Modal.Section>
          <div className="partner-growth-modal-section" style={{ padding: "20px" }}>
            <BlockStack gap="800">
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    padding: "30px",
                    borderRadius: "12px",
                    color: "black",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    background: "white",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <button
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      left: "-20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 3,
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "rgba(156, 163, 175, 0.9)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(156, 163, 175, 1)";
                      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(156, 163, 175, 0.9)";
                      e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                    }}
                    aria-label="Previous case study"
                  >
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      right: "-20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 3,
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "rgba(156, 163, 175, 0.9)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(156, 163, 175, 1)";
                      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(156, 163, 175, 0.9)";
                      e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                    }}
                    aria-label="Next case study"
                  >
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div style={{ zIndex: 2 }}>
                    <BlockStack gap="300">
                      <div>
                        <Badge tone="attention" size="large">
                          <Text variant="bodyMd" as="span" fontWeight="semibold">
                            {t(`common.${caseStudies[currentSlide].tagline}`)}
                          </Text>
                        </Badge>
                      </div>

                      <Text variant="headingLg">{t(`common.${caseStudies[currentSlide].heading}`)}</Text>
                      <Text variant="bodyMd">{t(`common.${caseStudies[currentSlide].description}`)}</Text>
                      <InlineStack align="start" gap="200">
                        <div className="partner-growth-visit-button">
                          <Button
                            variant="primary"
                            size="micro"
                            onClick={() => handleRedirect(caseStudies[currentSlide].url)}
                          >
                            {t("common.Visit website")}
                          </Button>
                        </div>
                        <div className="partner-growth-consulting-button">
                          <Meeting
                            page="https://appt.link/webrex-studio/e-commerce-and-shopify-growth"
                            button={t("common.Free eCommerce Growth Consulting")}
                            size="micro"
                            variant="primary"
                          />
                        </div>
                      </InlineStack>
                    </BlockStack>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    gap: "8px",
                  }}
                >
                  {caseStudies.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      style={{
                        width: currentSlide === index ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        background: currentSlide === index ? "#333333" : "#D1D5DB",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>

              <BlockStack gap="200">
                <BlockStack>
                  <Text variant="headingLg" alignment="center" style={{ marginBottom: "30px" }}>
                    {t("common.Check free growth consulting sample")}
                  </Text>

                  <div style={{ position: "relative", padding: "20px 0" }}>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <button
                        onClick={prevVideoSlide}
                        style={{
                          position: "absolute",
                          left: "-20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 3,
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "rgba(156, 163, 175, 0.9)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(156, 163, 175, 1)";
                          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(156, 163, 175, 0.9)";
                          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                        }}
                        aria-label="Previous video"
                      >
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M12.5 15L7.5 10L12.5 5"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={nextVideoSlide}
                        style={{
                          position: "absolute",
                          right: "-20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 3,
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "rgba(156, 163, 175, 0.9)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(156, 163, 175, 1)";
                          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(156, 163, 175, 0.9)";
                          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                        }}
                        aria-label="Next video"
                      >
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M7.5 15L12.5 10L7.5 5"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                        {videoLoading && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#f3f4f6",
                              borderRadius: "12px",
                              zIndex: 2,
                            }}
                          >
                            <Spinner size="large" />
                          </div>
                        )}
                        <iframe
                          key={currentVideoSlide}
                          src={videoData[currentVideoSlide].embedUrl}
                          frameBorder="0"
                          allowFullScreen
                          onLoad={() => setVideoLoading(false)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        ></iframe>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                        gap: "8px",
                      }}
                    >
                      {videoData.map((_, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setVideoLoading(true);
                            setCurrentVideoSlide(index);
                          }}
                          style={{
                            width: currentVideoSlide === index ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            background: currentVideoSlide === index ? "#333333" : "#D1D5DB",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </BlockStack>
                {/* <InlineStack gap="200" align="center" blockAlign="center">
                  <div className="partner-growth-visit-button">
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={() => handleRedirect(caseStudies[currentSlide].websiteUrl)}
                    >
                      {t("common.Visit website")}
                    </Button>
                  </div>
                  <div className="partner-growth-consulting-button">
                    <Meeting
                      page="https://appt.link/webrex-studio/e-commerce-and-shopify-growth"
                      button={t("common.Free eCommerce Growth Consulting")}
                      size="medium"
                      variant="primary"
                    />
                  </div>
                </InlineStack> */}
              </BlockStack>
            </BlockStack>
          </div>

          <div
            style={{
              position: "sticky",
              bottom: "0px",
              padding: "20px",
              background: "rgb(243 243 243)",
              borderRadius: "8px",
              border: "0.0625rem solid rgb(243 243 243 1)",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.1)",
              zIndex: 10000,
            }}
          >
            <InlineStack gap="200" align="end" blockAlign="center">
              <div className="partner-growth-visit-button">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => handleRedirect(videoData[currentVideoSlide].websiteUrl)}
                >
                  {t("common.Visit website")}
                </Button>
              </div>
              <div className="partner-growth-consulting-button">
                <Meeting
                  page="https://appt.link/webrex-studio/e-commerce-and-shopify-growth"
                  button={t("common.Free eCommerce Growth Consulting")}
                  size="medium"
                  variant="primary"
                />
              </div>
            </InlineStack>
          </div>
        </Modal.Section>
      </Modal>
    </>
  );
}
