import { DeliveryMethod } from "@shopify/shopify-api"
import shopify from "./shopify.js";


export async function setupGDPRWebHooks(path) {
   return await shopify.webhooks.addHandlers({
      CUSTOMERS_DATA_REQUEST: {
         deliveryMethod: DeliveryMethod.Http,
         callbackUrl: path,
         callback: async (topic, shop, body) => {
            const payload = JSON.parse(body);
         },
      },
   });
}
