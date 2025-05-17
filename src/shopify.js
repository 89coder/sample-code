import '@shopify/shopify-api/adapters/node';
import {
  shopifyApi,
  BillingInterval,
  LATEST_API_VERSION,
  ApiVersion,
  LogSeverity,
} from '@shopify/shopify-api';
let { restResources } = import(
  `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`
);
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const planName = process.env.PLAN_NAME;
const planAmount = process.env.PLAN_AMOUNT;
const planCurrency = process.env.PLAN_CURRENCY_CODE;
const trialDays = parseFloat(process.env.TRIAL_DAYS);

const billingConfig = {
  'Basic Plan': {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: planAmount,
    currencyCode: planCurrency,
    interval: BillingInterval.Every30Days,
    trialDays: trialDays,
  },
};

console.log(process.env.SCOPES)

const apiConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  accessMode: 'offline',
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST_NAME,
  hostScheme: "https",
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  //   ...(process.env.SHOP_CUSTOM_DOMAIN && {
  //     customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN],
  //   }),
  billing: billingConfig, // or replace with billingConfig above to enable example billing
  restResources,
};

const shopify = shopifyApi(apiConfig);
export default shopify;