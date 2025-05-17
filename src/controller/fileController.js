

// export const uplaodCsvController = async (req, res) => {

import axios from "axios";
import { getShopToken } from "../db";
import logger from "../logger";

//   try {
  
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }
// console.log(req.files)
//     res.send(`file Uploaded : ${req.files}`)
  
//   } catch (error) {
//     console.error("Error in uploading csv", error);
//   }
// };

export const uplaodFileController = async (req, res) => {
  try {
    const {shop} = req.query

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }


 const imgLinks = req.files.map(f => `https://ai.surajkumawat.com/${f.filename}`)


  const accessToken = await getShopToken(shop).then(function (val) {
      return val;
  });


  let inputData = []
  imgLinks.map((link)=>{
    const ob = {
          alt: "Fallback text for an image",
      contentType: "IMAGE",
      originalSource: link
    }

    inputData.push(ob)
  })
logger.info("uplaodFileController inputData")
logger.info(inputData)
// imgLinks.map(async(link)=>{
    const query = `
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        fileStatus
        alt
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const variables = {
  files: inputData
};

const response = await axios.post(
  `https://${shop}/admin/api/2025-01/graphql.json`,
  {
    query,
    variables,
  },
  {
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
      "cache-control": "no-cache",
    },
  }
);

 let resData = response.data.data.fileCreate
// })
logger.info("uplaodFileController resData")
logger.info(resData)
if(resData){
res.json({isSuccess: true, msg: "Upload Success"});
}
else{
res.json({isSuccess: false, msg: "Upload Fail"});
}

  } catch (error) {
    console.error("Error in uploading csv", error);
    res.status(500).send("Error uploading files");
  }
};

export const countFileController = async (req, res) => {
  try {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: "Missing shop parameter" });
    }

    const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    if (!shopRegex.test(shop)) {
      return res.status(400).json({ error: "Invalid shop domain" });
    }

    const accessToken = await getShopToken(shop);

    if (!accessToken) {
      return res.status(401).json({ error: "Access token not found for shop" });
    }

    let fileCount = 0;
    let hasNextPage = true;
    let cursor = null;

    while (hasNextPage) {
      const query = `
        query getFiles($cursor: String) {
          files(first: 250, after: $cursor) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
              }
            }
          }
        }
      `;

      const variables = { cursor };

      const response = await axios.post(
        `https://${shop}/admin/api/2024-04/graphql.json`,
        { query, variables },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
            "cache-control": "no-cache",
          },
        }
      );

      const data = response.data?.data?.files;
      if (!data) break;

      const edges = data.edges;
      fileCount += edges.length;

      hasNextPage = data.pageInfo.hasNextPage;
      cursor = hasNextPage ? edges[edges.length - 1].cursor : null;
    }
logger.info("countFileController fileCount")
logger.info(fileCount)
    if(fileCount > 0){
res.status(200).json({isSuccess: true, fileCount});
    }
else{
  res.status(200).json({ isSuccess: false, fileCount });
}
    
  } catch (error) {
    console.error("Error fetching file count:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch file count" });
  }
};