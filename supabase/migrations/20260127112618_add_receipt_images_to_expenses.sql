/*
  # Add Receipt Images to Expenses

  1. Changes
    - Add `receipt_image_url` column to `expenses` table
      - Stores the URL of the uploaded receipt image from Supabase Storage
      - Optional field (nullable) as not all expenses need receipts
    
  2. Storage
    - Creates a storage bucket named 'receipts' for storing receipt images
    - Enables RLS on the bucket
    - Allows authenticated users to upload their own receipts
    - Allows authenticated users to view their own receipts
    
  3. Security
    - Storage policies ensure users can only access their own receipt images
    - Images are stored with user_id prefix for organization
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'receipt_image_url'
  ) THEN
    ALTER TABLE expenses ADD COLUMN receipt_image_url text;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'receipts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'receipts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'receipts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
