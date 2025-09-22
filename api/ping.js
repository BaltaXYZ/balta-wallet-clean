// api/ping.js
module.exports = (req, res) => {
  res
    .status(200)
    .setHeader("content-type", "text/plain; charset=utf-8")
    .send("ok");
};

