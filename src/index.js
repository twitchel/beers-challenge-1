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
    const title = document.querySelector('main h2')
    title.innerHTML = beer.name

    const image = document.querySelector('main img')
    image.src = beer.image_url

    const description = document.querySelector('main .description textarea')
    description.innerHTML = beer.description

    renderReviews(beer.reviews)
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

    if (beerId) {
        beer = await fetchData(`${apiHost}/beers/${beerId}`)
        renderBeer(beer)
    }
})

document.querySelector('.review-form').addEventListener('submit', async function (reviewForm) {
    reviewForm.preventDefault()
    beer.reviews.push(reviewForm.target.querySelector('textarea').value)
    await updateBeer(beer.id, beer)
})

document.querySelector('.description').addEventListener('submit', async function (beerForm) {
    beerForm.preventDefault()
    beer.description = beerForm.target.querySelector('textarea').value
    await updateBeer(beer.id, beer)
})
