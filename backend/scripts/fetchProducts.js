const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/products?limit=20');
    const data = await res.json();
    console.log(JSON.stringify(data.items.map(p => ({ name: p.name, image: p.image })), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
