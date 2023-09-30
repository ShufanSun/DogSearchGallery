// Author: Shufan Sun
//Creation date: 2023. 9.29
import './App.css';
import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import FullScreenImage from './FullScreenImage'; // Import the FullScreenImage component

const animatedComponents = makeAnimated();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      selectedBreeds: [],
      breedImages: {},
      imageData: { img: '', i: 0 },
      fullScreenImage: null, // State to track full-screen image display
    };
  }


  componentDidMount() {
    // When the component mounts, fetch the list of dog breeds from the API.
    this.fetchDogBreeds();
  }

  fetchDogBreeds() {
    // Function to fetch the list of dog breeds from the API.
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => {
        // Store the list of dog breeds in the component's state.
        this.setState({ dogs: Object.keys(data.message) });
      })
      .catch((error) => {
        console.error('Error fetching dog breeds:', error);
      });
  }

  imgAction = (action) => {
    const { imageData, selectedBreeds } = this.state;
    const currentBreedIndex = imageData.i;
    const currentBreed = selectedBreeds[currentBreedIndex].value;
    const breedImages = this.state.breedImages[currentBreed];
    const totalImages = breedImages.length;
  
 
  };
  

  findByBreed() {
    // Function to fetch images for selected dog breeds.
    const { selectedBreeds } = this.state;

    if (selectedBreeds.length === 0) {
      console.error('No breeds selected.');
      return;
    }

    const fetchPromises = selectedBreeds.map((selectedBreed) => {
      const url = `https://dog.ceo/api/breed/${selectedBreed.value}/images`;
      return fetch(url)
        .then((response) => response.json());
    });

    Promise.all(fetchPromises)
      .then((results) => {
        const breedImages = {};

        results.forEach((result, index) => {
          const breedName = selectedBreeds[index].value;
          breedImages[breedName] = result.message;
        });

        this.setState({ breedImages });
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }

  handleBreedChange = (selectedOptions) => {
    // Function to handle changes in selected dog breeds.
    this.setState({ selectedBreeds: selectedOptions });
  };

  viewImage = (img, i) => {
    // Set the full-screen image in the state when an image is clicked
    this.setState({ fullScreenImage: img });
  };

  closeFullScreenImage = () => {
    // Close the full-screen image
    this.setState({ fullScreenImage: null });
  };
  render() {
    const { dogs, breedImages, selectedBreeds, imageData ,fullScreenImage} = this.state;

    const breedOptions = dogs.map((dogBreed) => ({
      value: dogBreed,
      label: dogBreed,
    }));

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            <em>Welcome to My Dog Search App</em>
          </h1>
        </header>
        <Select
          options={breedOptions}
          isMulti
          value={selectedBreeds}
          onChange={this.handleBreedChange}
          components={animatedComponents}
        />
        <button onClick={() => this.findByBreed()}>Find By Breed</button>
        {imageData.img && (
          <div style={{
            width: '100%',
            height: '100vh',
            background: 'black',
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>

          </div>
        )}
        <div id="listImageContainer">
          {selectedBreeds.map((selectedBreed, index) => (
            <div key={index}>
              <h2>{selectedBreed.value}</h2>
              {breedImages[selectedBreed.value] && breedImages[selectedBreed.value].length > 0 ? (
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                  <Masonry gutter="20px">
                    {breedImages[selectedBreed.value].map((imageURL, imageIndex) => (
                      <img
                        key={imageIndex}
                        src={imageURL}
                        style={{ display: "block", maxWidth: "100%", height: "auto", cursor: 'pointer' }}
                        alt={`Dog ${imageIndex}`}
                        onClick={() => this.viewImage(imageURL, imageIndex)}
                      />
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              ) : (
                <p>No images found for {selectedBreed.value}.</p>
              )}
            </div>
          ))}
        </div>
        <a
          className="App-link"
          href="https://shufansun.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Link to my personal website!</strong>
        </a>
        {fullScreenImage && (
          <FullScreenImage
            imageUrl={fullScreenImage}
            onClose={this.closeFullScreenImage}
          />
        )}
      </div>
    );
  }
}

export default App;
