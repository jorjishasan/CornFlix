# NetflixGPT

- Create React App
- Configured TailwindCSS
- Header
- Routing App
- Login Form
- SignUp Form
- Form Validation
- useRef() Hooks
- FireBase Setup
- Deploying our app to production(locally) using firebase
- Create Sign Up user account in Firebase
- Implement Sign In user API
- Created a redux store using redux store with userSlice
- Implemented Sign Out
- Update Profile API
- Fetch Movies from TMDB
- BugFix: Sign Up user displayName and Profile Picture update issue
- Unsubscribed from the onAuthChange callback
- Register TMDB API and setup the 'now playing' movie list
- Custom Hook for 'Now Playing Movies'
- Create MovieSlice
- Update Store with Movie Data
- Planning for Main Container and Secondary Container
- Fetch data for trailer Video
- Update Store with Trailer video data
- Embed yt video and make it autoplay with muted
- Build Secondary Component
- Build MovieList
- Build MovieCard
- TMDB image CDN
- Made the image page looking good using tailwind
- usePopularMovies custom hook
- Gpt Search Page
- Gpt Search Bar
- Multi language support (lang config, langSlice)
- Gpt Search Page
- Gpt Search Bar
- Multi language support (lang config, langSlice)

# Features

- Login/Sign Up
  - Sign In / Sign Up form
  - redirect to Browse Page
- Browse

  - Header
  - Main Movie
    - Trailer in Background
    - Title & Description
    - MovieSuggestions
      - MovieList \* Netflix

- Netflix GPT
  - Search Bar
  - Movie Suggestions

Suppose I have three components <Header/>, <Browse/>, <Login/>

I want <Header/> to be stick on each navigation. Navigations are like:

- if path is "/" it will render 'Login' component
- if path is "/Browse" it will render 'Browse' component

Tools i've used here 'react-router-dom', Now configure the routing In top level Component 'App.js'
