
CREATE POLICY "media read auth" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'tallah-media');
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tallah-media' AND public.is_admin(auth.uid()));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'tallah-media' AND public.is_admin(auth.uid()));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'tallah-media' AND public.is_admin(auth.uid()));
