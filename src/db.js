import mysql from 'mysql2/promise';
import logger from "./logger.js";
import * as dotenv from 'dotenv';
dotenv.config()
import InstallShop from "./models/InstallShopModel.js"
import AnalyticShop from "./models/AnalyticShopModel.js"
import mongoose from 'mongoose';

const connectToDb = async()=> {
  try {
    await mongoose.connect('process.env.mongo_uri');
    console.log("connect to database");
  } catch (error) {
    console.error("connection failed");
    console.error(error)
  }
}
// const connectToDb = async()=> {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/filedb');
//     console.log("connect to database");
//   } catch (error) {
//     console.error("connection failed");
//     console.error(error)
//   }
// }

export default connectToDb


// const pool = mysql.createPool({
//   host: process.env.DATABASE_HOSTNAME,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   waitForConnections: true,
//   connectionLimit: 100,
//   queueLimit: 0
// });



// CREATE TABLE analytic_install (
//   id int NOT NULL AUTO_INCREMENT,
//   shop varchar(255) NOT NULL,
//   install_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   uninstall_date datetime DEFAULT NULL,
//   App_status varchar(255) NOT NULL,
//   PRIMARY KEY (id)
// )


// Function to save access token install_shop in the database
const saveShopToken = async (shop, accessToken) => {
  // try {
  //   const [results, fields] = await pool.execute(
  //     'INSERT INTO install_shop (shop, access_token) VALUES (?, ?)',
  //     [shop, accessToken]
  //   );
  //   console.log(`Access token saved for shop ${shop}`);
  //   return true;
  // } catch (error) {
  //   console.error(`Error saving access token for shop ${shop}: ${error}`);
  //   return false;
    
  //   throw error;
  // }

      const ob={
              shop:shop,
              accessToken:accessToken,
            }

const newUser = new InstallShop(ob);
await newUser.save();
          
        
};


// Function to save data analytic_install in the database
const installApp2 = async (shop, App_status) => {
  try {
    const [results, fields] = await pool.execute(
      'INSERT INTO analytic_install (shop, App_status) VALUES (?, ?)',
      [shop, App_status]
    );
    console.log(`analytic_install saved for shop ${shop}`);
    return true;
  } catch (error) {
    console.error(`Error saving analytic_install for shop ${shop}: ${error}`);
    return false;
    throw error;
  }
};


// Function to save data analytic_install in the database
const uninstallApp2 = async (shop, uninstall_date, App_status) => {
  try {
    const [results, fields] = await pool.execute(
      'UPDATE analytic_install set uninstall_date=?, App_status=? WHERE shop=?',
      [uninstall_date, App_status, shop]
    );
    console.log(`analytic_install update for shop ${shop}`);
    return true;
  } catch (error) {
    console.error(`Error update analytic_install for shop ${shop}: ${error}`);
    return false;
    throw error;
  }
};


// Function to get access token from the database
const getShopToken = async (shop) => {
  try {
    // const [results, fields] = await pool.execute('SELECT access_token FROM install_shop WHERE shop = ?', [shop]);
    // return results[0] ? results[0].access_token : null;

      const result = await InstallShop.findOne({shop:shop})
        return result ? result.accessToken : null;
  } catch (error) {
    console.error(`Error get access token for shop ${shop}: ${error}`);
    throw error;
  }
};

// Function to get data from the database
const getShopDetails = async (shop) => {
  try {
    // const [results, fields] = await pool.execute('SELECT * FROM install_shop WHERE shop = ?', [shop]);
    // return results[0];
          const result = await InstallShop.findOne({shop:shop})
       return result
  } catch (error) {
    console.error(`Error get shop details for shop ${shop}: ${error}`);
    throw error;
  }
};


// Function to save charge ID in the database
const saveChargeId = async (shop, chargeId) => {
  try {
    // const [results, fields] = await pool.execute(
    //   'UPDATE install_shop set charge_id=? WHERE shop=?',
    //   [chargeId, shop]
    // );
    // console.log(`Charge ID saved for access token ${shop}`);
    // return results;

         const query = {shop:shop}
     const ob = {
        chargeId:chargeId
     }

     await InstallShop.findOneAndUpdate(query,ob)
  } catch (error) {
    console.error(`Error saving charge ID for access token ${shop}: ${error}`);
    throw error;
  }
};


// Function to get charge ID from the database
const getChargeId = async (shop) => {
  try {
    // const [results, fields] = await pool.execute('SELECT charge_id FROM install_shop WHERE shop = ?', [shop]);
    // return results[0] ? results[0].charge_id : null;
            const result = await InstallShop.findOne({shop:shop})
       return result.chargeId
  } catch (error) {
    console.error(`Error get charge ID for access token ${shop}: ${error}`);
    throw error;
  }
};


