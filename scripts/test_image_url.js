async function test() {
  const url = 'https://adminapi.applegadgetsbd.com/storage/media/large/QCY-T13-ANC-2-TWS-Earbudsq-6851.png';
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://localhost:3000/'
      }
    });
    console.log(`Fetch with localhost Referer: Status = ${response.status}`);
    
    const responseNoRef = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(`Fetch with NO Referer: Status = ${responseNoRef.status}`);
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

test();
