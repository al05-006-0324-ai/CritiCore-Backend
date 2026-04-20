const bcrypt = require('bcrypt');
async function gen() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log(hash);
}
gen();