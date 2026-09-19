import "dotenv/config";
export const config={
  name:process.env.BOT_NAME||"NARARYA BUSINESS BOT",
  owners:(process.env.OWNER_NUMBERS||"").split(",").filter(Boolean),
  admin:process.env.ADMIN_NOTIFY_JID||"",
  channel:process.env.CHANNEL_JID||"",
  paymentApi:process.env.PAYMENT_PROVIDER_API_URL||"",
  port:Number(process.env.PORT||3000)
};
export const brands={
  studio:{key:"NS",name:"NARARYA STUDIO",emoji:"🎨"},
  garage:{key:"NG",name:"NARARYA GARAGE",emoji:"🚌"},
  hilekros:{key:"HP",name:"HILEKROS PRODUCTS",emoji:"🛒"}
};