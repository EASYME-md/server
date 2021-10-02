const Contents = require('../models/Contents');

exports.getContents = async function (req, res, next) {
  const { linkId } = req.params;

  try {
    const contents = await Contents.findOne({ linkId }).lean();
    const { text } = contents;

    if (contents) {
      return res.json({
        code: 200,
        message: 'OK',
        text,
      })
    }

  } catch (err) {
    next(err);
  }
};

exports.saveContents = async function (req, res, next) {
  const { linkId, text } = req.body;

  try {
    await Contents.create({
      text,
      linkId,
    });

    res.json({
      code: 200,
      message: 'OK',
    });
  } catch (err) {
    next(err);
  }
};
