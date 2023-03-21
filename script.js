const container = document.querySelector('.container');
const box = document.querySelector('.box');
const sort= document.querySelector('.sort');
const listOne = document.getElementsByClassName('sort')
const listTwo = document.getElementsByClassName('filter-by')

let url = 'https://mocki.io/v1/11356aa2-6371-41d4-9d49-77a5e9e9924f';

function getTours(option = 'popasc', sortType) {
  fetch(url)
  .then(res => res.json())
  .then(out => {
    if (sortType==='filter') {
      const filterArr = out.filter(el => {
      if(el.dates.length > 0){
        const startDate = el.dates.map(d => d.start);
        return getDate(startDate[0]).split(' ').slice(1,2)[0] === option.toUpperCase() || getDate(startDate[1]).split(' ').slice(1,2)[0] === option.toUpperCase()
  }}
  )
    if(filterArr.length === 0 && option!=='depasc') {
      alert("No tours available for this month. Please choose another one!")
      document.querySelector('.filter-by').value = 'depasc'
    } else if(option==='depasc'){
      console.log('Original array');
    } else out = filterArr;
    }
    else {
      switch(option) {
        case 'durasc':
          out.sort((a,b) => a.length - b.length)
        break;
        case 'durdesc':
          out.sort((a,b) => b.length - a.length)
        break;
        case 'prasc':
          out.sort((a,b) => getLowestPrice(a) - getLowestPrice(b))
        break;
        case 'prdesc':
          out.sort((a,b) => getLowestPrice(b) - getLowestPrice(a))
        break;
        default:
          out;
      }
    }
    console.log(out);
    out.forEach((el,i) => {
        const reviews = el.reviews > 1 ? `${el.reviews} reviews` : el.reviews === 1 ? `${el.reviews} review` : 'No reviews';
        const cities = el.cities.map(c => c.name);
        const lastCity = cities.slice(-1)
        const dates = el.dates.map(d => d.start);
        const fromPrice = getLowestPrice(el);
        const discount = el.dates.map(d => d.discount)
        let availableSpaces = el.dates.map(d => d.availability)
        let image = el.images.filter(img => img.is_primary===true);
        if (checkAvailableUrl(image)) {
          image = image[0].url;
         } else if(checkAvailableUrl(el.images)){
          image = el.images[0].url;
         } else {
          image = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
         }
        const operatorName = el.operator_name;
        const html = `
        <div class="item item-1">
            <div class="image-sect">
            <svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
              <img class="image" src=${image} />
            </div>
            <div class="tour-info">
                <h4 class="tour-name-desktop">${el.name}</h4>
                <div class="star-rate-main">
                  ${getStarRating(el.rating)}
                  <div class="star-rate-number">${reviews}</div>
                </div>
                <blockquote class="quote">
                  "My husband and I went on this trip and we must admit, this is one of the best vacations..."
                </blockquote>
                <hr class="line">
                <div class="trip-info-main">
                <dl class="trip-info">
                    <dt>DESTINATIONS</dt>
                    <dd>${cities[0]}, ${cities[1]}
                    <span class="show-more">+${cities.length-2} more</span>
                    </dd>
                    <dt>STARTS / ENDS IN</dt>
                    <dd>${cities[i]} / ${lastCity}</dd>
                    <dt>OPERATOR</dt>
                    <dd>${operatorName}</dd>
                </dl>
                </div>
            </div>
            <div class="tour-info2">
              <div class="duration-from">
                <div class="duration">
                  <div class="duration-text">Duration</div>
                  <div class="duration-days"><strong>${out[i].length} days</strong></div>
                </div>
                <div class="from">
                  <div class="from-text">From</div>
                  <div class="price">€${fromPrice}</div>
                </div>
              </div>
            <hr class="line">
            <div class="date">
              <div class="from-date1">
                <div class="from-date">${getDate(dates[0])}</div>
                <div class="spaces-left">${checkAvailableSpaces(availableSpaces,0)} ${availableSpaces[0] === 1 ? 'space' : 'spaces'} left</div>
              </div>
              <div class="from-date2">
                  <div class="from-date">${getDate(dates[1])}</div>
                  <div class="spaces-left">${checkAvailableSpaces(availableSpaces,1)} ${availableSpaces[1] === 1 ? 'space' : 'spaces'} left</div>
              </div>
            </div>
              <div class="checkout">
                <button class="my-button">View tour</button>
              </div>
              <div class="disc">
                <div class="disc-price">-${checkDiscount(discount)}</div>
              </div>
            </div>
        </div>
        </div>
        `;
        box.insertAdjacentHTML('beforeend', html);

        const items = document.querySelectorAll('.spaces-left');
        for (let t = 0; t < items.length; t++) {
          if(parseInt(items[t].innerHTML) <=3 || isNaN(parseInt(items[t].innerHTML))){
            items[t].style.color = 'red';
          }
        }

        const discounts = document.querySelectorAll('.disc');
        for (let d = 0; d < discounts.length; d++) {
          if(discounts[d].innerText === '-undefined'){
            discounts[d].style.display = 'none'
          }
        }
    });
    });
  }
  
  const checkNumber = function(num) {
    // check if the passed value is a number
    if(typeof num == 'number' && !isNaN(num)){
        // check if it is integer
        if (Number.isInteger(num)) {
            return 'integer';
        }
        else {
            return 'float';
        }
    } else {
        return false;
    }
}

  const getStarRating = function(rating){
    let string = '';
    let i = 1;
    const totalStars = 5;
    const numType = checkNumber(rating);
    if(numType==='integer'){
      while (i<=rating) {
        string += '<span class="fa fa-star checked"></span>\n';
        i++;
      }
    } else if(numType==='float'){
      while (i<=Math.floor(rating)) {
        string += '<span class="fa fa-star checked"></span>\n';
        i++;
      }
      string += '<span class="fa fa-star-half-o half"></span>\n';
      if(i===totalStars) return string;    
    }
    if(rating < totalStars){
      let j = 1;
      while(j<=totalStars-rating){
        string += '<span class="fa fa-star-o"></span>\n';
      j++;
      }
    }
    return string;
  }

  const checkAvailableSpaces = function(a,index) {
    if(a.length !== 0){
      if(a[index]!== undefined && a[index]!== 0){
        if(a[index] > 10)
          return '10+'
        else return a[index];
      } else return'No';
    } else{
      return 'No'
    }
  }

  const checkAvailableUrl = function(imageArray) {
    return imageArray.length>0 && imageArray[0].hasOwnProperty('url') && imageArray[0].url!==''
  }
  
  const getLowestPrice = function(datesArr) {
    return datesArr.dates.length!==0 ? Math.min(...datesArr.dates.map(item => item.eur)) : 999;
  }

  const checkDiscount = function(discsArr){
    let i = 0;
    while(i <= 1){
      if(discsArr[i]!==undefined){
        var disc = discsArr[i];
      }
      i++;
    }
    console.log(disc);
    return disc;
  }

  const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  const getDate = function (date) {
    if (date!==undefined) {
      const d = new Date(date)
      const day = d.getDate();
      const name = month[d.getMonth()]
      const year = d.getFullYear()
      let fullDate = `${day} ${name} ${year}`;
      return fullDate;
    } else {
      return 'SOLD OUT!'
    }
  }

  // Filtering only by the first two dates
  const filterByMonth = function(arr,option) {
    const filterArr = arr.filter(el => {
        if(el.dates.length > 0){
          const startDate = el.dates.map(d => d.start);
          return getDate(startDate[0]).split(' ').slice(1,2)[0] === option.toUpperCase()
              || getDate(startDate[1]).split(' ').slice(1,2)[0] === option.toUpperCase()
  }})}

  for (let i = 0; i < listOne.length; i++) {
      const option = listOne[i];
      option.addEventListener('change', () => {
        getTours(option.value, 'sort');
        document.querySelector('.box').innerHTML = ' ';
        return option.value;
      })
    }

  for (let i = 0; i < listTwo.length; i++) {
      const monthOpt = listTwo[i];
      monthOpt.addEventListener('change', () => {
        getTours(monthOpt.value, 'filter');
        document.querySelector('.box').innerHTML = ' ';
        return monthOpt.value;
      })
    }

getTours();