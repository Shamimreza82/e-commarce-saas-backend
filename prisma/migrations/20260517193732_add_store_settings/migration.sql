-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "primary_color" TEXT DEFAULT '#000000',
    "font_family" TEXT DEFAULT 'Geist Sans',
    "social_links" JSONB,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "enable_customer_reviews" BOOLEAN NOT NULL DEFAULT true,
    "enable_wishlist" BOOLEAN NOT NULL DEFAULT true,
    "refund_policy" TEXT,
    "privacy_policy" TEXT,
    "terms_of_service" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreSettings_tenant_id_key" ON "StoreSettings"("tenant_id");

-- AddForeignKey
ALTER TABLE "StoreSettings" ADD CONSTRAINT "StoreSettings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
