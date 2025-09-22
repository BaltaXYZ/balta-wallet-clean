// api/db-check.js
const { Pool } = require("pg");

module.exports = async (req, res) => {
  const url = process.env.DATABASE_URL;
  if (!url) return res.status(500).json({ ok: false, error: "Missing DATABASE_URL" });

  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

  try {
    const r = await pool.query("select 1 as ok");
    res.status(200).json({ ok: true, result: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e && e.message ? e.message : e) });
  } finally {
    await pool.end().catch(() => {});
  }
};
