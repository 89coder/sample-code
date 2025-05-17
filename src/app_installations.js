import { getShopToken, deleteshop, uninstallApp2 } from "./db.js";

export const AppInstallations = {
  includes: async function (shopDomain) {
    const access_token = await getShopToken(shopDomain);

    if (access_token) {
      return true;
    }

    return false;
  },


  delete: async function (shopDomain) {
    const access_token = await getShopToken(shopDomain);
    
    if (access_token) {
      await deleteshop(shopDomain);
    }
    
  },
};