const express = require("express");
const zod = require("zod");
const authMiddleware = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

const accountBody = zod.object({
  userId: zod.string(),
  balance: zod.number(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, (req, res) => {
  const { success } = accountBody.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      msg: "Incorrect Input",
    });
  }
});

module.exports = router;
