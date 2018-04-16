const _ = require('lodash')
// import _ from 'lodash'
export default function print(){
    // console.error('I get called from print.js!');
    let str = _.join(['Another', 'module', 'loaded!'], ' ')
    console.log(_.join(['Another', 'module', 'loaded!'], ' '))
    let div =  document.createElement('div')
    div.innerHTML = str
    document.body.appendChild(div)

}

 