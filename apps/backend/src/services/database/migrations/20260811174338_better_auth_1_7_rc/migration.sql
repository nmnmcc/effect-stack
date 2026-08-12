ALTER TABLE "accounts" ADD COLUMN "issuer" text;--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "accounts"
		WHERE "provider_id" <> 'credential'
	) THEN
		RAISE EXCEPTION 'Better Auth 1.7 issuer migration requires a reviewed backfill for non-credential accounts';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM "accounts"
		WHERE "provider_id" = 'credential'
			AND "account_id" <> "user_id"::text
	) THEN
		RAISE EXCEPTION 'Better Auth 1.7 credential account identity does not match its stable user id';
	END IF;
END $$;--> statement-breakpoint
UPDATE "accounts"
SET "issuer" = 'local:credential'
WHERE "provider_id" = 'credential';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "issuer" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_issuer_accountId_uidx" ON "accounts" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");
