import crypto from "crypto";

const hmacFields = ["amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment", "is_voided", "order", "owner", "pending", "source_data.pan", "source_data.sub_type", "source_data.type", "success"];

export function verifyPaymobHmac(params: Record<string, string>) {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret || !params.hmac) return false;
  const value = hmacFields.map((field) => params[field] || field.split(".").reduce((current, key) => (current as Record<string, string> | undefined)?.[key] || "", params)).join("");
  const expected = crypto.createHmac("sha512", secret).update(value).digest("hex");
  if (expected.length !== params.hmac.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(params.hmac));
}