async function test() {
  const q = "Weekend in Addis Ababa — coffee, culture, nightlife";
  console.log("Querying with:", q);
  try {
    const res = await fetch('http://localhost:3000/api/ai/recommend', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body preview:", text.substring(0, 300));
    try {
      const data = JSON.parse(text);
      console.log("Parsed keys:", Object.keys(data));
      if (data.days) console.log("Days:", data.days.length);
    } catch(e) {
      console.error("Failed to parse JSON!");
    }
  } catch(e) {
    console.error("Fetch failed", e);
  }
}
test();
