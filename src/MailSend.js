import logger from "./logger.js";
import nodemailer from 'nodemailer';
import express from "express";


let transporter_app_admin = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "ersharadpatel@gmail.com", // replace with your sender email
        pass: "ijwddnneqqalfuiy" // replace with your sender password
    },
    tls: {
        rejectUnauthorized: false,
    }
});



export const InstallShopMailSend = (customer_email, store_name, storeOwner) => {

    console.log("customer_email", customer_email, store_name, storeOwner)

    const mailinstall_customer = `<div style="width: 50%">
                                <p> Hello ${storeOwner}, </p>
                                <p> Congratulations on choosing ${process.env.APP_NAME} app for your Shopify store! Your installation process has been successfully completed. </p>
                                <p> We recommend you check out the Getting Started page from within our app for simple step-by-step instructions on how to use our app. We're confident that our app will add value to your store and streamline your operations. </p>
                                <p> <b> Customer Support:</b> Our dedicated support team is ready to help you with any questions, concerns, or troubleshooting you may need. Feel free to reach out to us at contact@expoundcoderz.com. </p>
                                <p> Your feedback is invaluable to us. Please share any thoughts, suggestions, or feedback you may have. We're constantly striving to improve and tailor our app to meet your specific needs. </p>
                                <p> Thank you for choosing ${process.env.APP_NAME} app. We are honoured to have you on board, and we look forward to being an integral part of your business success. </p>
                                <p> Best regards, </p>
                                <p> ESTS Team </p>
                            </div>`


    const mailinstall_admin = `<div style="width: 50%">
                            <p> Hello Admin, </p>
                            <p> Exciting news! We wanted to inform you that A new customer has installed ${process.env.APP_NAME} app on their Shopify store. This app brings benefits to your store and can greatly enhance your operations. </p>
                            <p> Here are the details: </p>
                            <p> <b> Store Name:</b> ${store_name} </p>
                            <p> <b> Customer Email:</b> ${customer_email} </p>
                            <p> Please ensure a smooth onboarding experience and be ready to assist. Your attention to this matter is appreciated. </p>
                            <p> Best regards, </p>
                            <p> ESTS Team </p>
                        </div>`

    let mailOptionsforcustomer = {
        from: "ersharadpatel@gmail.com", // sender address
        to: customer_email, // list of receivers
        subject: `Welcome to ${process.env.APP_NAME} app!`, // Subject line
        html: mailinstall_customer // plain html body
    };


    let mailOptionsforsender = {
        from: "ersharadpatel@gmail.com", // sender address
        to: "coderz.expert@gmail.com", // list of receivers
        subject: `New Installation of ${process.env.APP_NAME} on Your Shopify Store!`, // Subject line
        html: mailinstall_admin // plain html body
    };


    transporter_app_admin.sendMail(mailOptionsforcustomer, (error, info) => {
        if (error) {
            logger.info("Install email sent to customer error");
            logger.info(error);
        } else {
            logger.info("Install email successfully sent to customer");
            logger.info('Install Email sent to customer: ' + info.response);
        }
    });


    transporter_app_admin.sendMail(mailOptionsforsender, (error, info) => {
        if (error) {
            logger.info("Install email sent to sender error");
            logger.info(error);
        } else {
            logger.info("Install email successfully sent to app admin");
            logger.info('Install Email sent to app admin: ' + info.response);
        }
    });

}


export const UninstallShopMailSend = (customer_email, store_name, storeOwner) => {

    console.log("customer_email", customer_email, store_name, storeOwner)

    const mailuninstall_customer = `<div style="width: 50%">
                                    <p> Hello ${storeOwner}, </p>
                                    <p> We noticed that ${process.env.APP_NAME} app has been uninstalled from your Shopify store. We're sorry to see you leave and want to understand how we can improve. </p>
                                    <p> If there are any specific reasons or feedback you'd like to share regarding your decision, we would greatly appreciate hearing from you. Your insights are valuable as we continually strive to improve our app and provide the best possible experience for our users. </p>
                                    <p> Thank you for being a part of ${process.env.APP_NAME} app. If you ever reconsider or have further questions, please feel free to reach out to us at contact@expoundcoderz.com. </p>
                                    <p> We wish you all the best with your Shopify store endeavours. </p>
                                    <p> Best regards, </p>
                                    <p> ESTS Team </p>
                                </div>`


    const mailuninstall_admin = `<div style="width: 50%">
                                <p> Hello Admin, </p>
                                <p> Action required! We wanted to inform you that a customer has uninstalled the ${process.env.APP_NAME} app from their Shopify store. </p>
                                <p> Here are the details: </p>
                                <p> <b> Store Name:</b> ${store_name} </p>
                                <p> <b> Customer Email:</b> ${customer_email} </p>
                                <p> If there's any specific reason for the uninstallation or any features that were lacking, please review and address any concerns promptly. </p>
                                <p> Best regards, </p>
                                <p> ESTS Team </p>
                            </div>`

    let mailOptionsforcustomer = {
        from: "ersharadpatel@gmail.com", // sender address
        to: customer_email, // list of receivers
        subject: `${process.env.APP_NAME} App Uninstall`, // Subject line
        html: mailuninstall_customer // plain html body
    };


    let mailOptionsforsender = {
        from: "ersharadpatel@gmail.com", // sender address
        to: "coderz.expert@gmail.com", // list of receivers
        subject: `${process.env.APP_NAME} App Uninstallation Notification`, // Subject line
        html: mailuninstall_admin // plain html body
    };


    transporter_app_admin.sendMail(mailOptionsforcustomer, (error, info) => {
        if (error) {
            logger.info("Uninstall email sent to customer error");
            logger.info(error);
        } else {
            logger.info("Uninstall email successfully sent to customer");
            logger.info('Uninstall Email sent to customer: ' + info.response);
        }
    });


    transporter_app_admin.sendMail(mailOptionsforsender, (error, info) => {
        if (error) {
            logger.info("Uninstall email sent to sender error");
            logger.info(error);
        } else {
            logger.info("Uninstall email successfully sent to app admin");
            logger.info('Uninstall Email sent to app admin: ' + info.response);
        }
    });

}