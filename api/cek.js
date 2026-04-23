export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const rawNumber = req.query.number || '';

  if (!rawNumber) {
    return res.status(400).json({
      success: false,
      message: 'Nomor kosong'
    });
  }

  let number = String(rawNumber).replace(/\D/g, '');

  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  }

  if (!/^62\d{8,15}$/.test(number)) {
    return res.status(400).json({
      success: false,
      message: 'Format nomor tidak valid'
    });
  }

  const url = `https://xl-ku.my.id/end.php?check=package&number=${encodeURIComponent(number)}&version=2`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://xl-ku.my.id/',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message: 'Response bukan JSON valid',
        raw: text
      });
    }

    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Fetch gagal: ' + error.message
    });
  }
}
