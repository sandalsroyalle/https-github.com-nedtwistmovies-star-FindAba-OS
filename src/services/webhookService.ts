export enum WebhookEvent {
  NEW_ORDER = 'new_order',
  REFERRAL_SUCCESS = 'referral_success',
  ORDER_STATUS_CHANGE = 'order_status_change',
  THRIFT_CONTRIBUTION = 'thrift_contribution',
  THRIFT_WITHDRAWAL = 'thrift_withdrawal',
  NEW_BOOKING = 'new_booking',
  RIDE_REQUEST = 'ride_request',
  NEW_SIGNAL = 'new_signal',
  SIGNAL_INTEREST = 'signal_interest',
  LOGISTICS_ORDER_CREATED = 'logistics_order_created'
}

export const triggerWebhook = async (event: WebhookEvent, data: any) => {
  console.log(`[Webhook] Triggering ${event}:`, data);
  // Implementation for external automation hooks
};
