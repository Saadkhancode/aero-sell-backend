
import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config();
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('mongodb connected.')
    })
    .catch((err) => console.log(err.message))
  
  mongoose.connection.on('connected', () => {
    console.log('prod Mongoose connected to db')
  })
  
  mongoose.connection.on('error', (err) => {
    console.log(err.message)
  })
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
  })
  
  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
  
  
} else if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.DEV_MONGODB_URI, {
    dbName: process.env.DEV_DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('test mongodb connected.')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
});
}

