const express = require('express')
const app = express()
require('dotenv').config
const path = require('path')
const helmet = require('helmet')
const exphbs = require('express-handlebars')

//Handlebars
// app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//~~  MIDDLEWARES ~~//
// Security
app.use(helmet())
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: false })) // Body parser makes req.body. available

// Static Routes
// app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.json(processer(req.query.input))
  console.log(req.query.input)
  if (req.query.input){
    let resp = JSON.stringify(processer(req.query.input))
    res.render('home', { test: resp })
  } else {
    res.render('home')
  }
})

app.get('/api/convert', (req, res) => {
  res.json(processer(req.query.input))
})

const PORT = process.env.PORT || 5001

app.listen(PORT, console.log(`Server listening on port ${PORT}`))

// Utilities
function processer(query) {
  let regAllLetters = /[a-zA-Z]/g
  let operators = /[\/\*\-\+]/
  let firstNum, secondNum, initNum
  console.log(query)
  if (!
    ['lbs', 'kg', 'km', 'mi', 'gal', 'L'].includes(
      query.match(/[a-zA-Z]+/)[0],
    )
  ) {
    return { error: 'Bad request' }
  } else {
      let unit = query.match(/[a-zA-Z]+$/)[0] //?
      let operator = query.match(/[\/\+\-\*]/)  //?
      if (operator) {
        let array = query.replace(regAllLetters, '').split(operators) //?
        firstNum = Number(array[0]) //?
        secondNum = Number(array[1]) //?
        operator = query.match(/[\/\+\-\*]/)[0]  //?
      } else {
        let array = query.replace(regAllLetters, '').split(operators) //?
        initNum = array[0] || 1 //?
      }
      
      switch (operator) {
        case '+':
          initNum = (firstNum + secondNum).toFixed(5).replace(/0+$/, '')
          break
        case '-':
          initNum = (firstNum - secondNum).toFixed(5).replace(/0+$/, '')
          break
        case '*':
          initNum = (firstNum * secondNum).toFixed(5).replace(/0+$/, '')
          break
        case '/':
          initNum = (firstNum / secondNum).toFixed(5).replace(/0+$/, '')
          break
        default:
          console.log('Bad operator')
      }

      let returnNum = Number(convert(unit, initNum))
      let returnUnit = convertUnit(unit)
      let obj = {
        initNum: Number(initNum),
        initUnit: unit,
        returnNum,
        returnUnit,
        string: `${initNum} ${unit} converts to ${returnNum} ${returnUnit}`,
      }
console.log(obj);
console.log(unit);
      return obj
    
  }
}

function convert(unit, value) {
  switch (unit) {
    case 'kg':
      return (value * 2.20432).toFixed(5).replace(/0+$/, '')
    case 'lbs':
      return (value * 0.45359).toFixed(5).replace(/0+$/, '')
    case 'gal':
      return (value * 1.78541).toFixed(5).replace(/0+$/, '')
    case 'L':
      return (value * 0.26417).toFixed(5).replace(/0+$/, '')
    case 'mi':
      return (value * 1.60934).toFixed(5).replace(/0+$/, '')
    case 'km':
      return (value * 0.62137).toFixed(5).replace(/0+$/, '')
  }
}

function convertUnit(unit) {
  switch (unit) {
    case 'kg':
      return 'lbs'
    case 'lbs':
      return 'kg'
    case 'gal':
      return 'L'
    case 'L':
      return 'gal'
    case 'mi':
      return 'km'
    case 'km':
      return 'mi'
  }
}
