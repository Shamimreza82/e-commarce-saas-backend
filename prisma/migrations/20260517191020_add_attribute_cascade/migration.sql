-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
