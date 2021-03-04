const req = "https://theaudiodb.com/api/v1/json/1/"
let input = document.querySelector('.go')
let button = document.querySelector('.buttonMusic')
let allInfo = document.querySelector('.allInfo')
let home = document.querySelector('.home')
let searchBar = document.querySelector('.searchMusic')
let artistName = document.querySelector('.artistName')
let searchAlbums = document.querySelector('.searchAlbums')
let nav = document.querySelector('.nav')
let albumsList = document.querySelector('.albumsList')
let goOnArtist = document.querySelector('.goOnArtist')
let albumContainer = document.querySelector('.albumContainer')
let albumAndSongs = document.querySelector('.albumAndSongs')
let tracks = document.querySelector('.tracks')
let videos=document.querySelector('.videos')

const createEl = (type, className) => {
  let element = document.createElement(type)
  element.className = className
  return element
}

button.addEventListener('click', function () {
  if (input.value === '') {
    input.value = 'enter name of the artist'
  } else {
    getArtist()
  }
})

input.addEventListener('keypress', function (el) {
  if (el.keyCode === 13) {
    getArtist()
  }
})

const getArtist = () => {

  searchBar.style.visibility = 'hidden'
  nav.style.visibility = 'visible'
  const findArtist = req + 'search.php?s=' + input.value.toLowerCase()
  fetch(findArtist)
    .then(response => response.json())
    .then(data => {
      
      let infoArtist = data.artists[0]
      artistIdName = infoArtist.idArtist
      artistName.textContent = infoArtist.strArtist
      let img = createEl('img', 'posterImg')
      img.setAttribute('src', infoArtist.strArtistFanart)
      let poster = document.querySelector('.poster')
      poster.appendChild(img)
      allInfo.appendChild(artistName)
      allInfo.appendChild(poster)

      let bio = createEl('p', 'bioText')
      bio.textContent = infoArtist.strBiographyEN
      let info = document.querySelector('.info')
      info.appendChild(bio)
      allInfo.appendChild(info)
      getVideos(artistIdName)

    })
}

const getVideos=(el)=>{
  const videoList=req+ 'mvid.php?i=' + el
  fetch(videoList)
  .then(response=>response.json())
   .then(data=>{
 printVideos(data.mvids)
   })
}

const printVideos=(el)=>{
  for (let i = 0; i < 4; i++){
let videoName=createEl('p','videoName')
  videoName.textContent=el[i].strTrack
  let video=createEl('iframe','vid')
  
  let baseVideoUrl = 'https://www.youtube.com/embed/';
  let videosUrl = el[i].strMusicVid;
  let splitedUrl = videosUrl.split('=')
  let videoId = splitedUrl[1];
  video.src = baseVideoUrl + videoId;
  let videos=document.querySelector('.videos')
  videos.appendChild(videoName)
  videos.appendChild(video)
  allInfo.appendChild(videos)
  }
}
const resetVideos = () => {
  videos.innerHTML=''
}


    
home.addEventListener('click', function () {
  searchBar.style.visibility = 'visible'
  nav.style.visibility = 'hidden'
  input.value = ''
 resetVideos()
  removeArtist()
  removeAlbums()
  removeAlbumAndSongs()

})

const getAlbums = (el) => {
  removeArtist()
  const albumList = req + 'album.php?i=' + el
  fetch(albumList)
    .then(response => response.json())
    .then(data => {
      data.album.forEach(element =>
        printAlbumList(element))
    })

}

const printAlbumList = (el) => {
  let albumIdData = el.idAlbum
  let oneAlbumObject = createEl('div', 'oneAlbumObject')
  let oneAlbumName = createEl('p', 'oneAlbumName')
  oneAlbumName.textContent = el.strAlbum
  oneAlbumObject.appendChild(oneAlbumName)
  albumsList.appendChild(oneAlbumObject)
  oneAlbumName.addEventListener('click', function () {

    getSingleAlbum(albumIdData)
    getSongs(albumIdData)

  })
}

searchAlbums.addEventListener('click', function () {
  nav.style.visibility = 'hidden'
  goOnArtist.style.visibility = 'visible'
  removeAlbumAndSongs()
  resetVideos()
  getAlbums(artistIdName)

})

goOnArtist.addEventListener('click', function () {
  goOnArtist.style.visibility = 'hidden'
  removeAlbums()
  getArtist()
})

const getSingleAlbum = (el) => {
  removeAlbums()

  goOnArtist.style.visibility = 'hidden'

  nav.style.visibility = 'visible'

  const oneAlbum = req + 'album.php?m=' + el
  fetch(oneAlbum)
    .then(response => response.json())
    .then(data => {
      let albumInfo = data.album[0]

      let albumName = createEl('p', 'albumName')
      albumName.textContent = albumInfo.strAlbum
      let albumCover = createEl('div', 'albumCover')
      let albumImg = createEl('img', 'albumImg')
      albumImg.setAttribute('src', albumInfo.strAlbumThumb)
      albumCover.appendChild(albumImg)
      albumContainer.appendChild(albumName)
      albumContainer.appendChild(albumCover)
      albumAndSongs.appendChild(albumContainer)

    })
}

const getSongs = (el) => {
  const printSongs = req + 'track.php?m=' + el
  fetch(printSongs)
    .then(response => response.json())
    .then(data => {

      data.track.forEach(element =>
        printAllSongs(element))


    })
}
const printAllSongs = (el) => {
  let song = createEl('p', 'song')
  let albumAndSongs = document.querySelector('.albumAndSongs')
  song.textContent = el.strTrack
  let tracks = document.querySelector('.tracks')
  tracks.appendChild(song)
  albumAndSongs.appendChild(tracks)

}
const removeArtist = () => {
  let img = document.querySelector('.posterImg');
  img ? img.parentElement.removeChild(img) : ''
  let bio = document.querySelector('.bioText')
  bio ? bio.parentElement.removeChild(bio) : ''

}

const removeAlbumAndSongs = () => {
  let tracks = document.querySelector('.tracks')
  artistName.innerHTML = ''
  albumContainer.innerHTML = ''
  tracks.innerHTML = ''
}
const removeAlbums = () => {
  albumsList.innerHTML = ''
}

