const agendarButton = document.querySelector('.agendar')
agendarButton.addEventListener("click", agendar)


function preset() {
  const dateNow = new Date()
  const dateWeek = dateNow.getDay()
  const hour = `${dateNow.getHours()}`.padStart(2, '0')
  const minute = `${dateNow.getMinutes()}`.padStart(2, '0')

  const selectWeek = document.querySelector('.select-week')
  selectWeek.selectedIndex = dateWeek
  
  const time = document.querySelector('input[name=time]')
  time.value = `${hour}:${minute}`
  
  updateSchedules()
}

function updateSchedules() {
  const main_div = document.querySelector('.agendamentos')
  main_div.innerHTML = ''

  chrome.alarms.getAll(function(alarms) {
    if (alarms.length === 0) {
      main_div.innerHTML = 'Cadastre um compromisso :)'
    } else {
      alarms.forEach(alarm => {
        putSchedule(alarm)
      })
    }
  })
}

function putSchedule(alarm) {
  const [name, link] = alarm.name.split('@')
  const date = new Date(alarm.scheduledTime)
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  
  const data = {
    name,
    time: `${hours}:${minutes}`,
    nameWithLink: `${alarm.name}`,
    week: weekName(date.getDay()) 
  }

  createSchedule(data)
}

function TimeToAlarm(weekDay, hour) {
  const now = new Date()
  let weekDayNow = now.getDay()
  let [alarmHour, alarmMinute] = hour.split(':')
  alarmHour = Number(alarmHour)
  alarmMinute = Number(alarmMinute)
  weekDay = Number(weekDay)
  weekDayNow  = Number(weekDayNow)

  if (weekDay > weekDayNow) {
    const sumDay = Math.abs(weekDay - weekDayNow)
    now.setDate(now.getDate() + sumDay)
    now.setHours(alarmHour, alarmMinute, 0, 0)
  } else if (weekDay < weekDayNow) {
    const sumDay =  7 - Math.abs(weekDay - weekDayNow)
    now.setDate(now.getDate() + sumDay)
    now.setHours(alarmHour, alarmMinute, 0, 0)
  } else if (weekDay === weekDayNow) {
    const hourNow = now.getHours()
    const minutesNow = now.getMinutes()
  
    if (alarmHour > hourNow) {
      now.setHours(alarmHour, alarmMinute, 0, 0)
    } else if (alarmHour < hourNow) {
      now.setDate(now.getDate() + 7)
      now.setHours(alarmHour, alarmMinute, 0, 0)
    } else if (alarmHour === hourNow) {
      if (alarmMinute > minutesNow) {
        console.log('minutes > alarmMinutes')
        now.setHours(alarmHour, alarmMinute, 0, 0)
      } else if (alarmMinute < minutesNow) {
        now.setDate(now.getDate() + 7)
        now.setHours(alarmHour, alarmMinute, 0, 0)
      } else if (alarmMinute === minutesNow) {
        now.setDate(now.getDate() + 7)
      }
    }
  }

  return now.valueOf()
}

function agendar() {
  const WEEK_MINUTES = 10080
  const now = Date.now()
  let name = document.querySelector("input[name='name']").value
  let link = document.querySelector("input[name='link']").value
  let time = document.querySelector("input[name='time']").value
  let recurrent = document.querySelector("input[name='recurrent']").checked
  let weekDay = document.querySelector("select[name='week-day']").value
  let nameWithLink = `${name}@${link}`
  let alarmProgram = TimeToAlarm(weekDay, time)

  if (name === '' || link === '' || time === '') {
    alert('Preencha todos os campos para poder agendar')
    return
  }

  // console.log('alarmProgram: ', alarmProgram)
  // console.log('now: ', now)
  // console.log('diff: ', alarmProgram - now)
  let AlarmCreateInfo = {
    when: (Date.now() + (alarmProgram - now)),
    periodInMinutes: recurrent ? WEEK_MINUTES : null
  }
  
  chrome.alarms.get(nameWithLink, function(alarm) {
    if (alarm) {
      console.log(`get a:${JSON.stringify(alarm)}`)
      alert(`O nome ${name} já está sendo utilizado.\n Iforme outro ou apague o agendamento já criado.`)
    } else {
      chrome.alarms.create(nameWithLink, AlarmCreateInfo)
      // const data = {
      //   name,
      //   time,
      //   nameWithLink,
      //   week: weekName(weekDay) 
      // }
      updateSchedules()
    }
  })
}

