-- Lets the app upload student photos for review. Not used by the app yet
-- (UPLOADS_ENABLED is off in src/services/photos.ts) until faces are blurred
-- before upload. Photos land in a private bucket under pending/ and only
-- become visible after the team approves them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('spot-photos', 'spot-photos', false, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "Anyone can upload a pending photo" on storage.objects
  for insert to anon
  with check (bucket_id = 'spot-photos' and (storage.foldername(name))[1] = 'pending');

create policy "Anyone can submit a pending photo" on public.spot_photos
  for insert with check (status = 'pending');
