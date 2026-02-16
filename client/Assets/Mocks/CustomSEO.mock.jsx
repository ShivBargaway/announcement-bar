import { BlockStack, InlineGrid, List, Text } from "@shopify/polaris";
import {
  ArrowUpIcon,
  BlogIcon,
  CalendarIcon,
  CartIcon,
  CartSaleIcon,
  ChartLineIcon,
  ChevronRightIcon,
  CompassIcon,
  EyeFirstIcon,
  FilterIcon,
  MobileIcon,
  PersonSegmentIcon,
  QuestionCircleIcon,
  SandboxIcon,
  SearchIcon,
  SearchResourceIcon,
  ShieldCheckMarkIcon,
  StatusIcon,
  StoreFilledIcon,
  StoreImportIcon,
  ThemeEditIcon,
  TransactionIcon,
} from "@shopify/polaris-icons";
import { t } from "i18next";

export const customSEOPlanList = () => [
  {
    title: "Google search console set-up",
    type: "googleSearchConsole",
    time: "3 days",
    planName: "Custom SEO-Google Search Console",
    // price: 100,
    bigDescription: (
      <Text>
        {t(
          "common.We will set up and integrate Google Search Console, addressing all potential indexing issues such as 404 errors, soft 404s, crawled but not indexed, discovered but not indexed, merchant listing problems, video indexing errors, and blocks from robots.txt. Each issue will be thoroughly analysed, and necessary actions will be taken as needed. Additionally, we will continuously monitor the sitemap within the Search Console."
        )}
      </Text>
    ),
    smallDescription:
      "Google Search Console is key for a Shopify store, offering insights into how your site appears in search results and helping fix visibility issues. It tracks keyword performance, indexing, and site errors to boost SEO and traffic.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. GSC Setup & Verification")}</Text>
            <List type="bullet">
              <List.Item>
                {t("common.Proper integration with your eCommerce site (Shopify, WooCommerce, etc.)")}
              </List.Item>
              <List.Item>{t("common.Verify ownership via DNS, HTML tag, or GA/GTAG")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Basic Site Performance Overview")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Traffic performance (clicks, impressions, CTR)")}</List.Item>
              <List.Item>{t("common.Top-performing keywords & pages")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.3. Index Coverage Check")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Review crawl issues, indexing errors, and submit sitemap")}</List.Item>
              <List.Item>{t("common.Fix or highlight critical issues (e.g. 404s, blocked pages)")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Mobile Usability Check")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Detect and report any mobile issues affecting rankings")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.5. Basic Reporting + Recommendations")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Simple PDF/Excel report with")} :</List.Item>
              <List type="bullet">
                <List.Item>{t("common.Top 10 queries")}</List.Item>
                <List.Item>{t("common.Top 5 underperforming product pages")}</List.Item>
                <List.Item>{t("common.Quick-win keyword opportunities")}</List.Item>
              </List>
            </List>

            <Text variant="headingSm">{t("common.6. 1 Week of Follow-Up Support")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Minor help or clarifications post-delivery")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: SearchIcon,
    color: "success",
    buttonName: "Completely free",
  },
  {
    title: "Google my business Page / local boost",
    type: "googlePage",
    time: "3 days",
    planName: "Custom SEO-Google research",
    // price: 100,
    bigDescription: (
      <Text>
        {t(
          "common.We will create your GMB page if not created and will optimize as per market standard which includes local keyword research also. Weekly 1 optimized GMB update will be there on any random products"
        )}
      </Text>
    ),
    smallDescription:
      "A Google My Business page boosts local eCommerce sales by increasing your visibility in local search results and Google Maps. It helps build trust with potential customers through reviews, business details, and easy access to contact or visit your store.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. GMB Profile Setup or Audit")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Creation or audit of existing listing")}</List.Item>
              <List.Item>{t("common.Business name, category, description, services, hours, etc.")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.2. Basic Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Add logo, cover photo, and 3-5 high-quality images and videos.")}</List.Item>
              <List.Item>{t("common.Set service areas & attributes")}</List.Item>
              <List.Item>{t("common.Ensure NAP consistency (Name, Address, Phone)")}</List.Item>
              <List.Item>{t("common.Link Social Profiles.")}</List.Item>
            </List>
          </BlockStack>
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. Keyword-Rich Business Description")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Perform local keyword research (10-20 keywords)")}</List.Item>
              <List.Item>{t("common.SEO-optimized description (up to 750 characters)")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.4. Initial Posts (2 Posts)")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Google updates or promotional post")}</List.Item>
              <List.Item>{t("common.Includes image + call-to-action (CTA)")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.5. 1 Week Support")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Minor edits or Q&A via chat/email after delivery")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),

    icon: ChevronRightIcon,
    color: "info",
    buttonName: "10 Hours free",
  },
  {
    title: "Keyword research",
    type: "keyword",
    price: 200,
    planName: "Custom SEO-Keyword Research",
    time: "1 week",
    smallDescription:
      "Keyword Research is crucial in eCommerce because it helps identify high-converting search terms your potential customers use when shopping online. This drives targeted traffic to your product pages, increasing visibility and sales.",
    bigDescription: (
      <Text>
        {t(
          "common.We will prepare the keyword research report in excel format where you will get multiple sheets with proper research of highly searched volume keywords. We will analyze your category pages, sub-category pages and product level pages keywords."
        )}
      </Text>
    ),
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.Keyword classification")} :</Text>
        <InlineGrid columns={2} gap="200" alignItems="center">
          <List type="bullet">
            <List.Item>{t("common.Transactional Keywords")}</List.Item>
            <List.Item>{t("common.Informational Keywords")}</List.Item>
            <List.Item>{t("common.Commercial Keywords")}</List.Item>
          </List>
          <List type="bullet">
            <List.Item>{t("common.Navigation Keywords")}</List.Item>
            <List.Item>{t("common.Branded Keyword")}</List.Item>
            <List.Item>{t("common.Intent-Based Keywords")}</List.Item>
          </List>
        </InlineGrid>

        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Niche & Competitor Analysis")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Identify top 5 competitors")}</List.Item>
              <List.Item>{t("common.Analyze niche difficulty")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.2. Primary Keyword Set - Collection")}</Text>
            <List type="bullet">
              <List.Item>{t("common.up to 10 collection and sub collection keywords")}</List.Item>
              <List.Item>{t("common.Buyer-intent & SEO-friendly")}</List.Item>
            </List>
          </BlockStack>
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. Long-Tail Keyword Suggestions - Product")}</Text>
            <List type="bullet">
              <List.Item>{t("common.up to 50 products, long-tail keywords for specific product pages")}</List.Item>
              <List.Item>
                {t(
                  "common.Includes search volume & keyword difficulty, intent/classification, CPC, traffic, URL, competition and SERP feature"
                )}
              </List.Item>
            </List>
            <Text variant="headingSm">{t("common.4. Delivery in Google Sheet")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Clear, organized format")}</List.Item>
              <List.Item>{t("common.Buyer-intent & SEO-friendly")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: EyeFirstIcon,
    color: "warning",
  },
  {
    title: "Blog addition in ecommerce store",
    type: "blog",
    time: "2 week",
    planName: "Custom SEO-Blog Addition",
    price: 200,
    bigDescription: (
      <Text>
        {t(
          "common.If predefined keywords are available, we will research trending online topics related to those product-specific terms. Otherwise, we’ll first identify 5–10 strong transactional or informational keywords based on the products, then analyze top trending blogs. Based on this, we will create four keyword- and trend-driven blog posts each month."
        )}
      </Text>
    ),
    smallDescription:
      "Adding a blog to your Shopify store helps improve SEO by targeting relevant keywords and driving organic traffic. It also builds trust and engagement with customers by providing valuable content related to your products or niche.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Blog Setup & Integration")}</Text>
            <List type="bullet">
              <List.Item>
                {t("common.Enable blog feature on your eCommerce platform (Shopify, WooCommerce, etc.)")}
              </List.Item>
              <List.Item>{t("common.Basic layout setup using store’s existing theme/design")}</List.Item>
              <List.Item>{t("common.Add blog to menu/navigation if requested")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Internal Linking")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Link blog content to 1–2 relevant product/category pages")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.3. Basic SEO Settings")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Slug optimization, meta title, and schema (if platform allows)")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Four SEO-Friendly Blog Posts (800–1000 words)")}</Text>
            <List type="bullet">
              <List.Item>
                {t('common.Topic tailored to your niche/products (e.g. "Top 5 Benefits of Using [Product]")')}
              </List.Item>
              <List.Item>{t("common.Includes")}:</List.Item>
              <List type="bullet">
                <List.Item>{t("common.Keyword optimization")}</List.Item>
                <List.Item>{t("common.Engaging headline")}</List.Item>
                <List.Item>{t("common.Meta Title/Description")}</List.Item>
                <List.Item>{t("common.1–2 free images")}</List.Item>
              </List>
            </List>
            <Text variant="headingSm">{t("common.5. Quick Guide for Future Posts")}</Text>
            <List type="bullet">
              <List.Item>
                {t("common.A simple guide or template to help you publish more posts yourself")}
              </List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),

    icon: BlogIcon,
    color: "success",
  },
  {
    title: "Google analytics & tag manager setup",
    type: "googleAnalytics",
    planName: "Custom SEO-Google Tag Manager",
    time: "3 days",
    price: 100,
    bigDescription: (
      <Text>
        {t(
          "common.We will set up and integrate Google Search Console, addressing all potential indexing issues such as 404 errors, soft 404s, crawled but not indexed, discovered but not indexed, merchant listing problems, video indexing errors, and blocks from robots.txt. Each issue will be thoroughly analysed, and necessary actions will be taken as needed. Additionally, we will continuously monitor the sitemap within the Search Console."
        )}
      </Text>
    ),
    smallDescription:
      "Google Tag Manager and Google Analytics setup is crucial for Shopify stores to accurately track customer behavior and sales performance. It helps store owners make data-driven decisions to boost conversions and optimize marketing efforts.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Google Analytics 4 Setup")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Create or connect GA4 property")}</List.Item>
              <List.Item>{t("common.Link GA4 to GTM")}</List.Item>
              <List.Item>{t("common.Configure basic data stream settings")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Standard Event Tracking (Basic Ecom)")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Pageview tracking")}</List.Item>
              <List.Item>
                {t("common.Button click or form submission (e.g., Add to Cart, Buy Now – 1 custom event)")}
              </List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. GTM Debugging & Preview")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Test implementation using GTM Preview mode")}</List.Item>
              <List.Item>{t("common.Ensure tags & triggers are working properly")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.4. GA4 + GTM Documentation")}</Text>
            <List type="bullet">
              <List.Item>
                {t("common.Simple walkthrough doc or Loom video on how to check data & manage tags")}
              </List.Item>
            </List>

            <Text variant="headingSm">{t("common.5. Seven Days Support")}</Text>
            <List type="bullet">
              <List.Item>{t("common.For small adjustments or follow-up questions")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),

    icon: ChartLineIcon,
    color: "emphasis",
    badgeColor: "magic",
  },
  {
    title: "One time on-page SEO ",
    type: "onPageSeo",
    time: "30 days",
    planName: "Custom SEO-One Time On-Page SEO",
    price: 500,
    smallDescription:
      "On-page SEO is crucial for eCommerce as it helps improve search engine rankings, driving more organic traffic to your site. It also enhances user experience, leading to higher conversion rates and customer satisfaction.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Shopify SEO Audit")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Review of Shopify store SEO settings")}</List.Item>
              <List.Item>{t("common.Identify indexing, speed, and structural issues")}</List.Item>
              <List.Item>
                {t("common.Check for duplicate content, missing metadata, or app-related SEO conflicts")}
              </List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Shopify-Specific Settings")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Navigation and internal link structure audit")}</List.Item>
              <List.Item>{t("common.App recommendations for SEO (e.g., Schema, Image Optimizers)")}</List.Item>
              <List.Item>{t("common.URL structure recommendations (for collections, products, blogs)")}</List.Item>
              <List.Item>{t("common.Contact form set up")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. Google Tools Setup")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Google Analytics (GA4) setup")}</List.Item>
              <List.Item>{t("common.Google Search Console setup")}</List.Item>
              <List.Item>{t("common.Google Business Profile (if applicable)")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.4. Technical SEO fixes")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Speed optimization (basic improvements or recommendations)")}</List.Item>
              <List.Item>{t("common.Mobile-friendliness check")}</List.Item>
              <List.Item>{t("common.XML sitemap & robots.txt optimization")}</List.Item>
              <List.Item>{t("common.Canonical tags setup")}</List.Item>
              <List.Item>{t("common.Indexing & crawl issues resolution (Google Search Console)")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: CompassIcon,
    color: "caution",
    badgeColor: "attention",
  },
];

