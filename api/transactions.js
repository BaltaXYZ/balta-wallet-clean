// api/transactions.js
// Node Serverless (inte Edge). Kräver dep: "pg" i package.json.
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  module.exports = (_req, res) => res.status(500).json({ error: "Missing DATABASE_URL" });
  return;
}

// Återanvänd pool mellan invokationer
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // Neon kräver SSL
    });
  }
  return pool;
}

function sendJson(res, data, status = 200) {
  res.status(status);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.send(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  const db = getPool();

  try {
    if (req.method === "GET") {
      const r = await db.query(`
        select
          id,
          date,
          person,
          card,
          category,
          amount_cents as "amountCents",
          note,
          created_at as "createdAt",
          updated_at as "updatedAt"
        from transactions
        order by date desc, created_at desc
      `);
      return sendJson(res, r.rows, 200);
    }

    if (req.method === "POST") {
      const { date, person, card, category, amountCents, note } = req.body || {};
      if (!date || !person || !card || !category || typeof amountCents !== "number") {
        return sendJson(res, { error: "Missing required fields" }, 400);
      }
      const r = await db.query(
        `insert into transactions (date, person, card, category, amount_cents, note)
         values ($1,$2,$3,$4,$5,$6)
         returning id`,
        [date, person, card, category, amountCents, note ?? null]
      );
      return sendJson(res, { id: r.rows[0].id }, 201);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const { id, date, person, card, category, amountCents, note } = req.body || {};
      if (!id || !date || !person || !card || !category || typeof amountCents !== "number") {
        return sendJson(res, { error: "Missing required fields" }, 400);
      }
      await db.query(
        `update transactions
           set date=$2, person=$3, card=$4, category=$5,
               amount_cents=$6, note=$7, updated_at=now()
         where id=$1`,
        [id, date, person, card, category, amountCents, note ?? null]
      );
      return sendJson(res, { ok: true }, 200);
    }

    if (req.method === "DELETE") {
      const id = req.query?.id;
      if (!id) return sendJson(res, { error: "Missing id" }, 400);
      await db.query(`delete from transactions where id=$1`, [id]);
      return sendJson(res, { ok: true }, 200);
    }

    res.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE");
    return sendJson(res, { error: "Method not allowed" }, 405);
  } catch (err) {
    console.error(err);
    return sendJson(res, { error: "Internal error" }, 500);
  }
};
