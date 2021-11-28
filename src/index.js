const apiHost = 'http://localhost:3002'

let beer

function renderNav(beers) {
    const nav = document.querySelector('nav')
    nav.innerHTML = ''

    beers.forEach(function(beer) {
        const listItem = document.createElement('li')
        const link = document.createElement('a')
        link.href = `index.html?id=${beer.id}`
        link.innerHTML = beer.name
        listItem.appendChild(link)
        nav.appendChild(listItem)
    })
}

function renderBeer(beer) {
    const title = document.querySelector('.beer-details h2')
    title.innerHTML = beer.name

    const image = document.querySelector('.beer-details img')
    image.src = beer.image_url

    const description = document.querySelector('.beer-details .description textarea')
    description.innerHTML = beer.description

    renderReviews(beer.reviews)

    document.querySelector('main .beer-details').hidden = false
    document.querySelector('main .no-beers').hidden = true
}

function renderReviews(reviews) {
    const reviewContainer = document.querySelector('.reviews')
    reviewContainer.innerHTML = ''
    reviews.forEach(function (review, index) {
        const listItem = document.createElement('li')
        listItem.innerHTML = `${review} &nbsp;`

        const deleteButton = document.createElement('button')
        deleteButton.className = 'deleteReview'
        deleteButton.innerHTML = 'Delete'
        deleteButton.setAttribute('data-id', index)

        deleteButton.addEventListener('click', async function (deleteEvent) {
            await deleteReview(deleteEvent.target.getAttribute('data-id'))
        })

        listItem.appendChild(deleteButton)
        reviewContainer.appendChild(listItem)
    })
}

async function deleteReview(id) {
    beer.reviews.splice(id, 1)
    await updateBeer(beer.id, beer)
}

async function fetchData(url) {
    const response = await fetch(url)
    return await response.json()
}

async function updateBeer(id, data) {
    const response = await fetch(`${apiHost}/beers/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(data)
    })

    beer = await response.json()
    renderBeer(beer)
}

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search)
    const beerId = urlParams.get('id')
    const beerList = await fetchData(`${apiHost}/beers`)
    renderNav(beerList)

    const main = document.querySelector('main')
    const noBeers = document.createElement('h2')
    noBeers.className = 'no-beers'
    noBeers.innerHTML = 'Please select a beer from the menu on the left'
    main.appendChild(noBeers)

    if (beerId) {
        beer = await fetchData(`${apiHost}/beers/${beerId}`)
        renderBeer(beer)
    } else {
        main.querySelector('.beer-details').hidden = true
        main.querySelector('.no-beers').hidden = false
    }
})

document.querySelector('.review-form').addEventListener('submit', async function (reviewForm) {
    reviewForm.preventDefault()
    const reviewField = reviewForm.target.querySelector('textarea')
    beer.reviews.push(reviewField.value)
    reviewField.value = ''
    await updateBeer(beer.id, beer)

})

document.querySelector('.description').addEventListener('submit', async function (beerForm) {
    beerForm.preventDefault()
    beer.description = beerForm.target.querySelector('textarea').value
    await updateBeer(beer.id, beer)
})
