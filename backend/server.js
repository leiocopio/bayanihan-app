// server.js
import express from 'express'
import bodyParser from 'body-parser'
import { supabase } from './supabaseClient.js'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve simple sign-in form


// Handle sign-in
app.post('/signin', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return res.status(400).send(`Error: ${error.message}`)
  }

  // You can store session tokens in cookies
  res.send(`Signed in! Welcome ${data.user.email}`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