export const shopifyCROplanList = () => [
  {
    title: "Core Web Vitals Optimization",
    planName: "CRO Service-Core Web Vitals Optimization",
    price: 500,
    smallDescription: "Speed up your site to boost SEO and reduce bounce rates.",
    impact: "20-40% faster load times → 10-25% higher conversions.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")} :</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Audit and fix Largest Contentful Paint (LCP) delays.")}</List.Item>
            <List.Item>{t("common.Defer non-critical JavaScript and CSS.")}</List.Item>
            <List.Item>{t("common.Convert images to WebP/AVIF formats.")}</List.Item>
            <List.Item>{t("common.Implement lazy loading for images and videos.")}</List.Item>
            <List.Item>{t("common.Minify CSS, JavaScript, and HTML files.")}</List.Item>
            <List.Item>{t("common.Remove unused code from theme files.")}</List.Item>
            <List.Item>{t("common.Preload critical fonts and assets.")}</List.Item>
            <List.Item>{t("common.Fix render-blocking resources.")}</List.Item>
            <List.Item>{t("common.Monitor Core Web Vitals monthly and re-optimize.")}</List.Item>
            <List.Item>
              {t("common.Eliminate Cumulative Layout Shift (CLS) by setting image/video dimensions.")}
            </List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: FilterIcon,
    color: "success",
    buttonName: "10 hour free",
  },
  {
    title: "Mobile-First Redesign",
    planName: "CRO Service-Mobile Optimization",
    smallDescription: "Dominate mobile shoppers (70%+ of traffic).",
    impact: "15-30% higher mobile conversions.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")} :</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Redesign mobile menus for thumb-friendly navigation.")}</List.Item>
            <List.Item>{t("common.Optimize product grids for mobile screens (2 columns → 1).")}</List.Item>
            <List.Item>{t("common.Add sticky “Add to Cart” buttons on PDPs.")}</List.Item>
            <List.Item>{t("common.Simplify checkout to 3 steps or fewer.")}</List.Item>
            <List.Item>{t("common.Increase button sizes (minimum 48x48px).")}</List.Item>
            <List.Item>{t("common.Optimize font sizes for readability without zooming.")}</List.Item>
            <List.Item>{t("common.Implement swipeable image galleries.")}</List.Item>
            <List.Item>{t("common.Test mobile-specific popups (e.g., exit-intent).")}</List.Item>
            <List.Item>{t("common.Auto-format phone numbers for tap-to-call.")}</List.Item>
            <List.Item>{t("common.Add Apple Pay/Google Pay one-tap checkout.")}</List.Item>
            <List.Item>{t("common.Fix mobile-specific layout shifts (CLS).")}</List.Item>
            <List.Item>{t("common.Reduce mobile page weight to <2MB.")}</List.Item>
            <List.Item>{t("common.Hide non-essential desktop elements on mobile.")}</List.Item>
            <List.Item>{t("common.Monthly mobile UX testing on real devices.")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: MobileIcon,
    color: "info",
    buttonName: "10 hour free",
  },
  {
    title: "A/B Testing & Personalization",
    planName: "CRO Service-AB Testing",
    smallDescription: "Data-driven experiments to maximize ROI.",
    impact: "10-20% uplift in key metrics.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.AB test headlines, subheadlines, and CTAs.")}</List.Item>
            <List.Item>{t("common.Test pricing strategies (e.g., 49 vs. 49* vs. 49.99).")}</List.Item>
            <List.Item>{t("common.Experiment with button colors and placements.")}</List.Item>
            <List.Item>{t("common.Personalize product recommendations by browsing history.")}</List.Item>
            <List.Item>{t("common.Test free shipping thresholds vs. discounts.")}</List.Item>
            <List.Item>{t("common.Dynamic content for returning vs. new visitors.")}</List.Item>
            <List.Item>{t("common.AI-driven product sorting (e.g., Trending Now).")}</List.Item>
            <List.Item>{t("common.Geo-targeted banners (e.g., Local delivery available!).")}</List.Item>
            <List.Item>{t("common.Test urgency tactics (3 left in stock vs. Selling fast).")}</List.Item>
            <List.Item>{t("common.Experiment with trust badges placement.")}</List.Item>
            <List.Item>{t("common.Split-test checkout flow (one-page vs. multi-step).")}</List.Item>
            <List.Item>{t("common.Test video vs. image hero banners.")}</List.Item>
            <List.Item>{t("common.Personalized email/SMS campaigns.")}</List.Item>
            <List.Item>{t("common.AI chatbots for product recommendations.")}</List.Item>
            <List.Item>{t("common.Monthly test reports and scaling winners.")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: SandboxIcon,
    color: "warning",
    buttonName: "10 hour free",
  },
  {
    title: "Exit-Intent & Cart Recovery",
    planName: "CRO Service-Cart Recovery",
    smallDescription: "Recover 15-30% of abandoned carts.",
    impact: "Recover $1,000s in lost revenue monthly.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Exit-intent popups with time-sensitive discounts")}</List.Item>
            <List.Item>{t("common.Automated SMS reminders with product images")}</List.Item>
            <List.Item>{t("common.Email sequences with personalized recommendations")}</List.Item>
            <List.Item>{t("common.Offer free shipping if cart value is $X away")}</List.Item>
            <List.Item>{t("common.Test exit offers (10% off vs. free gift)")}</List.Item>
            <List.Item>{t("common.Display live stock counters in cart")}</List.Item>
            <List.Item>{t("common.Add Save Cart feature for logged-in users")}</List.Item>
            <List.Item>{t("common.Retarget abandoners via Facebook/Google Ads")}</List.Item>
            <List.Item>{t("common.Push notifications for cart reminders")}</List.Item>
            <List.Item>{t("common.Integrate urgency timers")}</List.Item>
            <List.Item>{t("common.Post-purchase surveys to identify drop-off reasons")}</List.Item>
            <List.Item>{t("common.Offer installment payments (e.g., Klarna) at checkout")}</List.Item>
            <List.Item>{t("common.Re-engage users with Did you forget something emails")}</List.Item>
            <List.Item>{t("common.AB test popup designs (minimalist vs. bold)")}</List.Item>
            <List.Item>{t("common.Monthly cart recovery rate analysis")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: CartIcon,
    color: "success",
    buttonName: "10 hour free",
  },
  {
    title: "Upsell/Cross-Sell Engine",
    planName: "CRO Service-Upsell Engine",
    smallDescription: "Increase average order value (AOV).",
    impact: "20-40% higher AOV.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Post-purchase one-click upsells (e.g., 'Add a case for 20% off')")}</List.Item>
            <List.Item>{t("common.'Frequently Bought Together' AI-powered widgets")}</List.Item>
            <List.Item>{t("common.Product bundles (e.g., 'Complete Skincare Kit')")}</List.Item>
            <List.Item>{t("common.'Complete the Look' recommendations on PDPs")}</List.Item>
            <List.Item>{t("common.Volume discounts (e.g., 'Buy 2, Save 15%')")}</List.Item>
            <List.Item>{t("common.Subscription prompts for replenishable products")}</List.Item>
            <List.Item>{t("common.Pre-purchase upsells (e.g., 'Upgrade to Premium')")}</List.Item>
            <List.Item>{t("common.Post-checkout upsell pages with limited-time offers")}</List.Item>
            <List.Item>{t("common.Dynamic upsells based on cart contents")}</List.Item>
            <List.Item>{t("common.'Customers Also Viewed' carousels")}</List.Item>
            <List.Item>{t("common.Loyalty-linked upsells (e.g., 'Redeem points for $10 off')")}</List.Item>
            <List.Item>{t("common.Seasonal upsell campaigns (e.g., holiday gift sets)")}</List.Item>
            <List.Item>{t("common.AI-driven product recommendations")}</List.Item>
            <List.Item>{t("common.A/B test upsell timing (pre- vs. post-purchase)")}</List.Item>
            <List.Item>{t("common.Monthly AOV tracking and strategy tweaks")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: ArrowUpIcon,
    color: "magic",
    buttonName: "10 hour free",
  },
  {
    title: "Trust & Social Proof Toolkit",
    planName: "CRO Service-Trust Builder",
    smallDescription: "Build credibility to reduce buyer hesitation.",
    impact: "10-20% lower checkout abandonment.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.User-generated content (UGC) galleries")}</List.Item>
            <List.Item>{t("common.Display customer reviews with photos/videos")}</List.Item>
            <List.Item>{t("common.Trust badges (SSL, money-back guarantee, secure checkout)")}</List.Item>
            <List.Item>{t("common.Influencer testimonials and unboxing videos")}</List.Item>
            <List.Item>{t("common.Live sales notifications ('12 people bought today')")}</List.Item>
            <List.Item>{t("common.Press mentions (e.g., 'Featured in Vogue')")}</List.Item>
            <List.Item>{t("common.Social media follower counters")}</List.Item>
            <List.Item>{t("common.'As Seen On' logos (media, influencers)")}</List.Item>
            <List.Item>{t("common.Free shipping/returns banners")}</List.Item>
            <List.Item>{t("common.Display payment security icons (Shop Pay, PayPal)")}</List.Item>
            <List.Item>{t("common.Add a 'Verified Buyer' badge to reviews")}</List.Item>
            <List.Item>{t("common.Show real-time inventory levels ('Only 3 left!')")}</List.Item>
            <List.Item>{t("common.Case studies with before/after results")}</List.Item>
            <List.Item>{t("common.Trustpilot or Google Reviews integration")}</List.Item>
            <List.Item>{t("common.Monthly UGC campaigns to refresh content")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: ShieldCheckMarkIcon,
    color: "caution",
    buttonName: "10 hour free",
    badgeColor: "attention",
  },
  {
    title: "Checkout Friction Fixes",
    planName: "CRO Service-Checkout Optimization",
    smallDescription: "Streamline checkout for higher completion rates.",
    impact: "15-25% higher checkout completion.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")} :</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Customize Shopify Plus checkout (branded colors/fonts)")}</List.Item>
            <List.Item>{t("common.Enable guest checkout")}</List.Item>
            <List.Item>{t("common.Add address autocomplete")}</List.Item>
            <List.Item>{t("common.Simplify checkout to one page")}</List.Item>
            <List.Item>{t("common.Offer multiple payment options (Shop Pay, Klarna, crypto)")}</List.Item>
            <List.Item>{t("common.Display trust badges during checkout")}</List.Item>
            <List.Item>{t("common.Add a progress indicator (e.g., 'Step 1 of 3')")}</List.Item>
            <List.Item>{t("common.Pre-fill saved customer data (for returning users)")}</List.Item>
            <List.Item>{t("common.Hide unnecessary fields (e.g., company name)")}</List.Item>
            <List.Item>{t("common.Add a 'Save Cart' option for later")}</List.Item>
            <List.Item>{t("common.Test free shipping thresholds")}</List.Item>
            <List.Item>{t("common.Post-purchase upsell integration")}</List.Item>
            <List.Item>{t("common.Mobile-optimized checkout buttons")}</List.Item>
            <List.Item>{t("common.A/B test checkout button labels ('Pay Now' vs. 'Complete Order')")}</List.Item>
            <List.Item>{t("common.Monthly checkout abandonment analysis")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: CartSaleIcon,
    color: "success",
    buttonName: "10 hour free",
  },
  {
    title: "Loyalty Program Setup",
    planName: "CRO Service-Loyalty Program",
    smallDescription: "Boost retention and lifetime value (CLV).",
    impact: "30%+ higher repeat purchase rates.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Tiered loyalty programs (Silver/Gold/Platinum)")}</List.Item>
            <List.Item>{t("common.Points for purchases, reviews, and referrals")}</List.Item>
            <List.Item>{t("common.VIP perks (early access to sales, birthday discounts)")}</List.Item>
            <List.Item>{t("common.Customizable rewards (products, discounts, cashback)")}</List.Item>
            <List.Item>{t("common.Referral campaigns with double-sided rewards")}</List.Item>
            <List.Item>{t("common.Gamification (spin-to-win, points milestones)")}</List.Item>
            <List.Item>{t("common.Automated win-back emails for inactive users")}</List.Item>
            <List.Item>{t("common.Loyalty-linked exclusive content (e.g., tutorials)")}</List.Item>
            <List.Item>{t("common.SMS loyalty alerts (e.g., 'Redeem your 500 points!')")}</List.Item>
            <List.Item>{t("common.Integrate loyalty tiers with discounts")}</List.Item>
            <List.Item>{t("common.A/B test reward structures")}</List.Item>
            <List.Item>{t("common.Post-purchase loyalty signup prompts")}</List.Item>
            <List.Item>{t("common.NFT-based loyalty passes (for Web3 integration)")}</List.Item>
            <List.Item>{t("common.Quarterly program refreshes (new rewards, challenges)")}</List.Item>
            <List.Item>{t("common.CLV tracking and ROI reporting")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: TransactionIcon,
    color: "info",
    buttonName: "10 hour free",
  },
  {
    title: "SEO-Driven Product Listings",
    planName: "CRO Service-SEO Optimization",
    smallDescription: "Drive organic traffic to high-converting pages.",
    impact: "20-30% more organic traffic.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>
              {t("common.Optimize product titles with keywords (e.g., 'Vitamin C Serum for Glowing Skin')")}
            </List.Item>
            <List.Item>{t("common.Write unique, keyword-rich meta descriptions")}</List.Item>
            <List.Item>{t("common.Add schema markup for product ratings/price")}</List.Item>
            <List.Item>{t("common.Fix broken links and redirects")}</List.Item>
            <List.Item>{t("common.Optimize image alt text (e.g., 'Organic Argan Oil Shampoo')")}</List.Item>
            <List.Item>{t("common.Internal linking between related products")}</List.Item>
            <List.Item>{t("common.Target low-competition long-tail keywords")}</List.Item>
            <List.Item>{t("common.Create SEO-friendly collection pages")}</List.Item>
            <List.Item>{t("common.Publish blog content around product FAQs")}</List.Item>
            <List.Item>{t("common.Optimize URL slugs (short, keyword-focused)")}</List.Item>
            <List.Item>{t("common.Submit sitemap to Google Search Console")}</List.Item>
            <List.Item>{t("common.Fix duplicate content issues")}</List.Item>
            <List.Item>{t("common.Add FAQ schema to product pages")}</List.Item>
            <List.Item>{t("common.Optimize breadcrumb navigation")}</List.Item>
            <List.Item>{t("common.Monthly keyword ranking tracking")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: SearchResourceIcon,
    color: "warning",
    buttonName: "10 hour free",
  },
  {
    title: "Seasonal Campaigns",
    planName: "CRO Service-Seasonal Marketing",
    smallDescription: "Maximize revenue during peak periods.",
    impact: "2-3x higher revenue during peak seasons.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What We Can Do")}:</Text>
        <List type="bullet">
          <InlineGrid columns={{ sm: 1, md: 2 }}>
            <List.Item>{t("common.Black Friday/Cyber Monday landing pages")}</List.Item>
            <List.Item>{t("common.Holiday gift guides with curated bundles")}</List.Item>
            <List.Item>{t("common.Countdown timers for limited-time offers")}</List.Item>
            <List.Item>{t("common.Themed email/SMS campaigns (e.g., '12 Days of Deals')")}</List.Item>
            <List.Item>{t("common.Exclusive VIP early access to sales")}</List.Item>
            <List.Item>{t("common.Create urgency with 'Last Chance' popups")}</List.Item>
            <List.Item>{t("common.Partner with influencers for holiday unboxings")}</List.Item>
            <List.Item>{t("common.Seasonal product launches (e.g., 'Summer Skincare Kit')")}</List.Item>
            <List.Item>{t("common.Geo-targeted campaigns for regional holidays")}</List.Item>
            <List.Item>{t("common.Post-holiday 'B-Stock' clearance sales")}</List.Item>
            <List.Item>{t("common.Valentine's Day/Christmas-specific bundles")}</List.Item>
            <List.Item>{t("common.Integrate holiday-themed trust elements (e.g., 'Gift Guarantee')")}</List.Item>
            <List.Item>{t("common.A/B test holiday discount structures (% vs. $ off)")}</List.Item>
            <List.Item>{t("common.Retarget holiday visitors with abandoned cart offers")}</List.Item>
            <List.Item>{t("common.Post-campaign analysis to refine future strategies")}</List.Item>
          </InlineGrid>
        </List>
      </BlockStack>
    ),
    icon: CalendarIcon,
    color: "magic",
    buttonName: "10 hour free",
  },
];

