import './App.css';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      selectedBreedImage: null,
    };
  }

  componentDidMount() {
    this.fetchDogBreeds();
  }

  fetchDogBreeds() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ dogs: Object.keys(data.message) });
      })
      .catch((error) => {
        console.error('Error fetching dog breeds:', error);
      });
  }

  findByBreed() {
    const { dogs } = this.state;
    const selectedBreed = document.getElementById('breedList').value;

    if (!selectedBreed) {
      console.error('No breed selected.');
      return;
    }

    const url = `https://dog.ceo/api/breed/${selectedBreed}/images`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.getImageURL(data.message);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }

  // getImageURL(data) {
  //   // Get a random image URL
  //   const randomNumber = Math.floor(Math.random() * data.length);
  //   const randomImageURL = data[randomNumber];

  //   // Update the component's state to display the selected image
  //   this.setState({ selectedBreedImage: randomImageURL });
  // }
  findByBreed() {
    const selectedBreed = document.getElementById('breedList').value;
  
    if (!selectedBreed) {
      console.error('No breed selected.');
      return;
    }
  
    const url = `https://dog.ceo/api/breed/${selectedBreed}/images`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setImageURLs(data.message);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }
  
  setImageURLs(imageURLs) {
    // Update the component's state to store all image URLs for the selected breed
    this.setState({ selectedBreedImages: imageURLs });
  }

  render() {
    const { dogs, selectedBreedImages } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            <em>Welcome to My Dog Search App</em>
          </h1>
        </header>
        <select id="breedList">
          {dogs.map((dogBreed) => (
            <option key={dogBreed} value={dogBreed}>
              {dogBreed}
            </option>
          ))}
        </select>
        <button onClick={() => this.findByBreed()}>Find By Breed</button>
        {/* <div id="listImageContainer">
          {selectedBreedImage && (
            <img
              src={selectedBreedImage}
              alt={`Dog ${dogs.indexOf(selectedBreedImage)}`}
            />
          )}
        </div> */}
        <div id="listImageContainer">
        {selectedBreedImages && selectedBreedImages.length > 0 ? (
          selectedBreedImages.map((imageURL, index) => (
            <img key={index} src={imageURL} alt={`Dog ${index}`} />
          ))
        ) : (
          <p>No images found for the selected breed.</p>
        )}
      </div>
        <a
          className="App-link"
          href="https://shufansun.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Link to my personal website!</strong>
        </a>
      </div>
    );
  }
}

export default App;
