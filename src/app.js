import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { DeliveryMethod } from "@shopify/shopify-api";

import shopify from "./shopify.js";
import applyAuthMiddleware from "./middleware/auth.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";

import { AppInstallations } from "./app_installations.js";
import path from "path";
import {
    saveChargeId,
    getShopToken,
    getChargeId,
    updateAppStatus,
    getShopDetails,
    updateShopStatus, 
    getAnalyticShop
} from "./db.js";

import axios from "axios";
import cors from "cors";
import logger from "./logger.js";
import { UninstallShopMailSend } from "./MailSend.js";

import fileUrl from "./routes/fileRouter.js"
import connectToDb from "./db.js"

const USE_ONLINE_TOKENS = true;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// DB connect
connectToDb();

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/backend/`;
const PROD_INDEX_PATH = `${process.cwd()}/backend/`;

shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/customer_data_request",
        callback: async (_topic, shop, _body) => {
            await AppInstallations.delete(shop);
        },
    },
});


shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/customer_data_erasure",
        callback: async (_topic, shop, _body) => {
            await AppInstallations.delete(shop);
        },
    },
});


shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/shop_data_erasure",
        callback: async (_topic, shop, _body) => {
            await AppInstallations.delete(shop);
        },
    },
});


shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (_topic, shop, _body) => {
            await AppInstallations.delete(shop);
        },
    },
});

// export for test use only
export async function createServer(
    root = process.cwd(),

    isProd = process.env.NODE_ENV === "development"
) {
    const app = express();

    // Middleware function
    const myMiddlewarechargeid = async (req, res, next) => {
        const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // console.log(`Current URL: ${currentUrl}`);
        // console.log(req.query);

        const shop = shopify.utils.sanitizeShop(req.query.shop);

        const appInstalled = AppInstallations.includes(shop);

        if (typeof req.query.charge_id != 'undefined') {
            saveChargeId(req.query.shop, req.query.charge_id);
        }

        if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
            return redirectToAuth(req, res, app);
        }

        // Perform middleware logic
        next(); // Call next() to pass control to the next middleware or route handler
    };

    app.use(express.static('public'))

    app.use(myMiddlewarechargeid);

    app.set("use-online-tokens", USE_ONLINE_TOKENS);

    app.use(cookieParser(shopify.config.apiSecretKey));

    applyAuthMiddleware(app);

    app.post("/api/webhooks", express.text({ type: "*/*" }), async (req, res) => {

        try {
            const webhookData = req.headers;

            if (webhookData['x-shopify-topic'] == "app/uninstalled") {
                const shop = webhookData['x-shopify-shop-domain'];
                // Delete app installation or perform other necessary actions
                // Example: await AppInstallations.delete(shop);
                logger.info(`Received APP_UNINSTALLED webhook for shop: ${shop}`);

                // Respond with a 200 OK status to acknowledge receipt
                res.status(200).send('Webhook received and processed successfully');
            } else {
                // For unauthorized requests, respond with a 401 Unauthorized status
                res.status(401).send('Unauthorized: Webhook not supported');
            }

        } catch (error) {

            if (!res.headersSent) {
                res.status(500).send('Webhook processing failed');
            }

        }

    });

    app.post("/customer_data_request", express.text({ type: "*/*" }), async (req, res) => {
        try {
            const webhookData = req.headers;

            if (webhookData['x-shopify-topic'] == "app/uninstalled") {
                const shop = webhookData['x-shopify-shop-domain'];
                // Delete app installation or perform other necessary actions
                // Example: await AppInstallations.delete(shop);
                logger.info(`Received APP_UNINSTALLED webhook for shop: ${shop}`);

                // Respond with a 200 OK status to acknowledge receipt
                res.status(200).send('Webhook received and processed successfully');
            } else {
                // For unauthorized requests, respond with a 401 Unauthorized status
                res.status(401).send('Unauthorized: Webhook not supported');
            }

        } catch (error) {

            if (!res.headersSent) {
                res.status(500).send('Webhook processing failed');
            }

        }
    });



app.use(express.json());

app.post("/graphql-proxy", async (req, res) => {
    const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing GraphQL query" });
  }
  const shop="anita-test-pro.myshopify.com";
   const accessToken = await getShopToken(shop).then(function (val) {
      return val;
  });

  const response = await axios.post(
    `https://anita-test-pro.myshopify.com/admin/api/2024-01/graphql.json`,
    JSON.stringify({ query, variables }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    }
  );

  res.send(response.data);
});






    app.post("/customer_data_erasure", express.text({ type: "*/*" }), async (req, res) => {
        try {
            const webhookData = req.headers;

            if (webhookData['x-shopify-topic'] == "app/uninstalled") {
                const shop = webhookData['x-shopify-shop-domain'];
                // Delete app installation or perform other necessary actions
                // Example: await AppInstallations.delete(shop);
                logger.info(`Received APP_UNINSTALLED webhook for shop: ${shop}`);

                // Respond with a 200 OK status to acknowledge receipt
                res.status(200).send('Webhook received and processed successfully');
            } else {
                // For unauthorized requests, respond with a 401 Unauthorized status
                res.status(401).send('Unauthorized: Webhook not supported');
            }

        } catch (error) {

            if (!res.headersSent) {
                res.status(500).send('Webhook processing failed');
            }

        }
    });


    app.post("/shop_data_erasure", express.text({ type: "*/*" }), async (req, res) => {

        try {
            // logger.info("Received webhook request:");
            // logger.info("Request Headers:", req.headers);
            // logger.info("Request body:", req.body);
            // logger.info("333333333333");

            // Parse and process the incoming webhook payload here
            const webhookData = req.headers;

            // Perform actions based on the webhook data
            // For example, handle the "APP_UNINSTALLED" event
            if (webhookData['x-shopify-topic'] == "app/uninstalled") {
                const shop = webhookData['x-shopify-shop-domain'];
                // Delete app installation or perform other necessary actions
                // Example: await AppInstallations.delete(shop);
                logger.info(`Received APP_UNINSTALLED webhook for shop: ${shop}`);
                
                // await saveChargeId(shop, null);
                await updateShopStatus(shop, "Unactive")

                const getAnalyticsCustomeremail = await getAnalyticShop(shop).then(function (val) {
                    return val.customer_email;
                });
    
                const getAnalyticsCustomerstore = await getAnalyticShop(shop).then(function (val) {
                    return val.shop;
                });
    
                const getAnalyticsCustomername = await getAnalyticShop(shop).then(function (val) {
                    return val.customer_name;
                });
    
                UninstallShopMailSend(getAnalyticsCustomeremail, getAnalyticsCustomerstore, getAnalyticsCustomername);

                // Respond with a 200 OK status to acknowledge receipt
                res.status(200).send('Webhook received and processed successfully');
            } else {
                // For unauthorized requests, respond with a 401 Unauthorized status
                res.status(401).send('Unauthorized: Webhook not supported');
            }
        } catch (error) {
            logger.info("4444444444444");
            logger.info('Error processing webhook:', error);

            // For internal errors, respond with a 500 Internal Server Error status
            if (!res.headersSent) {
                res.status(500).send('Webhook processing failed');
            }
        }

    });


    // All endpoints after this point will have access to a request.body
    // attribute, as a result of the express.json() middleware
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));

    app.use("/",fileUrl)
    
    app.get("/getShoplocale", async (req, res) => {
        logger.info("getShoplocale")
        
        const shopDomain = req.query.shop;
        
        const accessToken = await getShopToken(shopDomain).then(function (val) {
            return val;
        });
        
        const config = {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Shopify-Access-Token': accessToken
                            }
                        }
        
        try {
            const response = await axios.get(`https://${shopDomain}/admin/api/2024-07/shop.json`, config);
            
            logger.info(response.data.shop.primary_locale)
            
            const prefix_locale = (response.data.shop.primary_locale).split('-')[0];
            
            res.status(200).send(prefix_locale);
                            
        } catch (e) {
            logger.info("get shop locale error")
            logger.info(e)
            res.status(500).send("Internal server error");
        }
    });
    
    
    app.get('/activate-plan', async (req, res) => {
        
        logger.info("inside and click activate-plan router function")
            
            const shopDomain = req.query.shopDomain;
            const return_url = req.query.return_url;
            const planName = process.env.PLAN_NAME;
            const planAmount = process.env.PLAN_AMOUNT;
            const planCurrency = process.env.PLAN_CURRENCY_CODE;
            const trialDays = process.env.TRIAL_DAYS;
            
            const accessToken = await getShopToken(shopDomain).then(function (val) {
                return val;
            });

            // const application_charge = {
            //     "application_charge": {
            //         "name": planName,
            //         "price": planAmount,
            //         "return_url": `${return_url}`,
            //         "test": false
            //     }
            // }
            const recurringApplicationCharge = {
                recurring_application_charge: {
                    name: planName,
                    price: planAmount,
                    return_url: `${return_url}`,
                    test: true,
                    trial_days: trialDays,
                }
            };
            
            try {
                
                const response = await axios.post(`https://${shopDomain}/admin/api/2024-07/recurring_application_charges.json`, recurringApplicationCharge, {
                    headers: {
                        'Content-Type': 'application/json',
                        "X-Shopify-Access-Token": accessToken
                    },
                });
    
                const responseJson = response.data.recurring_application_charge;
                logger.info("responseJsonnnnnnnnn chargeeeeee");
                logger.info(responseJson);
                
                if (responseJson){
                    res.redirect(responseJson.confirmation_url);
                }
                
            } catch (e) {
                logger.info("error", e)
            }

    });


    app.use((req, res, next) => {

        const shop = shopify.utils.sanitizeShop(req.query.shop);
        if (shopify.config.isEmbeddedApp && shop) {
            res.setHeader(
                "Content-Security-Policy",
                `frame-ancestors https://${encodeURIComponent(
                    shop
                )} https://admin.shopify.com;`
            );
        } else {
            res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
        }
        next();
    });

    if (isProd) {
        const compression = await import("compression").then(
            ({ default: fn }) => fn
        );
        const serveStatic = await import("serve-static").then(
            ({ default: fn }) => fn
        );
        app.use(compression());
        app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
    }

    app.use("/*", async (req, res, next) => {

        if (typeof req.query.shop !== "string") {
         
        }

        if (!req.query.embedded) {
            logger.info("embeddedddddddddddd");
            return redirectToAuth(req, res, app);
        }

        const shop = shopify.utils.sanitizeShop(req.query.shop);
        const appInstalled = await AppInstallations.includes(shop);

        if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
            return redirectToAuth(req, res, app);
        }

        if (shopify.config.isEmbeddedApp && req.query.embedded !== "1") {
            const embeddedUrl = await shopify.auth.getEmbeddedAppUrl({
                rawRequest: req,
                rawResponse: res,
            });

            // console.log(embeddedUrl + req.path);
            return res.redirect(embeddedUrl + req.path);
        }
        
     
        ///////////////////// status and badge data value start //////////////////////////
        
        const appStatus = await getShopDetails(req.query.shop).then(function (val) {
            return val.app_status;
        });
        
        // const badgeTitle = await getShopDetails(req.query.shop).then(function (val) {
        //     return val.badge_title;
        // });
        
        // logger.info("status and badge data value")
        // logger.info(appStatus)
        // logger.info(badgeTitle)
        
        
        // if ( badgeTitle == "" || badgeTitle == null || badgeTitle == undefined ) {
        //     logger.info("when badge title is null/undefined")
        //     await updateAppStatus(req.query.shop, "enable", "Purchased", "16px", "Purchased times", "20px", "You last purchased this item on", "15px", "View order details", "16px", "#193934", "#193934", "#ffffff", "#ffffff");
        // }
        
        ///////////////////// status and badge data value end //////////////////////////
        

        // one time application charge api start //

        const getCharge_id = await getChargeId(req.query.shop).then(function (val) {
            logger.info(val);

            return val;
        });
        
        const embeddedUrl = await shopify.auth.getEmbeddedAppUrl({
                rawRequest: req,
                rawResponse: res,
        });
        
        
        const inactive = () => {
            
            logger.info("inside inactive function")
            
            const msg = `<div style="text-align: center;  margin: 0 auto;">
			
				<h1  
					style="
						font-size: 24px;
						background-color: #fff;
						padding: 55px;
						font-family: sans-serif;
						margin-top: 32px !important;
						border-radius: 25px;
						width: 67%;
						margin: 0 auto;
						text-align: center;
						border: 1px solid #ccc;
						box-shadow: 0 0 5px 1px #ccc;
					"
				>
					You do not have any active plan for the app installed by you, please activate the plan of the app. 
				</h1>
				
				<a target="_parent" href="/activate-plan?shopDomain=${req.query.shop}&return_url=${embeddedUrl}${req.path}"
					style="
						background-color: dodgerblue;
						display: inline-block;
						margin-top: 20px;
						padding: 16px 31px;
						text-decoration: unset;
						font-size: 19px;
						border-radius: 7px;
						color: #fff;
						text-transform: capitalize;
						font-family: sans-serif;
						cursor: pointer;
					"
				>
					Activate Plan
				</a>
			
			</div>`

            return res
                .status(200)
                .set("Content-Type", "text/html")
                .send(msg);
                
        }

        // one time application charge api end //


        if (getCharge_id == null || getCharge_id == undefined || getCharge_id == "") {
            inactive();
        } else {
            const htmlFile = join(
                isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
                "index.html"
            );

            return res
                .status(200)
                .set("Content-Type", "text/html")
                .send(readFileSync(htmlFile));
        }


    });

    return { app };
}

createServer().then(({ app }) => app.listen(PORT));