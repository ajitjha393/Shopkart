export const credentials = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-myhv8.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`

export const API_KEY = process.env.SENDGRID_API_KEY as string

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string
