const bcrypt = require("bcryptjs");


async function hashPwd (pass) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}


async function comparePwd (pass, dbPass) {
    const comparePass = await bcrypt.compare(pass, dbPass);
    return comparePass;
}

module.exports ={ hashPwd, comparePwd };
  