import shopify from "../shopify.js";
import { saveShopToken, installApp2, getShopDetails, updateShopToken, saveShopDetails, updateShopDetails, getAnalyticShop  } from "../db.js";
import {
  gdprTopics,
  InvalidOAuthError,
  CookieNotFound,
} from "@shopify/shopify-api";
import ensureBilling from "../helpers/ensure-billing.js";
import redirectToAuth from "../helpers/redirect-to-auth.js";
import logger from "../logger.js";
import { InstallShopMailSend } from "../MailSend.js";
import axios from "axios";



export default function applyAuthMiddleware(app) {
    
  app.get("/api/auth", async (req, res) => {
    console.log(req, res, app);
    return redirectToAuth(req, res, app);
  });



  app.get("/api/auth/callback", async (req, res) => {
    try {
      const callbackResponse = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      const session = JSON.stringify(callbackResponse);
      logger.info(session);

      const getShopData = await getShopDetails(callbackResponse.session.shop);
      const getAnalyticsShop = await getAnalyticShop(callbackResponse.session.shop);
      if (getShopData == undefined || getShopData == undefined) {
       
          await saveShopToken(callbackResponse.session.shop, callbackResponse.session.accessToken)
      } else {
          await updateShopToken(callbackResponse.session.shop, callbackResponse.session.accessToken)
      }
     
      let storeemail;
      let storeOwner;

      try {

        const response = await axios.get(`https://${callbackResponse.session.shop}/admin/api/2023-04/shop.json`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': callbackResponse.session.accessToken
            }
          },
        );

        logger.info("contactmail", response.data.shop)

        storeemail = response.data.shop.customer_email
        storeOwner = response.data.shop.shop_owner

      } catch (error) {
        console.log(error);
        console.log("get shop details error");
      }

      if (getAnalyticsShop == {} || getAnalyticsShop == undefined) {
        await saveShopDetails(callbackResponse.session.shop, storeemail, "Active", storeOwner)
      } else {
        await updateShopDetails(callbackResponse.session.shop, storeemail, "Active", storeOwner)
      }

      InstallShopMailSend(storeemail, callbackResponse.session.shop, storeOwner);


      const responses = await shopify.webhooks.register({
        session: callbackResponse.session,
      });

      Object.entries(responses).map(([topic, responsesForTopic]) => {
        // The response from register will include the GDPR topics - these can be safely ignored.
        // To register the GDPR topics, please set the appropriate webhook endpoint in the
        // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.

        // If there are no entries in the response array, there was no change in webhook
        // registrations for that topic.
        if (gdprTopics && Array.isArray(gdprTopics) && !gdprTopics.includes(topic) && responsesForTopic.length > 0) {
          // Check the result of each response for errors
          responsesForTopic.map((response) => {
            if (!response.success) {
              if (response.result.errors) {
                console.log(
                  `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
                );
              } else {
                console.log(
                  `Failed to register ${topic} webhook: ${JSON.stringify(
                    response.result.data,
                    undefined,
                    2
                  )}`
                );
              }
            }
          });
        }
      });

      const [hasPayment, confirmationUrl] = await ensureBilling(
        callbackResponse.session
      );

      if (!hasPayment) {
        return res.redirect(confirmationUrl);
      }


      const host = shopify.utils.sanitizeHost(req.query.host);
      const redirectUrl = shopify.config.isEmbeddedApp
        ? await shopify.auth.getEmbeddedAppUrl({
          rawRequest: req,
          rawResponse: res,
        })
        : `/?shop=${callbackResponse.session.shop}&host=${encodeURIComponent(host)}`;

      res.redirect(redirectUrl);
    } catch (e) {
      console.warn(e);
      switch (true) {

        case e instanceof InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;

        case e instanceof CookieNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          return redirectToAuth(req, res, app);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}