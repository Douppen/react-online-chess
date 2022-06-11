import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.headers.authorization === "Bearer secret") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ message: "authorized", name: req.body.name });
    res.end();
  }
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");
  res.json({
    message: "unauthorized",
    name: req.body.name,
    cookie: "set correctly",
  });
  res.end();
};

export default handler;
