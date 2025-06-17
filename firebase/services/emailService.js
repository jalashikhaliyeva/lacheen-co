
import emailjs from "@emailjs/browser";
import { fetchSizeById } from "./sizeService";

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const TEMPLATE_ID_STATUS = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_STATUS;

export const sendOrderEmail = async (orderData) => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("EmailJS configuration missing:", {
        hasServiceId: !!SERVICE_ID,
        hasTemplateId: !!TEMPLATE_ID,
        hasPublicKey: !!PUBLIC_KEY,
      });
      throw new Error("EmailJS configuration is incomplete");
    }

    const sizeNames = await Promise.all(
      orderData.deliveryDetails.selectedSizes.map(async (sizeId) => {
        const size = await fetchSizeById(sizeId);
        return size ? size.value : sizeId;
      })
    );

    const {
      userInfo,
      items,
      deliveryDetails,
      payment,
      total,
      subtotal,
      deliveryFee,
      createdAt,
    } = orderData;

    const itemsList = items
      .map(
        (item) => `
${item.name}
- Quantity: ${item.quantity}
- Price: ${item.price} ₼
- Size: ${item.size}
- Color: ${item.color}
- Barcode: ${item.id}
`
      )
      .join("\n");

    const barcodesList = items.map((item) => item.id).join(", ");

    const templateParams = {
      from_name: userInfo.name,
      to_email: "admin.lacheen@gmail.com",
      subject: "New Order Received - Lacheen",
      order_date: new Date(createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer_name: userInfo.name || "N/A",
      selectedSizes: sizeNames.join(", "),
      address: userInfo.address,
      city: userInfo.city,
      postalCode: userInfo.postalCode,
      timeRange: deliveryDetails.timeRange,
      description: deliveryDetails.description,
      customer_email: userInfo.email || "N/A",
      postalCode: userInfo.postalCode,
      customer_phone: userInfo.phone || "N/A",
      delivery_address: userInfo.address || "N/A",
      delivery_city: userInfo.city || "N/A",
      delivery_postal: userInfo.postalCode || "N/A",
      delivery_time: deliveryDetails.timeRange || "N/A",
      delivery_description:
        deliveryDetails.description || "No special instructions",
      selected_sizes:
        deliveryDetails.selectedSizes?.join(", ") || "No sizes selected",
      items_barcodes: barcodesList,
      payment_method:
        payment.method === "card" ? "Card Payment" : "Cash Payment",
      payment_amount: `${payment.amount} ₼`,
      subtotal: `${subtotal} ₼`,
      delivery_fee: deliveryFee === 0 ? "Free" : `${deliveryFee} ₼`,
      total: `${total} ₼`,
      items_count: items.length,
      itemsList,
      items,
    };

    console.log("Sending email with template params:", templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export async function sendStatusUpdateEmail(orderData) {
  if (!SERVICE_ID || !TEMPLATE_ID_STATUS || !PUBLIC_KEY) {
    console.error("EmailJS config incomplete for status updates");
    return;
  }

  const { id, userInfo, items, status } = orderData;
  const itemsList = items.map((i) => i.name).join(", ");
  const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/orders/${id}`;
  const customerCare = process.env.NEXT_PUBLIC_CUSTOMER_CARE_PHONE || "N/A";

  const templateParams = {
    to_email: userInfo.email,
    customer_name: userInfo.name,
    order_id: id,
    update_status: status,
    order_url: orderUrl,
    items_list: itemsList,
    customer_care_phone: customerCare,
  };

  try {
    const resp = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_STATUS,
      templateParams,
      PUBLIC_KEY
    );
    console.log("Status update email sent:", resp);
  } catch (err) {
    console.error("Failed to send status update email:", err);
  }
}
