module.exports = {
  consumer_key: "3e758c45b469c8e0b4ec624773680005c1846fd4",
  consumer_secret: "fd6cfb73f1a3f164dcf4ab46281add6fe4f098eb",
  callback: "http://zaim.net",
  token_file: getUserHome() + "/.zaim_token"
};

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}