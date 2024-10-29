const express = require("express");
const authMiddleware = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  const { to, amount } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    res.status(400).json({
      msg: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    res.status(400).json({
      msg: "Invalid Account",
    });
  }

  await Account.findOneAndUpdate(account, {
    $inc: { balance: -amount },
  }).session(session);
  await Account.findOneAndUpdate(toAccount, {
    $inc: { balance: amount },
  }).session(session);

  await session.commitTransaction();

  res.json({
    msg: "Transfer Successfull",
  });
});

module.exports = router;
