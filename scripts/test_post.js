//for local testing

const data = { fullName: 'Test User', email: 'you@example.com' };

fetch('http://localhost:3000/api/intake', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
  .then(async (res) => {
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  })
  .catch((err) => {
    console.error('FETCH ERROR', err);
  });