// Function to delete data from the database
const deleteshop = async (shop) => {
  try {
    // const [results, fields] = await pool.execute(
    //   'DELETE FROM install_shop WHERE shop=?',
    //   [shop]
    // );
    // console.log(`Delete this data for this shop: ${shop}`);
    // return results;
   const isDelete = await SelectBook.deleteOne({shop:shop})
    return isDelete

  } catch (error) {
    console.error(`Error delete data for shop ${shop}: ${error}`);
    throw error;
  }
};

// Function to update access token in the database
const updateShopToken = async (shop, accessToken) => {
  try {

    
     const query = {shop:shop}
     const ob = {
        accessToken:accessToken
     }

     await InstallShop.findOneAndUpdate(query,ob)

    
  } catch (error) {
    logger.info(`Error saving access token for shop ${shop}: ${error}`);
    return false;
    throw error;
  }
};


// Function to update app_satus in the database
const updateAppStatus = async (shop, app_status, badge_title, badge_fontsize, purchasetimes_text, purchasetimes_fontsize, lastpurchased_text, lastpurchased_fontsize, vieworder_text, vieworder_fontsize, badge_color, details_color, badgetext_color, detailstext_color) => {
  try {
    const [results, fields] = await pool.execute(
      'UPDATE install_shop set app_status=?, badge_title=?, badge_fontsize=?, purchasetimes_text=?, purchasetimes_fontsize=?, lastpurchased_text=?, lastpurchased_fontsize=?, vieworder_text=?, vieworder_fontsize=?, badge_color=?, details_color=?, badgetext_color=?, detailstext_color=? WHERE shop=?',
      [app_status, badge_title, badge_fontsize, purchasetimes_text, purchasetimes_fontsize, lastpurchased_text, lastpurchased_fontsize, vieworder_text, vieworder_fontsize, badge_color, details_color, badgetext_color, detailstext_color, shop]
    );

    logger.info(`update app_satus saved for shop ${shop}`);
    logger.info(results);
    
    return true;
    
  } catch (error) {
      
    logger.info(error);
    logger.info(`Error saving app_satus for shop ${shop}: ${error}`);
    return false;
    throw error;
    
  }
};


// Function to save email in the database
const saveShopDetails = async (shop, email, status, storeOwner) => {

  try {
    // const [results, fields] = await pool.execute(
    //   'INSERT INTO analytics_shop (shop, customer_email, status, customer_name) VALUES (?, ?, ?, ?)',
    //   [shop, email, status, storeOwner]
    // );
    // console.log(`email saved for shop ${shop}`);
    // return true;

          const ob={
              shop:shop,
              customerEmail:email,
              status:status,
              customerName:storeOwner,
            }

const newUser = new AnalyticShop(ob);
await newUser.save();
return true
  } catch (error) {
    console.error(`Error saving email for shop ${shop}: ${error}`);
    return false;
    throw error;
  }

};


// Function to update email in the database
const updateShopDetails = async (shop, email, status, storeOwner) => {

  try {
    // const [results, fields] = await pool.execute(
    //   'UPDATE analytics_shop set customer_email=?, status=?, customer_name=? WHERE shop=?',
    //   [email, status, storeOwner, shop]
    // );
    // console.log(`email update for shop ${shop}`);
    // return true;

        
     const query = {shop:shop}
      const ob={
              customerEmail:email,
              status:status,
              customerName:storeOwner,
            }

     await AnalyticShop.findOneAndUpdate(query,ob)
     return true
  } catch (error) {
    console.error(`Error updating email for shop ${shop}: ${error}`);
    return false;
    throw error;
  }

};

// Function to update email in the database
const updateShopStatus = async (shop, status) => {

  try {
    // const [results, fields] = await pool.execute(
    //   'UPDATE analytics_shop set status=? WHERE shop=?',
    //   [status, shop]
    // );
    // console.log(`status update for shop ${shop}`);
    // return true;

         const query = {shop:shop}
      const ob={
              status:status,
            }

     await AnalyticShop.findOneAndUpdate(query,ob)
     return true
  } catch (error) {
    console.error(`Error updating status for shop ${shop}: ${error}`);
    return false;
    throw error;
  }

};


// Function to get analytic shop from the database
const getAnalyticShop = async (shop) => {
  try {
    // const [results, fields] = await pool.execute('SELECT * FROM analytics_shop WHERE shop = ?', [shop]);
    // return results[0];
    const result = await AnalyticShop.findOne({shop:shop})

    return result
  } catch (error) {
    console.error(`Error get shop for shop ${shop}: ${error}`);
    throw error;
  }
};


export {
  saveShopToken,
  getShopToken,
  saveChargeId,
  getChargeId,
  deleteshop,
  getShopDetails,
  installApp2,
  uninstallApp2,
  updateShopToken,
  saveShopDetails,
  updateShopDetails,
  getAnalyticShop,
  updateShopStatus
};
