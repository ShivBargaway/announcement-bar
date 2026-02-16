import React, { useCallback, useContext, useEffect, useState } from "react";
import { BlockStack, Box, Button, Card, Collapsible, Icon, InlineStack, Text } from "@shopify/polaris";
import {
  ChevronRightIcon,
  CodeIcon,
  ImageIcon,
  LinkIcon,
  SearchIcon,
  ShareIcon,
  ThemeTemplateIcon,
} from "@shopify/polaris-icons";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import {
  OnboardBreadcrumb,
  OnboardBrokenlinks,
  OnboardImageOptimization,
  OnboardMetaTags,
  OnboardSchema,
} from "@/Assets/Index";
import DismissibleBanner from "@/Components/Common/DismissibleBanner.jsx";
import { navigate } from "@/Components/Common/NavigationMenu";
import ProgressCircle from "@/Components/Common/ProgressCircle";
import { OnboardingContext } from "@/Context/OnboardingContext";
import Instruction from "@/Pages/OnBoarding/Instruction.jsx";
import { ProfileContext } from "../../Context/ProfileContext";

// Import the Instruction component

export default function OnBoardingPage({ setPrimaryAction }) {
  const fetch = useAuthenticatedFetch();
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const { onboardingData, updateOnboardingData } = useContext(OnboardingContext);
  const [showDoneBanner, setShowDoneBanner] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(t("common.Start Onboarding"));
  const setNavigate = navigate();

  //All the steps with their instructions and actions
  const initialSteps = {
    // speedOptimize: {
    //   isOpen: true,
    //   title: t("common.Google Page Speed Optimization"),
    //   icon: AnalyticsMajor,
    //   iconTone: "success",
    //   showSteps: true,
    //   showTiming: true,
    //   showProgress: true,
    //   description: t(
    //     "onboarding.Activate and analyze your site's speed, to rank your store higher on search results."
    //   ),
    //   status: "pending",
    //   instructions: {
    //     activateGooglePageSpeed: {
    //       title: t("common.Activate Google Page Speed"),
    //       description: t(
    //         "onboarding.Enable the Google Page Speed tool to assess your site's performance and identify opportunities for speed enhancement"
    //       ),
    //       status: "pending",
    //       isLoading: false,
    //       isOpen: true,
    //       time: 1,
    //       actions: [
    //         {
    //           content: t("common.Enable Speed Analysis"),
    //           onAction: () => setNavigate("/speed-optimize"),
    //           buttonVariant: "primary",
    //           buttonSize: "slim",
    //           buttonTone: "base",
    //         },
    //       ],
    //     },
    //     reviewSpeedReport: {
    //       title: t("common.Review Speed Analysis Report"),
    //       description: t(
    //         "onboarding.Examine the detailed speed analysis report to understand your site's current speed metrics and pinpoint areas for improvement."
    //       ),
    //       status: "pending",
    //       isLoading: false,
    //       isOpen: false,
    //       time: 3,
    //       actions: [
    //         {
    //           content: t("common.Go to Reports"),
    //           onAction: () => setNavigate("/speed-optimize"),
    //           buttonVariant: "primary",
    //           buttonSize: "slim",
    //           buttonTone: "base",
    //         },
    //       ],
    //     },
    //   },
    // },
    submitForGoogleIndex: {
      isOpen: false,
      title: t("common.Submit For Google Index"),
      icon: ShareIcon,
      iconTone: "info",
      description: t("common.We are automatically submit your page for google indexing."),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        exploreGoogle: {
          title: t("common.How To Start Submit For Google Index Feature."),
          description: t("Understand how to automatically and manually index page using Submit For Google Index."),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 3,
          video: {
            link: "https://www.loom.com/embed/d7cb1f9bfb4643f78528e28c0e718cd7?sid=f78683ce-6492-4b7a-a661-79ff4559c3b7",
            // thumbnail: GoogleIndexStatus,
          },
          type: "video",
          actions: [
            {
              content: t("common.Submit For Google Index"),
              onAction: () => setNavigate("/google-search-console"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
    metaTags: {
      isOpen: false,
      title: t("common.AI Meta Tags Management"),
      icon: CodeIcon,
      iconTone: "warning",
      description: t(
        "common.Optimize your site's visibility and search engine ranking with our user-friendly Meta Tags feature."
      ),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        explore: {
          title: t("common.Explore Meta Tag Options"),
          description: t(
            "common.Get acquainted with the various meta tag editing and automation options available for individual products and pages."
          ),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 5,
          actions: [
            {
              content: t("common.Explore Meta Tags"),
              onAction: () => setNavigate("/seo-booster/metatags"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
          video: {
            link: "https://www.loom.com/embed/e0a6043948254983973ac098b6a703ab",
            thumbnail: OnboardMetaTags,
          },
          type: "video",
        },
        addEdit: {
          title: t("common.Edit and Optimize"),
          description: t(
            "common.Dive into editing meta titles, descriptions, and image alt texts to enhance your site's SEO and user accessibility."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 10,
          actions: [
            {
              content: t("common.Start Editing"),
              onAction: () => setNavigate("/seo-booster/metatags"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        setupAutomation: {
          title: t("common.Automate for Consistency"),
          description: t(
            "common.Set up automation rules for your meta tags to maintain consistency and efficiency across your product pages."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 5,
          actions: [
            {
              content: t("common.Set Automation"),
              onAction: () => setNavigate("/seo-booster/metatags?tabindex=6"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
    schema: {
      isOpen: false,
      title: t("common.Schema Markup"),
      icon: ThemeTemplateIcon,
      iconTone: "caution",
      description: t(
        "common.Utilize Schema markup to enhance your content's representation in search results and attract more clicks."
      ),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        understand: {
          title: t("common.Learn About Schema Options"),
          description: t(
            "common.Familiarize yourself with the different types of Schema markups available, such as Product, Local Business, FAQ, and more, to understand their benefits."
          ),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 5,
          actions: [
            {
              content: t("common.Explore Schema Types"),
              onAction: () => setNavigate("/schema?backto=home"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
          video: {
            link: "https://www.loom.com/embed/880016df36714c4daf19ae3b0b315385",
            thumbnail: OnboardSchema,
          },
          type: "video",
        },
        enable: {
          title: t("common.Activate Key Schemas"),
          description: t(
            "common.Choose and enable crucial schemas for your site, like Product Schema for e-commerce or Local Business Schema for physical stores."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 10,
          actions: [
            {
              content: t("common.Go to Schemas"),
              onAction: () => setNavigate("/schema?backto=home"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        customize: {
          title: t("common.Customize Schema Details"),
          description: t(
            "common.Customize the settings of each schema type to accurately represent your business or products in search results."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 10,
          actions: [
            {
              content: t("common.Go to Schemas"),
              onAction: () => setNavigate("/schema?backto=home"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        test: {
          title: t("common.Test and Validate Schemas"),
          description: t(
            "common.Test your schemas using tools like Google's Structured Data Testing Tool to ensure they are correctly implemented."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 2,
          actions: [
            {
              content: t("common.Test Schemas"),
              onAction: () => setNavigate("/seo-booster/test-seo-performance"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
            {
              content: t("common.Done"),
              buttonVariant: "tertiary",
              buttonSize: "slim",
            },
          ],
        },
      },
    },
    imageOptimize: {
      isOpen: false,
      title: t("common.Image Optimization"),
      icon: ImageIcon,
      iconTone: "critical",
      description: t("common.Check image optimization features"),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        exploreOptimizatiomFeatures: {
          title: t("common.Explore Optimization Features"),
          description: t(
            "common.Familiarize yourself with the range of image optimization tools available. See how you can improve page load speeds and SEO by optimizing image sizes and formats."
          ),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 1,
          actions: [
            {
              content: t("common.Go to Image Optimization"),
              onAction: () => setNavigate("/speed-booster/imageoptimization"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
          video: {
            link: "https://www.loom.com/embed/4eb92416985d4b9cbd1588972b2cee84",
            thumbnail: OnboardImageOptimization,
          },
          type: "video",
        },
        imageAutomation: {
          title: t("common.Automate Your Image Workflow"),
          description: t(
            "common.Set up automation to seamlessly optimize new images as they are uploaded, ensuring consistent performance across your site."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 5,
          actions: [
            {
              content: t("common.Go to Automation"),
              onAction: () => setNavigate("/speed-booster/imageoptimization?tabindex=3"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        executeBulkOperation: {
          title: t("common.Execute a Bulk Optimization"),
          description: t(
            "common.Perform a bulk optimization to efficiently enhance multiple images at once, which can significantly boost your site's loading time."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 5,
          actions: [
            {
              content: t("common.Go to bulk operations"),
              onAction: () => setNavigate("/speed-booster/imageoptimization?tabindex=4"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
    brokenLinks: {
      isOpen: false,
      title: t("common.Broken Links Management"),
      icon: LinkIcon,
      iconTone: "emphasis",
      description: t(
        "common.Automate the detection and repair of broken links to enhance user experience and SEO rankings."
      ),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        exploreBrokenlinks: {
          title: t("common.Review Detected Broken Links"),
          description: t(
            "common.Examine the list of broken links identified automatically by our system to understand their impact on your site's navigation."
          ),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 3,
          video: {
            link: "https://www.loom.com/embed/02e9231ed26e45d0bdfcba6c3c9b9880",
            thumbnail: OnboardBrokenlinks,
          },
          type: "video",
          actions: [
            {
              content: t("common.View Broken Links"),
              onAction: () => setNavigate("/seo-booster/brokenlink"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        unresolvedBrokenlinks: {
          title: t("common.Address Broken Links"),
          description: t(
            "common.Utilize our tools to quickly fix or redirect broken links, improving your site's integrity and user satisfaction."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 2,
          actions: [
            {
              content: t("common.Resolve Broken Links"),
              onAction: () => setNavigate("/seo-booster/brokenlink?tabindex=1"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
        setupAutomation: {
          title: t("common.Automate for Efficiency"),
          description: t(
            "common.Set up automated fix to stay ahead of any future broken links, ensuring continuous site health."
          ),
          status: "pending",
          isLoading: false,
          isOpen: false,
          time: 3,
          actions: [
            {
              content: t("common.Enable Automation"),
              onAction: () => setNavigate("/seo-booster/brokenlink?tabindex=4"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
    breadcrumbs: {
      isOpen: false,
      title: t("common.Add Breadcrumbs to your store"),
      icon: ChevronRightIcon,
      iconTone: "success",
      description: t("common.To get better user experience you need to add breadcrumbs to your store."),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        exploreBreadcrumbs: {
          title: t("common.How to add breadcrumbs"),
          description: t("common.Understand how to add and configure breadcrumbs in your store."),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 3,
          video: {
            link: "https://www.loom.com/embed/8d1a38fe3ad74a1bb7031022bb6b90ed",
            thumbnail: OnboardBreadcrumb,
          },
          type: "video",
          actions: [
            {
              content: t("common.Go to Breadcrumbs Design"),
              onAction: () => setNavigate("/seo-booster/breadcrumbs?tabindex=0"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
    googleSearchReport: {
      isOpen: false,
      title: t("common.Google Search Report"),
      icon: SearchIcon,
      iconTone: "info",
      description: t(
        "common.The Google Search Report provides crucial metrics like clicks, CTR, impressions and position details."
      ),
      status: "pending",
      showSteps: true,
      showTiming: true,
      showProgress: true,
      instructions: {
        exploreGoogle: {
          title: t("common.How to work google search report."),
          description: t("common.Understand how to connect and get google search report."),
          status: "pending",
          isLoading: false,
          isOpen: true,
          time: 3,
          video: {
            link: "https://www.loom.com/embed/a2b85c5587e84775bee3c6b79ff57e57?sid=9409122b-7d06-468f-9326-97647f275fd2",
            // thumbnail: GoogleReport,
          },
          type: "video",
          actions: [
            {
              content: t("common.Explore Google Search Report"),
              onAction: () => setNavigate("/google-search-console/google-search-report"),
              buttonVariant: "primary",
              buttonSize: "slim",
              buttonTone: "base",
            },
          ],
        },
      },
    },
  };

  const [steps, setSteps] = useState(initialSteps);

  //Open Close the step
  const changeIsOpen = (stepKey) => {
    setSteps((prevSteps) => {
      const updatedSteps = { ...prevSteps };
      updatedSteps[stepKey] = {
        ...updatedSteps[stepKey],
        isOpen: !updatedSteps[stepKey].isOpen,
      };
      return updatedSteps;
    });
  };

  //Open Close the instruction
  const openCloseInstruction = (stepIndex, instructionIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = { ...prevSteps };
      const targetInstruction = updatedSteps[stepIndex].instructions[instructionIndex];

      targetInstruction.isOpen = !targetInstruction.isOpen;

      Object.keys(updatedSteps[stepIndex].instructions).forEach((key) => {
        if (key !== instructionIndex) {
          updatedSteps[stepIndex].instructions[key].isOpen = false;
        }
      });

      return updatedSteps;
    });
  };

  const updateStatus = async (stepIndex, instructionIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = { ...prevSteps };
      const targetInstruction = updatedSteps[stepIndex].instructions[instructionIndex];
      targetInstruction.isLoading = false;
      targetInstruction.status = targetInstruction.status === "pending" ? "done" : "pending";

      //Logic for automatically open next instruction or step
      if (targetInstruction.status === "done") {
        targetInstruction.isOpen = false;

        //find next instruction
        const nextInstructionKey = Object.keys(updatedSteps[stepIndex].instructions).find(
          (key) => updatedSteps[stepIndex].instructions[key].status === "pending"
        );
        if (nextInstructionKey) {
          updatedSteps[stepIndex].instructions[nextInstructionKey].isOpen = true;
        }
      } else {
        targetInstruction.isOpen = true;
      }
      const step = updatedSteps[stepIndex];
      const status = Object.keys(step.instructions).every((instructionKey) => {
        return step.instructions[instructionKey].status === "done";
      })
        ? "done"
        : "pending";
      updatedSteps[stepIndex]["status"] = status;
      updatedSteps[stepIndex]["isOpen"] = status === "pending" ? true : false;
      const nextStepKey = Object.keys(updatedSteps).find((key) => updatedSteps[key].status !== "done");
      if (nextStepKey) {
        updatedSteps[nextStepKey].isOpen = true;
      }
      return updatedSteps;
    });

    // Function to update data in database
    updateOnboarding();
  };

  const markAsDone = (stepIndex, instructionIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = { ...prevSteps }; // Make a shallow copy of the object
      const targetInstruction = updatedSteps[stepIndex].instructions[instructionIndex];
      targetInstruction.isLoading = true;

      updateStatus(stepIndex, instructionIndex);

      return updatedSteps;
    });
  };

  const updateOnboarding = async () => {
    const newSteps = {};

    Object.keys(steps).forEach((stepKey) => {
      const step = steps[stepKey];
      newSteps[stepKey] = {
        instructions: {},
        isOpen: step.isOpen ? true : false,
        status: step.status,
      };

      Object.keys(step.instructions).forEach((instructionKey) => {
        const instruction = step.instructions[instructionKey];
        if (!newSteps[stepKey]["instructions"][instructionKey]) {
          newSteps[stepKey]["instructions"][instructionKey] = {};
        }

        newSteps[stepKey]["instructions"][instructionKey]["status"] = instruction.status;
        newSteps[stepKey]["instructions"][instructionKey]["isOpen"] = instruction.isOpen;
      });
    });

    // Update the onboarding data in the database
    const res = await fetch.put("/user/onboarding", { onboarding: newSteps });
    updateOnboardingData(res?.data);
  };

  // Function to dismiss the onboarding : will update the onboardingSteps in profileData
  const dismissOnboarding = async () => {
    await fetch.put("/user/update", JSON.stringify({ ...profileData, onboardingIsDone: true }));
    updateProfileData({ ...profileData, onboardingIsDone: true });
  };

  // Function to finish the onboarding : will update the onboardingSteps in profileData
  const finishLaterOnboarding = async (status) => {
    await fetch.put("/user/update", JSON.stringify({ ...profileData, onboardingFinishLater: status }));
    updateProfileData({ ...profileData, onboardingFinishLater: status });
  };

  const checkIfAllStepsAreDone = () => {
    const isDone = Object.keys(steps).every((stepKey) => {
      return steps[stepKey].status === "done";
    });

    if (isDone) {
      setShowDoneBanner(true);
    } else {
      setShowDoneBanner(false);
    }
  };

  const checkIfOnboardingNotStarted = () => {
    const isNotStarted = Object.keys(steps).every((stepKey) => {
      const instructions = steps[stepKey].instructions;
      const areAllInstructionsPending = Object.keys(instructions).every((instructionKey) => {
        return instructions[instructionKey].status === "pending";
      });
      return areAllInstructionsPending;
    });

    const isOnboardingFinishLater = profileData?.onboardingFinishLater;

    if (isNotStarted) {
      setButtonLabel(isOnboardingFinishLater ? "Start Onboarding" : "Go to Dashboard");
    } else {
      setButtonLabel(isOnboardingFinishLater ? "Go to Onboarding" : "Go to Dashboard");
    }
  };

  // Check if all the steps are done and set showDoneBanner state accordingly
  useEffect(() => {
    checkIfAllStepsAreDone();
  }, [steps]);

  useEffect(() => {
    setPrimaryAction &&
      setPrimaryAction({
        content: t(`common.${buttonLabel}`),
        onAction: () => finishLaterOnboarding(!profileData?.onboardingFinishLater),
      });
  }, [buttonLabel]);

  useEffect(() => {
    checkIfOnboardingNotStarted();
  }, [steps, profileData?.onboardingFinishLater]);

  const patchData = useCallback(async () => {
    if (onboardingData?.onboarding) {
      const newSteps = {};
      Object.keys(onboardingData.onboarding).forEach((stepKey) => {
        if (steps?.[stepKey]?.title) {
          const step = onboardingData.onboarding[stepKey];
          newSteps[stepKey] = steps[stepKey] || {
            instructions: {},
          };

          newSteps[stepKey]["isOpen"] = step.isOpen ? true : false;
          newSteps[stepKey]["status"] = step.status || "pending";
          Object.keys(step.instructions).forEach((instructionKey) => {
            const instruction = step.instructions[instructionKey];
            if (!newSteps[stepKey]["instructions"][instructionKey]) {
              newSteps[stepKey]["instructions"][instructionKey] = step["instructions"][instructionKey] || {};
            }

            newSteps[stepKey]["instructions"][instructionKey]["status"] = instruction.status;
            newSteps[stepKey]["instructions"][instructionKey]["isOpen"] = instruction.isOpen;
          });
        }
      });
      setSteps({ ...steps, ...newSteps });
    }
  }, [onboardingData?.onboarding]);

  // Initially patch data from database
  useEffect(() => {
    patchData();
    checkIfAllStepsAreDone();
  }, [onboardingData]);

  return (
    !profileData?.onboardingFinishLater && (
      <div className="onboarding-container">
        <BlockStack gap="200">
          {Object.keys(steps).map((stepKey) => {
            const step = steps[stepKey];
            return (
              <Card key={stepKey} padding="0">
                <Box padding="400" borderRadius="200">
                  <BlockStack gap="100">
                    <div className="step-title-container">
                      <div className="step-icon">
                        <Box
                          minWidth="100%"
                          minHeight="100%"
                          borderRadius="200"
                          background={`bg-surface-${step.iconTone}`}
                          borderColor={`border-${step.iconTone}`}
                          borderWidth="025"
                        >
                          <Icon source={step.icon} tone={step.iconTone} />
                        </Box>
                      </div>
                      <div
                        className="step-title"
                        onClick={() => {
                          changeIsOpen(stepKey);
                        }}
                      >
                        <div className="step-title-content">
                          <BlockStack>
                            <Text variant="headingMd" as="h6">
                              {step.title}
                            </Text>
                            <Text as="p">{step.description}</Text>
                          </BlockStack>
                        </div>
                        <div className="step-title-indicator">
                          <InlineStack blockAlign="center" align="space-between" columns={1}>
                            {Object.keys(step.instructions).length > 0 && (
                              <BlockStack gap="100">
                                {step.showSteps && (
                                  <div className="step-count">
                                    <Text variant="bodySm" tone="subbed" as="span">
                                      {Object.keys(step.instructions).length} {t("common.steps")}
                                    </Text>
                                  </div>
                                )}
                                {step.showTiming && (
                                  <div className="step-time">
                                    <Text variant="bodySm" tone="subbed" as="span">
                                      {Object.values(step.instructions).reduce(function (acc, obj) {
                                        if (obj.status === "done") {
                                          return acc;
                                        }
                                        return acc + obj.time;
                                      }, 0)}{" "}
                                      {t("common.minutes")}
                                    </Text>
                                  </div>
                                )}
                              </BlockStack>
                            )}
                            {step.showProgress && (
                              <div className="step-completion-indicator">
                                {Object.keys(step.instructions).length > 0 && (
                                  <ProgressCircle
                                    score={
                                      !isNaN(
                                        (Object.values(step.instructions).filter((e) => e.status === "done")
                                          ?.length *
                                          100) /
                                          Object.keys(step.instructions).length
                                      )
                                        ? (
                                            (Object.values(step.instructions).filter((e) => e.status === "done")
                                              ?.length *
                                              100) /
                                            Object.keys(step.instructions).length
                                          ).toFixed(0)
                                        : 0
                                    }
                                    width="50px"
                                    border="5px"
                                    fontSize="12px"
                                    color="#007a5c"
                                  />
                                )}
                              </div>
                            )}
                          </InlineStack>
                        </div>
                      </div>
                    </div>
                  </BlockStack>
                </Box>
                {step.instructions && Object.keys(step.instructions).length > 0 && (
                  <Collapsible open={step.isOpen} id={"step-collapsible-" + stepKey} expandOnPrint>
                    <div className="instructions">
                      <BlockStack gap="200">
                        {Object.keys(step.instructions).map((instructionKey) => {
                          const instruction = step.instructions[instructionKey];
                          return (
                            <Instruction
                              key={instructionKey}
                              instruction={instruction}
                              stepKey={stepKey}
                              instructionKey={instructionKey}
                              markAsDone={markAsDone}
                              openCloseInstruction={openCloseInstruction}
                            />
                          );
                        })}
                      </BlockStack>
                    </div>
                  </Collapsible>
                )}
              </Card>
            );
          })}
          {showDoneBanner && (
            <DismissibleBanner
              title="Setup done"
              tone="success"
              action={{ content: t("common.Done"), onAction: () => dismissOnboarding() }}
              bannerName={`onboardingPageBanner`}
              bannerText={<Text variant="bodyMd">{t("common.You have completed all the steps")}</Text>}
            />
          )}
        </BlockStack>
      </div>
    )
  );
}
