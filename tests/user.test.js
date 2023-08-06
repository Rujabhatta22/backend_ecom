const supertest = require('supertest')
const app = require('../app')
const User = require('../models/users')
const Books = require('../models/products')
const mongoose = require('mongoose')
const api = supertest(app)

const user = {
    email: 'v@gmail.com',
    password: 'abc123456',
    cPassword: 'abc123456',
    name:'vinita'
}

const change_user = {
    "uId": "64060680ed277c8eec8c9dc6",
    "oldPassword": "xxxabc123",
    "newPassword" : "abc123456789"
}

const edit_user = {
    "uId": "64060680ed277c8eec8c9dc6",
    "name": "Vinitini",
    "phoneNumber" : "9899999999"
}


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDA1ZmJkYTlmNjE3ZTNmZGNkYjE4MWYiLCJyb2xlIjowLCJpYXQiOjE2NzgxMTM4Njd9.8Ib9Yogu8VE2IaKGiUvPO-6vGCxddNvVxZ7h0JUaqEA'
const book = {
    pName: 'war ',
    pPrice: 200
}

//setup
beforeAll(async () => {
await User.deleteMany({})
})

//setup
beforeAll(async () => {
    await Books.deleteMany({})
await api.post('/api/signin')
.send(user)
.expect(res => {
    token = res.body.token
})
})


test('register test user', async() =>{
    await api.post('/api/signup')
    .send(user)
    .expect(200)

})

//teardown
afterAll(async() => {
    await mongoose.connection.close()
})

test('login test user', async() =>{
    await api.post('/api/signin')
    .send(user)
    .expect(200)
    .expect(res => {
        console.log(res.body)
        // expect(res.body.status).toContain('ok')
        expect(res.body.token).toBeDefined()
    })

})

test('create a book', async() => {
    await api.post('/api/product/add-product')
   .set('Authorization', `bearer ${token}`)
   .send(book)
   .expect(201)
   .expect(res =>{
       console.log(res.body)
       expect(res.body.pName).toBe(book.pName)
   })
})

test('get all books', async() =>{
    await api.get('/api/product/all-product')
    .set('Authorization', `bearer ${token}`)
    .expect(200)
    .expect(res =>{
        console.log(res.body)
        expect(res.body[0].pName).toBe(book.pName)
    })
})

test('change pw', async() =>{
    await api.post('/api/user/change-password')
    .send(change_user)
    .expect(200)
    // .expect(res =>{
    //     console.log(res.body)
    //     expect(res.body.status).toContain('ok')
    // })
})

test('edit user', async() =>{
    await api.post('/api/user/edit-user')
    .send(edit_user)
    .expect(200)
    // .expect(res =>{
    //     console.log(res.body)
    //     expect(res.body.status).toContain('ok')
    // })
})

test('get single user', async() =>{
    await api.post('/api/user/signle-user')
    .send("64060680ed277c8eec8c9dc6")
    .expect(200)
    // .expect(res =>{
    //     console.log(res.body)
    //     expect(res.body.status).toContain('ok')
    // })
})

test('get single user', async() =>{
    await api.get('/api/user/all-user')
    .expect(200)
    // .expect(res =>{
    //     console.log(res.body)
    //     expect(res.body.status).toContain('ok')
    // })
})


