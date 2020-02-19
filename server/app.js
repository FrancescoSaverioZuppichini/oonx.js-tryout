const express = require("express")
const path = require("path")
const logger = require("morgan")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const PORT = 8081
const app = express()
app.use(cors())

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res, next) => {
  res.send('Hi')
})
app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}`
  )
)
