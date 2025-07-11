import { getNatsConnection } from "#/shared/nats/nats-client"
import { PAYMENT_SUCCESS_SUBJECT } from "#/shared/nats/nats-subjects"
import { paymentMetaSchema, paymentTypeValidator } from "@repo/shared/schemas/payment/payment-schema"
import { PaymentMeta } from "../publishers/pub-payment-notify"
import { processDonatePayment } from "#/utils/payment/process-donate-payment"
import { processBelkoinPayment } from "#/utils/payment/process-belkoin-payment"
import { processCharismPayment } from "#/utils/payment/process-charism-payment"
import { logger } from "#/utils/config/logger"

const receiveFiatPayload = paymentMetaSchema.check((ctx) => paymentTypeValidator({ data: ctx.value, ctx: ctx }))

export const subscribeReceiveFiatPayment = () => {
  const nc = getNatsConnection()

  logger.success("Subscribed to receive fiat payment")

  return nc.subscribe(PAYMENT_SUCCESS_SUBJECT, {
    callback: async (e, msg) => {
      if (e) {
        logger.error(e.message);
        return;
      }

      const message = msg.json<PaymentMeta>()

      const { success, data } = receiveFiatPayload.safeParse(message)

      if (!success) return;

      try {
        switch (data.paymentType) {
          case "donate":
            return processDonatePayment(data)
          case "belkoin":
            return processBelkoinPayment(data)
          case "charism":
            return processCharismPayment(data)
        }
      } catch (e) {
        logger.error(e)
      }
    }
  })
}