export const storeCustomizationList = () => [
  {
    title: "Troubleshooting – Hourly Base Support", //need to update, view details, contact us added
    time: "Hourly",
    planName: "Custom Service-Troubleshooting Support",
    bigDescription: (
      <Text>
        {t(
          "common.Our hourly troubleshooting service helps you resolve various technical issues that may affect your Shopify store's performance. Whether it’s fixing theme bugs, resolving API integration problems, or addressing issues with payment gateways, we offer quick and efficient support to ensure your store operates smoothly."
        )}
      </Text>
    ),
    smallDescription:
      "Resolve any Shopify issues, bugs, or errors with expert troubleshooting on an hourly basis. From theme fixes to payment issues, we provide targeted solutions.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Theme & Layout Fixes")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Bug fixes related to theme issues")}</List.Item>
              <List.Item>{t("common.Layout adjustments for better user experience")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. App Integration & API Issues")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Troubleshooting third-party app integrations")}</List.Item>
              <List.Item>{t("common.Resolving API connection and data flow problems")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.3. Checkout & Payment Gateway Errors")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Resolving issues with checkout process")}</List.Item>
              <List.Item>{t("common.Fixing payment gateway integration errors")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Product & Variant Fixes")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Addressing product options and variant bugs")}</List.Item>
              <List.Item>{t("common.Ensuring proper product displays and settings")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.5. Mobile Responsiveness & User Experience Fixes")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Fixing issues related to mobile responsiveness")}</List.Item>
              <List.Item>{t("common.Optimizing the shopping experience across devices")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.6. Inventory & Customer Issues")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Resolving inventory sync and stock issues")}</List.Item>
              <List.Item>{t("common.Fixing customer login and account-related problems")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: QuestionCircleIcon,
    color: "success",
    buttonName: "10 Hours free",
  },
  {
    title: "Optimize core web vitals ",
    time: "1 week",
    planName: "Custom Service-Core Web Vitals Optimization",
    bigDescription: (
      <Text>
        {t(
          "common.Our Core Web Vitals optimization service focuses on improving page speed, performance, and user interaction metrics. We analyze and fine-tune critical aspects of your store to ensure fast loading, efficient code handling, and better performance on both desktop and mobile devices — all essential for SEO and conversions."
        )}
      </Text>
    ),
    smallDescription:
      "Improve your website’s performance and search engine visibility by optimizing core web vitals for faster loading and a smoother user experience.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Speed & Load Time Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Page speed analysis")}</List.Item>
              <List.Item>{t("common.Improve navigation load time")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Code Cleanup & Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Detect and remove dead code")}</List.Item>
              <List.Item>{t("common.Optimize JavaScript and CSS files")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.3. JavaScript Handling")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Defer unnecessary JavaScript")}</List.Item>
              <List.Item>{t("common.Preload key JS and CSS files")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Image Performance")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Compress and optimize images")}</List.Item>
              <List.Item>{t("common.Defer offscreen images for faster loading")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.5. Third-Party Resource Handling")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Pre-connect external resources")}</List.Item>
              <List.Item>{t("common.Prefetch third-party app files")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: StatusIcon,
    color: "emphasis",
    badgeColor: "magic",
    buttonName: "10 Hours free",
  },
  {
    title: "Shopify store build",
    time: "1 week",
    planName: "Custom Service-Store Build",
    price: 300,
    bigDescription: (
      <Text>
        {t(
          "common.Launch your Shopify store with confidence through our complete store build service. We handle everything from initial setup to design, SEO optimization, app integration, and post-launch support. This service ensures your store not only looks professional but is also optimized for conversions and smooth operations."
        )}
      </Text>
    ),
    smallDescription:
      "We help build a fully functional and beautifully designed Shopify store from scratch, ensuring an optimized experience for your customers and easy store management.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Store Setup & Product Addition")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Add up to 5 products")}</List.Item>
              <List.Item>{t("common.Create 5 standard pages (Home, Collection, Product, etc.)")}</List.Item>
              <List.Item>{t("common.Set up Product, Collection, and Homepage")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Plugin & App Integration")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Install 5 essential plugins")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.3. SEO Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.SEO-friendly store setup")}</List.Item>
              <List.Item>{t("common.Optimized meta tags and product descriptions")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Design & User Experience")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Premium professional design")}</List.Item>
              <List.Item>{t("common.Responsive layout for all devices")}</List.Item>
              <List.Item>{t("common.Custom filters for easy navigation")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.5. Payment & Functional Integrations")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Payment gateway setup")}</List.Item>
              <List.Item>{t("common.Create Info Pages (About, Contact, Policy)")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.6. Support & Post-Launch Assistance")}</Text>
            <List type="bullet">
              <List.Item>{t("common.1 month of free support")}</List.Item>
              <List.Item>{t("common.Ongoing functionality checks")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: StoreImportIcon,
    color: "success",
  },
  {
    title: "High-converting store redesign",
    time: "1 week",
    planName: "Custom Service-Store Redesign",
    price: 200,
    bigDescription: (
      <Text>
        {t(
          "common.We will revamp your existing Shopify store with a modern, visually appealing design that improves navigation and mobile usability. The package includes a complete theme redesign, updates to your product, collection, and homepage layouts, and smarter navigation to make browsing easier. We also ensure your store is SEO-friendly and fully optimized for mobile devices, improving both user experience and search engine rankings."
        )}
      </Text>
    ),
    smallDescription:
      "Transform your existing Shopify store into a modern, mobile-friendly, and high-converting design that enhances user experience and boosts sales.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Theme & Layout Redesign")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Complete theme overhaul for a modern look")}</List.Item>
              <List.Item>{t("common.Updated layouts for product, collection, and homepage")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. User Experience Improvement")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Simplified navigation and menu structure")}</List.Item>
              <List.Item>{t("common.User-friendly filters for better product discovery")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. SEO Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.SEO-friendly store setup")}</List.Item>
              <List.Item>{t("common.Optimized meta tags and descriptions")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.4. Mobile Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Fully responsive design for all devices")}</List.Item>
              <List.Item>{t("common.Enhanced mobile usability for seamless shopping")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: StoreFilledIcon,
    color: "info",
  },
  {
    title: "Fully custom store design",
    type: "customStoreDesign",
    time: "3 week",
    planName: "Custom Service-Custom Store Design",
    price: 500,
    bigDescription: (
      <Text>
        {t(
          "common.This custom store design package offers a unique, professionally designed theme that’s fully responsive and tailored to your brand. It includes a completely original layout, custom pages and forms, and an optimized cart and checkout process for enhanced customer experience. We also integrate advanced UX features like sticky add-to-cart buttons, product quick view, and custom upsell/cross-sell options to boost sales and engagement."
        )}
      </Text>
    ),
    smallDescription:
      "Get a fully customized, mobile-responsive Shopify store with a unique theme, tailored user experience, and advanced features to match your brand and industry.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Custom Theme Design")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Fully unique, custom layout (not based on pre-made themes)")}</List.Item>
              <List.Item>{t("common.Mobile-responsive design for optimal viewing on all devices")}</List.Item>
              <List.Item>{t("common.Tailored UX/UI designed specifically for your industry")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Custom Pages & Forms")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Addition of custom pages (About, Contact, etc.)")}</List.Item>
              <List.Item>{t("common.Custom forms tailored to your business needs")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.3. Customized Cart & Checkout")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Sliding drawer or pop-up cart for smoother shopping")}</List.Item>
              <List.Item>{t("common.Custom upsell/cross-sell functionality in the cart")}</List.Item>
              <List.Item>{t("common.Branded, personalized checkout experience")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.4. Advanced UX Features")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Sticky Add to Cart for easy access")}</List.Item>
              <List.Item>{t("common.Product quick view for faster shopping decisions")}</List.Item>
              <List.Item>
                {t("common.Trust badges, accordion tabs, and scroll animations for enhanced user interaction")}
              </List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: PersonSegmentIcon,
    color: "warning",
  },
  {
    title: "Shopify theme customization",
    time: "30 days",
    planName: "Custom Service-Theme Customization",
    price: 500,
    bigDescription: (
      <Text>
        {t(
          "common.Transform your Shopify store with advanced design changes, custom functionalities, and deep theme-level enhancements. Built for brands needing flexibility, precision, and performance."
        )}
      </Text>
    ),
    smallDescription:
      "Transform your Shopify store with advanced design changes, custom functionalities, and deep theme-level enhancements. Built for brands needing flexibility, precision, and performance.",
    fullDescription: (
      <BlockStack gap="400">
        <Text variant="headingMd">{t("common.What's included")} :</Text>
        <InlineGrid columns={{ sm: 1, md: 2 }} gap="400">
          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.1. Design & Layout Customization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Premium Shopify professional theme design")}</List.Item>
              <List.Item>{t("common.Custom design modifications")}</List.Item>
              <List.Item>{t("common.Product and collection page enhancements")}</List.Item>
              <List.Item>{t("common.Custom animation integrations")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.2. Performance & SEO Optimization")}</Text>
            <List type="bullet">
              <List.Item>{t("common.SEO-friendly store setup")}</List.Item>
              <List.Item>{t("common.Optimize structure for speed & accessibility")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.3. Feature Enhancements")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Add custom filter options")}</List.Item>
              <List.Item>{t("common.Setup multiple payment options")}</List.Item>
              <List.Item>{t("common.Add metafields & metaobjects integration")}</List.Item>
            </List>
          </BlockStack>

          <BlockStack gap="200">
            <Text variant="headingSm">{t("common.4. Advanced Theme Development")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Shopify Liquid & JavaScript custom coding")}</List.Item>
              <List.Item>{t("common.Fix HTML/CSS/JavaScript issues")}</List.Item>
              <List.Item>{t("common.Add/modify comparison sliders")}</List.Item>
              <List.Item>{t("common.Integrate search functionality changes")}</List.Item>
            </List>
            <Text variant="headingSm">{t("common.5. Bug Fixes & Responsiveness")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Fix Shopify theme bugs and layout errors")}</List.Item>
              <List.Item>{t("common.Resolve mobile responsiveness issues")}</List.Item>
              <List.Item>{t("common.Handle responsiveness conflicts")}</List.Item>
            </List>

            <Text variant="headingSm">{t("common.6. Platform Integration & Migration")}</Text>
            <List type="bullet">
              <List.Item>{t("common.Shopify Plus checkout customization")}</List.Item>
              <List.Item>{t("common.Migrate from any CMS to Shopify")}</List.Item>
            </List>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    ),
    icon: ThemeEditIcon,
    color: "caution",
    badgeColor: "attention",
  },
];
