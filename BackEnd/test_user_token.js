const crypto = require('crypto');
function generateTestToken() {
    const header = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64url');
    const payload = Buffer.from(JSON.stringify({sub: 'test@gmail.com', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 86400})).toString('base64url');
    const secret = 'change_this_to_a_very_long_secret_key_123456789';
    const signature = crypto.createHmac('sha256', secret).update(header + '.' + payload).digest('base64url');
    console.log(header + '.' + payload + '.' + signature);
}
generateTestToken();