function weekName(week) {
  const name = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return name[week]
}

function createSchedule(data) {
  console.log('create-schedule')
  const mainDiv = document.querySelector('.agendamentos')
  const div = document.createElement('div')
  div.classList.add("agendamento-elemento");
  
  const newSchedule = document.createElement('span')
  newSchedule.innerHTML = `${data.name} - ${data.week} - ${data.time}`
  
  const button = document.createElement('button')
  button.textContent = 'x'
  button.classList.add('fechar')
  console.log("data.removeSchedule: ", data.name)
  button.addEventListener('click', removeSchedule.bind(event, data.nameWithLink))

  div.append(newSchedule)
  div.append(button)
  mainDiv.append(div)
}

function removeSchedule(nameWithLink) {
  chrome.alarms.clear(nameWithLink)
  updateSchedules()
}


/// OUTRAS  COISAS

// chrome.alarms.onAlarm.addListener(function () {
//   console.log('alarm')
// })

// var CONST_DIV_MANAGER = ".SGP0hd.kunNie"
// var CONST_USER_COUNT = ".uGOf1d"
// var CONST_END_CALL = "[jsname='CQylAd']"

// function endCall() {
//   let button = document.querySelector(CONST_END_CALL)
//   button.click()
// }


// function toggleButton() {
//   const on = document.querySelector('[pk-on]')
//   const is_on = on.getAttribute('pk-on')
//   if (is_on == 'true') {
//       on.setAttribute('pk-on', 'false')
//       on.classList.remove('active')
//       on.classList.add('inative')
//       stopVerify();
//   } else {
//       on.setAttribute('pk-on', 'true')
//       on.classList.remove('inative')
//       on.classList.add('active')
//       startVerify();
//   }
// }


// function createElements() {
//   const div_manager = document.querySelector(CONST_DIV_MANAGER)
//   let div = document.createElement('div')
//   let button = document.createElement('button')
//   let min_people = document.createElement('input')
 
//   div.className = 'margin10'
//   button.innerHTML = 'QuitMeet'
//   button.classList.add('pk')
//   button.classList.add('elem')
//   button.setAttribute('pk-on', 'false')
//   button.classList.add('inative')
//   button.addEventListener('click', toggleButton, false)
 
//   min_people.setAttribute('min', 0)
//   min_people.classList.add('pk')
//   min_people.classList.add('elem')
//   min_people.setAttribute('pk-n-people', null)
//   min_people.setAttribute('type', 'number')
//   min_people.setAttribute('size', '1')
  
//   div.appendChild(button)
//   div.appendChild(min_people)
//   div_manager.appendChild(div)
// }


// function startVerify() {
//   let = n_people = document.querySelector(CONST_USER_COUNT)
//   verify.observe(n_people, {
//       childList: true,
//       attributes: true,
//       characterData: true,
//       subtree: true
//   })
// }

// function stopVerify() {
//   verify.disconnect()
// }


// let body = document.querySelector('body')

// let ready = new MutationObserver(() => {
//   let = n_people = document.querySelector(CONST_USER_COUNT)
//   if (n_people) {
//       createElements()
//       ready.disconnect()
//   }
// })

// ready.observe(body, {
//   childList: true
// })

// let verify = new MutationObserver(function() {
//   let n_people = document.querySelector(CONST_USER_COUNT).innerHTML
//   let min_people = document.querySelector('[pk-n-people]').value
//   if (parseInt(n_people) <= parseInt(min_people)) {
//       endCall()
//   }
// })

preset()