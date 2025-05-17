import axios from "axios";
import logger from "../logger";
import { getShopToken } from "../db";

const generateLink = async (shopDomain, getResponse) => {

  try {
    const pageInfo = getResponse.headers["link"];

    if (pageInfo) {
      // previous page
      const checkPreviousPageLink = getResponse.headers["link"].match(
        /<([^>]+)>; rel="previous"/
      );

      // next page
      const checkNextPageLink = getResponse.headers["link"].match(
        /<([^>]+)>; rel="next"/
      );

      const obUrl = {
        prevLink:
          checkPreviousPageLink !== null ? checkPreviousPageLink[1] : null,
        nextLink: checkNextPageLink !== null ? checkNextPageLink[1] : null,
      };
      return obUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error generateLink for shop ${shopDomain}: ${error}`);
    logger.error(`Error generateLink for shop ${shopDomain}: ${error}`);
  }
};

const getPageData = async (info, limit, shopDomain, token) => {
  try {
    const response = await axios.get(
      `https://${shopDomain}/admin/api/2025-04/orders.json?limit=${limit}&page_info=${info}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
          link: `<https://${shopDomain}/admin/api/2025-04/orders.json?limit=${limit}&page_info=${info}>`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(`Error getPageData for shop ${shopDomain}: ${error}`);
    logger.error(`Error getPageData for shop ${shopDomain}: ${error}`);
  }
};

const getSingleOrder = async(parseId,shop)=>{
  try {

  const accessToken = await getShopToken(shop).then(function (val) {
      return val;
  });

  const config = {
      headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
          'cache-control': 'no-cache'
      },
      
  } 

  let ordersUrl = `https://${shop}/admin/api/2024-07/orders/${parseId}.json`;

  const ordersResponse = await axios.get(ordersUrl, config);

  const orderDetails = ordersResponse.data.order
  
 return orderDetails
          } catch (error) {
      console.error('Error in fetching single order', error);
  }
}

const getVarientsByIds = async(vids,shop)=>{


  const token = await getShopToken(shop);

  const ids = vids.map(id => `"${id}"`).join(',');
  try {
    const query = `
    query {
      nodes(ids: [${ids}]) {
        ... on ProductVariant {
          id
          title
          price
          sku
          inventoryItem{
          tracked
          id
          }
          inventoryQuantity
          product {
            id
            title
            handle
          }
        }
      }
    }
  `;
  
  const response = await axios.post(
    `https://${shop}/admin/api/2024-07/graphql.json`,
    { query },
    {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    }
  );
  
  const productVarient = response.data.data.nodes;
  const arr = [];
  
      productVarient.map((val)=>{
        if(val.sku !== null && (val.inventoryItem !== undefined && val.inventoryItem.tracked === true) ){
          const ob = {
            sku : val.sku,
            inventoryId : val.inventoryItem.id,
            inventoryQty : val.inventoryQuantity ? val.inventoryQuantity : 0 
        }
        arr.push(ob)
        }
     })  
  
  
     return arr
  
  } catch (error) {
    console.error("Error in getVarientsByIds",error)
  }

 
}





// const getInvetoryData = async(arr,inventoryData,locationId,shop)=>{
//   console.log(inventoryData)

//   const token = await getShopToken(shop);
//   const inventoryIds = inventoryData.map((val)=>val.inventoryId)
// console.log("getInvetoryData inventoryIds", inventoryIds)
//   const inventoryResponse = await axios.get(
//     `https://${shop}/admin/api/2024-10/inventory_items.json?ids=${inventoryIds}`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': token,
//       },
//     }
//   );
  

// const newArr = [];

// inventoryResponse.data.inventory_items.map((val) => {
//   const ob = {
//     inventoryId: val.id,
//     inventoryTracked: val.tracked,
//   };

// newArr.push(ob);
// });


// const merged = inventoryData.map(item1 => {
//   const match = newArr.find(item2 => item2.inventoryId === item1.inventoryId);
//   return {
//     ...item1,
//     inventoryTracked: match ? match.inventoryTracked : null
//   };
// });

// const updatedArr1 = merged.map(item1 => {
//   const matched = arr.find(item2 => item2.sku === item1.sku);
//   return {
//     ...item1,
//     newQty: matched ? matched.qty : 0 // Set qty to 0 if no match is found
//   };
// });


// return updatedArr1

// }

export { getPageData, generateLink ,getSingleOrder,getVarientsByIds};

// /admin/api/2024-10/inventory_levels.json?locationids=655441491
// const ob = {
//   productId:val.product.id,
//   productTitle: val.product.title,
//   varientId : val.id,
//   inventoryId : val.inventoryItem.id,
//   inventoryTracked : val.inventoryItem.tracked,
//   varientTitle : val.title,
//   price : val.price,
//   sku : val.sku ? val.sku: "Not Available",
//   inventoryQty : val.inventoryQuantity
// }

// if(arr.length > 0){
//   const merged = arr.map(item1 => {
//     const match = data.find(item2 => item2.inventoryId === item1.inventoryId);
//     return {
//       ...item1,
//       inewQty: match ? match.qty : 0
//     };
//   });
//   return merged
// }
// else{
//   return []
// }