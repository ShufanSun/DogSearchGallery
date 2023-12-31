/**
 * Author: Shufan Sun
 * Created on Sep 29th, 2023
 */
import './App.css';
import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import FullScreenImage from './FullScreenImage';

const animatedComponents = makeAnimated();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [], // Store the list of dog breeds
      selectedBreeds: [], // Store selected dog breeds
      breedImages: {}, // Store images for each dog breed
      imageData: { breedName: '', imgIndex: 0 }, // Store the currently displayed image
      fullScreenImage: null, // State to track full-screen image display
      currentBreedIndex: 0, // Track the currently displayed breed index
    };
  }

  componentDidMount() {
    // Fetch the list of dog breeds from the API when the component mounts
    this.fetchDogBreeds();
  }

  fetchDogBreeds() {
    // Function to fetch the list of dog breeds from the API
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => {
        // Store the list of dog breeds in the component's state
        this.setState({ dogs: Object.keys(data.message) });
      })
      .catch((error) => {
        console.error('Error fetching dog breeds:', error);
      });
  }

  imgAction = (action) => {
    const { imageData, currentBreedIndex } = this.state;
    const breedName = imageData.breedName;
    const breedImages = this.state.breedImages[breedName];
    const totalImages = breedImages.length;

    //functions that could be implemented using buttons
    if (action === 'next-img') {
      // Increment the index to show the next image
      const nextIndex = (currentBreedIndex + 1) % totalImages;
      this.setState({
        imageData: { breedName, imgIndex: nextIndex },
      });
    } else if (action === 'prev-img') {
      // Decrement the index to show the previous image
      const prevIndex = (currentBreedIndex - 1 + totalImages) % totalImages;
      this.setState({
        imageData: { breedName, imgIndex: prevIndex },
      });
    }
  };

  findByBreed() {
    const { selectedBreeds } = this.state;
    // Function to fetch images for selected dog breeds

    if (selectedBreeds.length === 0) {
      console.error('No breeds selected.');
      return;
    }

    const fetchPromises = selectedBreeds.map((selectedBreed) => {
      const url = `https://dog.ceo/api/breed/${selectedBreed.value}/images`;
      return fetch(url)
        .then((response) => response.json())
        .then((result) => ({
          breedName: selectedBreed.value,
          images: result.message,
        }));
    });

    Promise.all(fetchPromises)
      .then((results) => {
        const breedImages = {};

        results.forEach((result) => {
          breedImages[result.breedName] = result.images;
        });

        this.setState({ breedImages });
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }

  handleBreedChange = (selectedOptions) => {
    // Function to handle changes in selected dog breeds
    this.setState({ selectedBreeds: selectedOptions });
  };

  viewImage = (breedName, imageIndex) => {
    // Function to display a full-screen image
    this.setState({
      imageData: {
        breedName,
        imgIndex: imageIndex,
      },
      fullScreenImage: this.state.breedImages[breedName][imageIndex],
    });
  };

  closeFullScreenImage = () => {
    // Function to close the full-screen image
    this.setState({ fullScreenImage: null });
  };

    // Function to scroll to the next breed gallery
  scrollToNextGallery = () => {
    const { currentBreedIndex, selectedBreeds } = this.state;
    const nextIndex = (currentBreedIndex + 1) % selectedBreeds.length;
    this.setState({ currentBreedIndex: nextIndex });
    const nextBreed = selectedBreeds[nextIndex].value;
    document.getElementById(nextBreed).scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const {
      dogs,
      breedImages,
      selectedBreeds,
      imageData,
      fullScreenImage,
      currentBreedIndex,
    } = this.state;

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
        {/* Select component for choosing dog breeds */}
        <Select
          options={breedOptions}
          isMulti
          value={selectedBreeds}
          onChange={this.handleBreedChange}
          components={animatedComponents}
        />
        {/* Button to fetch images for selected breeds */}
        <button onClick={() => this.findByBreed()}>Find By Breed</button>
        {fullScreenImage && (
          // Full-screen image display when an image is clicked
          <div
            className="full-screen-overlay"
            onClick={() => this.closeFullScreenImage()}
          >
            <img
              src={fullScreenImage}
              className="full-screen-image"
              alt={`Dog ${imageData.imgIndex}`}
            />
            {/* Buttons for navigating between full-screen images */}
            <button
              className="full-screen-nav-button prev"
              onClick={() => this.imgAction('prev-img')}
            >
              Previous
            </button>
            <button
              className="full-screen-nav-button next"
              onClick={() => this.imgAction('next-img')}
            >
              Next
            </button>
          </div>
        )}
        {selectedBreeds.map((selectedBreed, index) => (
          <div key={index} id={selectedBreed.value}>
            {/* Display the breed name */}
            <h2>{selectedBreed.value}</h2>
            {breedImages[selectedBreed.value] &&
            breedImages[selectedBreed.value].length > 0 ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
              >
                <Masonry gutter="20px">
                  {/* Display breed images in a responsive grid */}
                  {breedImages[selectedBreed.value].map(
                    (imageURL, imageIndex) => (
                      <img
                        key={imageIndex}
                        src={imageURL}
                        style={{
                          display: 'block',
                          maxWidth: '100%',
                          height: 'auto',
                          cursor: 'pointer',
                        }}
                        alt={`Dog ${imageIndex}`}
                        onClick={() =>
                          this.viewImage(selectedBreed.value, imageIndex)
                        }
                      />
                    )
                  )}
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              // Display a message if no images are found for the breed
              <p>No images found for {selectedBreed.value}.</p>
            )}
          </div>
        ))}
        {/* Link to a personal website */}
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
        <button 
        onClick={() => this.scrollToNextGallery()}
        className="scroll-button">
          Scroll to Next Breed Gallery
        </button>
      </div>
    );
  }
}

export default App;
