const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const path = require('path');

chai.use(chaiHttp);
chai.should();
chai.expect();

describe('All Tests', () => {

    describe('Get /', () => {

        it('Should return json', (done) => {

            chai
                .request(app)
                .get('/')
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });

    describe('Post /', () => {

        it('Should return payload missing', (done) => {

            chai
                .request(app)
                .post('/')
                .set('content-type', 'application/json')
                .send({})
                .end((err, res) => {

                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type', 'validation');
                    done();
                });
        });

        it('Should return file paths do not exist', (done) => {

            chai
                .request(app)
                .post('/')
                .set('content-type', 'application/json')
                .send({ initial_path: '/wrong-path', compare_path: '/wrong-path' })
                .end((err, res) => {

                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type', 'validation');
                    done();
                });
        });

        it('Should return contents do not match', (done) => {

            let initial_path = path.join(__dirname, './mocks/initial-file.txt');
            let compare_path = path.join(__dirname, './mocks/wrong-file.txt');

            chai
                .request(app)
                .post('/')
                .set('content-type', 'application/json')
                .send({ initial_path: initial_path, compare_path: compare_path })
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type', 'invalid-files');
                    done();
                });
        });

        it('Should return contents match', (done) => {

            let initial_path = path.join(__dirname, './mocks/initial-file.txt');
            let compare_path = path.join(__dirname, './mocks/compare-file.txt');

            chai
                .request(app)
                .post('/')
                .set('content-type', 'application/json')
                .send({ initial_path: initial_path, compare_path: compare_path })
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type', 'valid-files');
                    done();
                });
        });
    })
});