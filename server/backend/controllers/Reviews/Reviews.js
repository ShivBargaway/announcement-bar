import axios from "axios";
import * as cheerio from "cheerio";
import { customerlyCronJob } from "../Customerly/Customerly.js";
import { bulkWrite, find } from "./../../model/common.js";

function getRating(element) {
  const labels = ["5", "4", "3", "2", "1"];

  for (const label of labels) {
    if (element.find(`div[aria-label='${label} out of 5 stars']`).length > 0) {
      return parseInt(label, 10);
    }
  }
  return 0;
}

async function crawlPage(url, results, type) {
  try {
    if (process.env.ENV === "dev") console.log("crawlPage", type, url);

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const reviews = $("div[data-merchant-review]");

    reviews.each((index, element) => {
      const $element = $(element);

      const rating = getRating($element);
      const review = $element
        .find(">div:nth-child(1)>div:nth-child(2) div[data-truncate-content-copy] p")
        .text()
        .trim();
      const storeName = $element.find(">div:nth-child(2)>div:nth-child(1)").text().trim();
      const country = $element.find(">div:nth-child(2)>div:nth-child(2)").text().trim();
      const reviewedAfter = $element.find(">div:nth-child(2)>div:nth-child(3)").text().trim();
      const date =
        new Date($element.find(">div:nth-child(1)>div:nth-child(1)>div:nth-child(2)").text().trim()) || null;

      const reviewObject = {
        review,
        storeName,
        country,
        date,
        reviewedAfter,
        rating,
      };

      results.push(reviewObject);
    });

    if (type == "all") {
      const nextPage = $("a[rel='next']").attr("href");
      if (nextPage) {
        const nextPageUrl = new URL(nextPage, url).toString();
        await crawlPage(nextPageUrl, results, type);
      }
    }
  } catch (error) {
    throw error;
  }
}

const updateReviews = async (reviews) => {
  try {
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special characters
    }
    const reviewUsers = reviews.map((review) => new RegExp(`^${escapeRegExp(review?.storeName)}`, "i"));
    // const reviewUsers = reviews.map((review) => new RegExp(`^${review?.storeName}`, "i"));

    const users = await find("user", {
      storeName: { $in: reviewUsers },
    });

    await customerlyCronJob(0, users);

    const updateUsers = [];
    for (const user of users) {
      let reviewMeta = reviews.find(
        (review) => review.storeName.toLowerCase().trim() === user.storeName.toLowerCase().trim()
      );
      const earnPoint = user?.reviewCredit?.giveCreditForReview
        ? { "reviewCredit.giveCreditForReview": false }
        : {};
      updateUsers.push({
        updateOne: {
          filter: { shopUrl: user.shopUrl },
          update: {
            $set: {
              "reviewRequest.reviewMeta": reviewMeta,
              "reviewRequest.isReviewPosted": true,
              ...earnPoint,
            },
          },
        },
      });
    }

    if (updateUsers.length > 0) return await bulkWrite("user", updateUsers);
  } catch (error) {
    throw error;
  }
};

async function getLastPageNumber(baseUrl) {
  try {
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);

    // Find all page numbers in pagination
    const pageNumbers = [];

    // Find the parent container of pagination (nav or div containing the Next button)
    const nextButton = $('a[rel="next"]');

    if (nextButton.length > 0) {
      // Get the parent container of the Next button
      const paginationContainer = nextButton.parent().parent();

      // Find all links in the pagination and extract numbers
      paginationContainer.find("a").each((index, element) => {
        const text = $(element).text().trim();
        const pageNum = parseInt(text, 10);

        // Only add valid page numbers (ignore "Next", "Previous", etc.)
        if (!isNaN(pageNum) && pageNum > 0) {
          pageNumbers.push(pageNum);
        }
      });

      // Return the highest page number
      if (pageNumbers.length > 0) {
        const lastPage = Math.max(...pageNumbers);
        return lastPage;
      }
    }
    return 1;
  } catch (error) {
    throw error;
  }
}

async function crawlData(type = "one") {
  try {
    const results = [];

    // // 1. Crawl first page (newest reviews)
    const baseUrl = `${process.env.SHOPIFY_STORE_APP_URL}/reviews?sort_by=newest`;
    await crawlPage(baseUrl, results, type);

    // 2. Get the last page number dynamically from pagination
    const lastPageNumber = await getLastPageNumber(baseUrl);
    if (lastPageNumber && lastPageNumber > 1) {
      const lastPageUrl = `${process.env.SHOPIFY_STORE_APP_URL}/reviews?page=${lastPageNumber}`;
      await crawlPage(lastPageUrl, results, type);
    }
    return await updateReviews(results);
  } catch (error) {
    throw error;
  }
}

export { crawlData };
