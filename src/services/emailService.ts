export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions | string, _subject?: string, _body?: string) => {
  if (typeof options === 'object') {
    console.log(`[Email] To: ${options.to}, Subject: ${options.subject}`);
  } else {
    console.log(`[Email] To: ${options}, Subject: ${_subject}`);
  }
};

export const sendWelcomeEmail = async (email: string, name: string, referralLink: string) => {
  console.log(`[Email] Welcoming ${name} at ${email}. Referral: ${referralLink}`);
};

export const sendOrderReceivedEmail = async (email: string, orderId: string, amount: number) => {
  console.log(`[Email] Order ${orderId} received. Amount: ${amount}`);
};

export const sendMerchantNewOrderEmail = async (email: string, orderId: string, amount: number, customerName: string) => {
  console.log(`[Email] Merchant at ${email} notified of order ${orderId} by ${customerName}`);
};

export const sendAppointmentEmail = async (email: string, businessName: string, date: string) => {
  console.log(`[Email] Appointment confirmed with ${businessName} on ${date}`);
};

export const sendOrderStatusUpdateEmail = async (email: string, status: string, amount: number, trackingId: string) => {
  console.log(`[Email] Order update to ${email}: Status ${status}, Amount ${amount}, Tracking ${trackingId}`);
};
