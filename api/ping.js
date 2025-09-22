// api/ping.js
export const config = {}; // Node serverless (inte Edge)
export default function handler(req, res) {
  res.status(200).setHeader("content-type","text/plain; charset=utf-8").send("ok");
}
