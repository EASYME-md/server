const createError = require('http-errors');

const Contents = require('../models/Contents');

exports.getContents = async function (req, res, next) {
  const { linkId } = req.params;

  try {
    const contents = await Contents.findOne({ linkId }).lean();

    if (!contents) {
      throw createError(404, 'NOT_FOUND');
    }

    const { text } = contents;

    res.json({ code: 200, message: 'OK', text });
  } catch (err) {
    next(err);
  }
};

exports.saveContents = async function (req, res, next) {
  const { linkId, text } = req.body;

  try {
    const contents = await Contents.findOne({ linkId }).lean();

    if (!contents) {
      await Contents.create({ text, linkId });
    }

    if (contents) {
      await Contents.findOneAndUpdate({ linkId }, { text });
    }

    res.json({ code: 200, message: 'OK' });
  } catch (err) {
    next(err);
  }
};
