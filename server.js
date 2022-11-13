// console.log('May Node be with you')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()


const dbuser = 'mongo'
const dbpass = 'mongo'
const dbName = 'star-wars-quotes'
const connectionStr = `mongodb+srv://${dbuser}:${dbpass}@cluster0.4nxrbh9.mongodb.net/?retryWrites=true&w=majority`


MongoClient.connect(connectionStr)
    .then(client =>{
        const db = client.db(dbName)
        const quotesCollection = db.collection('quotes')
        console.log('Connected to Database')
        
        // ========================
        // Middlewares
        // ========================
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())



        // ========================
        // Routes
        // ========================        
        app.get('/', (req,res)=> {
                quotesCollection.find().toArray() 
                .then(results => res.render('index.ejs', { quotes: results}))
                .catch(err => console.error(err))

            console.log('/')
            // res.sendFile(__dirname + '/index.html') //habia que sacarlo porque interfiere con el codigo de arriba  
        })
        
        app.post('/quotes', (req, res)=>{
            quotesCollection.insertOne(req.body)
                .then(result => res.redirect('/'))
                .catch( err => console.error(err))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                {name: 'yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => res.json('Success'))
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            console.log(req)
            quotesCollection.deleteOne(
                {name: req.body.name},
            )
            .then(result =>{
                if(result.deletedCount === 0){
                    return res.json('No quote to delete')
                }
                res.json("Deleted Darth Vader's quote")
            })
            .catch(err => console.error(err))
        })

        app.listen(3000, function(){
            console.log('listening on 3000')
        })
    })
    .catch(console.error) 
