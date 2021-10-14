const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Contents Test', function () {
  this.timeout(10000);

  const mongoose = require('mongoose');
  const db = mongoose.connection;
  const Contents = require('../models/Contents');
  const mockContents = require('./contents.json');

  let storedContents;

  const storeMockContents = async () => {
    for (let i = 0; i < mockContents.length; i++) {
      await new Contents(mockContents[i]).save();
    }
  };

  const fetchAllContents = (done) => {
    storeMockContents().then(() => {
      Contents.find()
        .lean()
        .exec((err, contents) => {
          if (err) {
            return done(err);
          }

          storedContents = JSON.parse(JSON.stringify(contents));
          done();
        });
    });
  };

  const deleteAllContents = (done) => {
    Contents.deleteMany({}, (err) => {
      if (err) {
        return done(err);
      }

      storedContents = null;
      done();
    });
  };

  before((done) => {
    (function checkDatabaseConnection() {
      if (db.readyState === 1) {
        return done();
      }

      setTimeout(checkDatabaseConnection, 1000);
    })();
  });

  describe('GET `/d/:linkId`', () => {
    beforeEach(fetchAllContents);
    afterEach(deleteAllContents);

    it('should get selected contents from the database', (done) => {
      const linkId = '123';

      request(app)
        .get(`/d/${linkId}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, text } = res.body;

          expect(message).to.eql('OK');
          expect(text).to.exist;

          done();
        });
    });

    it('should respond with 404 when linkId does not match', (done) => {
      const linkId = '111111';

      request(app)
        .get(`/d/${linkId}`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, text } = res.body;

          expect(message).to.eql('NOT_FOUND');
          expect(text).to.not.exist;

          done();
        });
    });
  });

  describe('POST `/d/:linkId`', () => {
    beforeEach(fetchAllContents);
    afterEach(deleteAllContents);

    it('should add a new contents into the database', (done) => {
      const newContents = {
        text: '### README.md를 더 쉽고 간편하게!',
        linkId: 'JAEWON',
      };

      const linkId = 'JAEWON';

      request(app)
        .post(`/d/${linkId}`)
        .send(newContents)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          expect(res.body).to.exist;
          expect(res.body.message).to.eql('OK');

          const allContents = await Contents.find().lean();
          const addedContents = await Contents.findOne({ linkId });

          expect(allContents.length).to.eql(storedContents.length + 1);
          expect(addedContents).to.exist;

          done();
        });
    });

    it('should modify saved contents into the database', (done) => {
      const originalContents = {
        'text': '# 반갑습니다!   - EASYME.md는 리드미를 미리보면서 작성할 수 있습니다.',
        'linkId': '123',
      };

      const modifiedContents = {
        text: '### EASYME.md를 찾아와주셔서 감사합니다!',
        linkId: '123',
      };

      const linkId = '123';

      request(app)
        .post(`/d/${linkId}`)
        .send(modifiedContents)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          expect(res.body).to.exist;
          expect(res.body.message).to.eql('OK');

          const allContents = await Contents.find().lean();
          const addedContents = await Contents.findOne({ linkId });

          expect(allContents.length).to.eql(storedContents.length);
          expect(addedContents.text).to.not.eql(originalContents.text);
          expect(addedContents.text).to.eql(modifiedContents.text);

          done();
        });
    });
  });
});
