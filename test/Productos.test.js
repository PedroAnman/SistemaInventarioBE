const chai = require('chai');
const chaiGraphQL = require('chai-graphql');
chai.use(chaiGraphQL);

const { assert } = chai
const url = `http://localhost:2087/`;
const request = require('supertest')(url);
const expect = chai.expect;

// https://www.katk.dev/testing-graphql

describe('GraphQL', () => {    
    it('Returns product with codigoBarras = 100', (done) => {        
        request.post('graphql')        
        .send({ query: 'query{  product( codigoBarras: \"100\"){    status    message    product{      codigoBarras      descripcion      categoria      cantidad      precio    }  }}'})        
        .expect(200)        
        .end((err,res) => {   // res will contain array with one product             
            if (err) return done(err);          

            // assert.graphQL(res.body);
            expect(res.body).to.be.a('Object')
            expect(res.body.data.product.product).to.have.property('codigoBarras')
            expect(res.body.data.product.product).to.have.property('descripcion')
            expect(res.body.data.product.product).to.have.property('categoria')
            expect(res.body.data.product.product).to.have.property('cantidad')
            expect(res.body.data.product.product).to.have.property('precio')        
            done();          
        })     
    });

    it('Returns all products', (done) => {         
        request.post('graphql')         
        .send({ query: '{ products {  status    message    products{      codigoBarras      descripcion      categoria      cantidad      precio    } } }' })         
        .expect(200)         
        .end((err, res) => {             // res will contain array of all products             
            if (err) return done(err);             // assume there are a 4 products in the database             

            expect(res.body.data.products.products).to.have.lengthOf(5);  
            expect(res.body.data.products.products[0]).to.have.property('codigoBarras')
            expect(res.body.data.products.products[0]).to.have.property('descripcion')
            expect(res.body.data.products.products[0]).to.have.property('categoria')
            expect(res.body.data.products.products[0]).to.have.property('cantidad')
            expect(res.body.data.products.products[0]).to.have.property('precio')  
            done();        
        });      
    });

    it('Returns search products', (done) => {         
        request.post('graphql')         
        .send({ query: '{ searchproducts ( text: "pantalon"){  status    message    products{      codigoBarras      descripcion      categoria      cantidad      precio    } } }' })         
        .expect(200)
        .end((err, res) => {           
            if (err) return done(err);                       

            expect(res.body.data.searchproducts.products[0]).to.have.property('codigoBarras')
            expect(res.body.data.searchproducts.products[0]).to.have.property('descripcion')
            expect(res.body.data.searchproducts.products[0]).to.have.property('categoria')
            expect(res.body.data.searchproducts.products[0]).to.have.property('cantidad')
            expect(res.body.data.searchproducts.products[0]).to.have.property('precio')  
            done();        
        });      
    });

    it('Returns insert product', (done) => {         
        request.post('graphql')         
        .send({ query: 'mutation{  addProducto(product:{    codigoBarras: "500",    descripcion: "Camisa roja",    categoria: "Camisa",    cantidad: "34",    precio: "450"  }){    status    message  }}' })         
        .expect(200)
        .end((err, res) => {           
            if (err) return done(err);                       

            assert.graphQL(res.body) 
            done();        
        });      
    });
});
