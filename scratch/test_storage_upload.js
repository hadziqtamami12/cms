import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'cms';

  console.log('Testing upload to Supabase Storage bucket:', bucket);
  const testFilename = `test-${Date.now()}.txt`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${testFilename}`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'text/plain',
      'x-upsert': 'true'
    },
    body: 'Hello Supabase Storage!'
  });

  console.log('Upload status:', res.status);
  const text = await res.text();
  console.log('Upload response:', text);

  if (res.ok) {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${testFilename}`;
    console.log('Public URL:', publicUrl);

    // Verify public read
    const readRes = await fetch(publicUrl);
    console.log('Public read status:', readRes.status, 'Content:', await readRes.text());

    // Clean up test file
    const delUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${testFilename}`;
    const delRes = await fetch(delUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey
      }
    });
    console.log('Delete status:', delRes.status);
  }
}

main();
