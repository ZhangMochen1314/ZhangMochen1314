import logging

from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix="/billing", tags=["billing"])

logger = logging.getLogger(__name__)

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Stripe webhook endpoint for handling payment events.
    """
    try:
        _payload = await request.body()
        _sig_header = request.headers.get("stripe-signature")

        # In a real application, you would verify the signature using stripe.Webhook.construct_event
        # event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        logger.info("Stripe signature validation bypassed for manual testing")
        
        # For now, we just parse the JSON
        event = await request.json()
        
        event_type = event.get("type")
        logger.info(f"Received Stripe webhook event: {event_type}")

        if event_type == "payment_intent.succeeded":
            payment_intent = event.get("data", {}).get("object", {})
            # Handle successful payment
            logger.info(f"PaymentIntent was successful: {payment_intent.get('id')}")
        elif event_type == "payment_intent.payment_failed":
            payment_intent = event.get("data", {}).get("object", {})
            # Handle failed payment
            logger.info(f"PaymentIntent failed: {payment_intent.get('id')}")
        else:
            logger.info(f"Unhandled event type: {event_type}")

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error handling Stripe webhook: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
